import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { YachtLoader } from '@/components/ui/loading-spinner';

interface ContactInfo {
  id: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
}

export const AdminContactPage = () => {
  const { requireAuth, loading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: '',
    email: '',
    phone: '',
    whatsapp: ''
  });

  useEffect(() => {
    if (!requireAuth()) return;
    fetchContactInfo();
  }, [requireAuth]);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContactInfo({
          id: data.id,
          email: data.email,
          phone: data.phone || '',
          whatsapp: data.whatsapp || ''
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل معلومات التواصل",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('contact_info')
        .upsert({
          id: contactInfo.id || undefined,
          email: contactInfo.email,
          phone: contactInfo.phone || null,
          whatsapp: contactInfo.whatsapp || null
        });

      if (error) throw error;

      toast({
        title: "تم الحفظ",
        description: "تم حفظ معلومات التواصل بنجاح",
      });
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ معلومات التواصل",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <YachtLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">إدارة معلومات التواصل</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>معلومات التواصل</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">رقم الواتساب</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={saving}
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};