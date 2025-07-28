import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Anchor, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';

interface Yacht {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  features_en?: string;
  features_ar?: string;
  price?: number;
  price_from?: number;
  price_to?: number;
  currency?: string;
  location_id?: string;
}

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
}

const AdminYachtsPage = () => {
  const { t, isRTL } = useLanguage();
  const { adminSession, requireAuth } = useAdminAuth();
  const { toast } = useToast();
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYacht, setEditingYacht] = useState<Yacht | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    features_en: '',
    features_ar: '',
    price_from: '',
    price_to: '',
    currency: 'USD',
    location_id: '',
    images: [] as string[]
  });

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    if (adminSession) {
      fetchYachts();
      fetchLocations();
    }
  }, [adminSession]);

  const fetchYachts = async () => {
    try {
      const { data } = await supabase
        .from('yachts')
        .select('*')
        .order('created_at', { ascending: false });
      setYachts(data || []);
    } catch (error) {
      console.error('Error fetching yachts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await supabase
        .from('locations')
        .select('id, name_en, name_ar')
        .order('name_en');
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const yachtData = {
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        description_en: formData.description_en || null,
        description_ar: formData.description_ar || null,
        features_en: formData.features_en || null,
        features_ar: formData.features_ar || null,
        price_from: formData.price_from ? parseFloat(formData.price_from) : null,
        price_to: formData.price_to ? parseFloat(formData.price_to) : null,
        currency: formData.currency,
        location_id: formData.location_id || null
      };

      if (editingYacht) {
        await supabase
          .from('yachts')
          .update(yachtData)
          .eq('id', editingYacht.id);
        toast({
          title: t('admin.success', 'Success', 'نجح'),
          description: t('admin.yachtUpdated', 'Yacht updated successfully', 'تم تحديث اليخت بنجاح'),
        });
      } else {
        await supabase
          .from('yachts')
          .insert(yachtData);
        toast({
          title: t('admin.success', 'Success', 'نجح'),
          description: t('admin.yachtCreated', 'Yacht created successfully', 'تم إنشاء اليخت بنجاح'),
        });
      }

      setIsDialogOpen(false);
      setEditingYacht(null);
      setFormData({
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
        features_en: '',
        features_ar: '',
        price_from: '',
        price_to: '',
        currency: 'USD',
        location_id: '',
        images: []
      });
      fetchYachts();
    } catch (error) {
      console.error('Error saving yacht:', error);
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.errorSaving', 'Error saving yacht', 'خطأ في حفظ اليخت'),
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (yacht: Yacht) => {
    setEditingYacht(yacht);
    setFormData({
      name_en: yacht.name_en,
      name_ar: yacht.name_ar,
      description_en: yacht.description_en || '',
      description_ar: yacht.description_ar || '',
      features_en: yacht.features_en || '',
      features_ar: yacht.features_ar || '',
      price_from: yacht.price_from?.toString() || yacht.price?.toString() || '',
      price_to: yacht.price_to?.toString() || yacht.price?.toString() || '',
      currency: yacht.currency || 'USD',
      location_id: yacht.location_id || '',
      images: []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete', 'Are you sure you want to delete this yacht?', 'هل أنت متأكد من حذف هذا اليخت؟'))) {
      return;
    }

    try {
      await supabase
        .from('yachts')
        .delete()
        .eq('id', id);
      
      toast({
        title: t('admin.success', 'Success', 'نجح'),
        description: t('admin.yachtDeleted', 'Yacht deleted successfully', 'تم حذف اليخت بنجاح'),
      });
      fetchYachts();
    } catch (error) {
      console.error('Error deleting yacht:', error);
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.errorDeleting', 'Error deleting yacht', 'خطأ في حذف اليخت'),
        variant: 'destructive',
      });
    }
  };

  if (!adminSession) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="bg-muted h-8 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-muted h-64 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
              <div>
                <h1 className={`text-3xl font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('admin.manageYachts', 'Manage Yachts', 'إدارة اليخوت')}
                </h1>
                <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('admin.yachtsCount', `${yachts.length} yachts`, `${yachts.length} يخت`)}
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => {
                    setEditingYacht(null);
                    setFormData({
                      name_en: '',
                      name_ar: '',
                      description_en: '',
                      description_ar: '',
                      features_en: '',
                      features_ar: '',
                      price_from: '',
                      price_to: '',
                      currency: 'USD',
                      location_id: '',
                      images: []
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {t('admin.addYacht', 'Add Yacht', 'إضافة يخت')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingYacht 
                      ? t('admin.editYacht', 'Edit Yacht', 'تعديل اليخت')
                      : t('admin.addYacht', 'Add Yacht', 'إضافة يخت')
                    }
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name_en">{t('admin.nameEn', 'Name (English)', 'الاسم (إنجليزي)')}</Label>
                      <Input
                        id="name_en"
                        value={formData.name_en}
                        onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name_ar">{t('admin.nameAr', 'Name (Arabic)', 'الاسم (عربي)')}</Label>
                      <Input
                        id="name_ar"
                        value={formData.name_ar}
                        onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="description_en">{t('admin.descEn', 'Description (English)', 'الوصف (إنجليزي)')}</Label>
                      <Textarea
                        id="description_en"
                        value={formData.description_en}
                        onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_ar">{t('admin.descAr', 'Description (Arabic)', 'الوصف (عربي)')}</Label>
                      <Textarea
                        id="description_ar"
                        value={formData.description_ar}
                        onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="features_en">{t('admin.featuresEn', 'Features (English)', 'المميزات (إنجليزي)')}</Label>
                      <Textarea
                        id="features_en"
                        value={formData.features_en}
                        onChange={(e) => setFormData({...formData, features_en: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="features_ar">{t('admin.featuresAr', 'Features (Arabic)', 'المميزات (عربي)')}</Label>
                      <Textarea
                        id="features_ar"
                        value={formData.features_ar}
                        onChange={(e) => setFormData({...formData, features_ar: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="currency">{t('admin.currency', 'Currency', 'العملة')}</Label>
                      <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('admin.selectCurrency', 'Select currency', 'اختر العملة')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EGP">EGP (ج.م)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price_from">{t('admin.priceFrom', 'Price From', 'السعر من')}</Label>
                      <Input
                        id="price_from"
                        type="number"
                        value={formData.price_from}
                        onChange={(e) => setFormData({...formData, price_from: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_to">{t('admin.priceTo', 'Price To', 'السعر إلى')}</Label>
                      <Input
                        id="price_to"
                        type="number"
                        value={formData.price_to}
                        onChange={(e) => setFormData({...formData, price_to: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location_id">{t('admin.location', 'Location', 'الموقع')}</Label>
                    <Select value={formData.location_id} onValueChange={(value) => setFormData({...formData, location_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.selectLocation', 'Select location', 'اختر الموقع')} />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {isRTL ? location.name_ar : location.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <ImageUpload
                    bucketName="yacht-images"
                    entityType="yacht"
                    onImagesChange={(imageUrls) => setFormData({...formData, images: imageUrls})}
                    initialImages={formData.images}
                    maxImages={8}
                  />

                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button type="submit">
                      {editingYacht 
                        ? t('admin.update', 'Update', 'تحديث')
                        : t('admin.create', 'Create', 'إنشاء')
                      }
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      {t('admin.cancel', 'Cancel', 'إلغاء')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Yachts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yachts.map((yacht) => (
              <Card key={yacht.id} className="group hover:shadow-ocean transition-all duration-300">
                <CardHeader>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center gap-2">
                      <Anchor className="h-5 w-5 text-primary" />
                      <CardTitle className={`text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? yacht.name_ar : yacht.name_en}
                      </CardTitle>
                    </div>
                    <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(yacht)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(yacht.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {yacht.description_en && (
                      <p className={`text-muted-foreground text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? yacht.description_ar : yacht.description_en}
                      </p>
                    )}
                    {(yacht.price_from || yacht.price_to || yacht.price) && (
                      <p className={`font-semibold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                        {yacht.price_from && yacht.price_to ? (
                          `${yacht.currency === 'EGP' ? 'ج.م' : '$'}${yacht.price_from.toLocaleString()} - ${yacht.currency === 'EGP' ? 'ج.م' : '$'}${yacht.price_to.toLocaleString()}`
                        ) : yacht.price ? (
                          `${yacht.currency === 'EGP' ? 'ج.م' : '$'}${yacht.price.toLocaleString()}`
                        ) : yacht.price_from ? (
                          `${yacht.currency === 'EGP' ? 'ج.م' : '$'}${yacht.price_from.toLocaleString()}+`
                        ) : ''}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {yachts.length === 0 && (
            <div className="text-center py-12">
              <Anchor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('admin.noYachts', 'No yachts found', 'لا توجد يخوت')}
              </h3>
              <p className="text-muted-foreground">
                {t('admin.addFirstYacht', 'Add your first yacht to get started', 'أضف أول يخت للبدء')}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminYachtsPage;