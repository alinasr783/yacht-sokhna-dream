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
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Plus, Edit, Trash2, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string | null;
  description_ar?: string | null;
  google_maps_link?: string | null;
  show_on_homepage?: boolean | null;
}

const AdminLocationsPage = () => {
  const { t, isRTL } = useLanguage();
  const { adminSession, requireAuth } = useAdminAuth();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    google_maps_link: '',
    show_on_homepage: true
  });

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    if (adminSession) {
      fetchLocations();
    }
  }, [adminSession]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.errorFetching', 'Error fetching locations', 'خطأ في جلب المواقع'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const locationData = {
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        description_en: formData.description_en || null,
        description_ar: formData.description_ar || null,
        google_maps_link: formData.google_maps_link || null,
        show_on_homepage: formData.show_on_homepage
      };

      if (editingLocation) {
        const { error } = await supabase
          .from('locations')
          .update(locationData)
          .eq('id', editingLocation.id);

        if (error) throw error;

        toast({
          title: t('admin.success', 'Success', 'نجح'),
          description: t('admin.locationUpdated', 'Location updated successfully', 'تم تحديث الموقع بنجاح'),
        });
      } else {
        const { error } = await supabase
          .from('locations')
          .insert(locationData);

        if (error) throw error;

        toast({
          title: t('admin.success', 'Success', 'نجح'),
          description: t('admin.locationCreated', 'Location created successfully', 'تم إنشاء الموقع بنجاح'),
        });
      }

      setIsDialogOpen(false);
      setEditingLocation(null);
      setFormData({
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
        google_maps_link: '',
        show_on_homepage: true
      });
      fetchLocations();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.errorSaving', 'Error saving location', 'خطأ في حفظ الموقع'),
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name_en: location.name_en,
      name_ar: location.name_ar,
      description_en: location.description_en || '',
      description_ar: location.description_ar || '',
      google_maps_link: location.google_maps_link || '',
      show_on_homepage: location.show_on_homepage ?? true
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete', 'Are you sure you want to delete this location?', 'هل أنت متأكد من حذف هذا الموقع؟'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('admin.success', 'Success', 'نجح'),
        description: t('admin.locationDeleted', 'Location deleted successfully', 'تم حذف الموقع بنجاح'),
      });
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.errorDeleting', 'Error deleting location', 'خطأ في حذف الموقع'),
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
                  {t('admin.manageLocations', 'Manage Locations', 'إدارة المواقع')}
                </h1>
                <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('admin.locationsCount', `${locations.length} locations`, `${locations.length} موقع`)}
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => {
                    setEditingLocation(null);
                    setFormData({
                      name_en: '',
                      name_ar: '',
                      description_en: '',
                      description_ar: '',
                      google_maps_link: '',
                      show_on_homepage: true
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {t('admin.addLocation', 'Add Location', 'إضافة موقع')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLocation 
                      ? t('admin.editLocation', 'Edit Location', 'تعديل الموقع')
                      : t('admin.addLocation', 'Add Location', 'إضافة موقع')
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
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_ar">{t('admin.descAr', 'Description (Arabic)', 'الوصف (عربي)')}</Label>
                      <Textarea
                        id="description_ar"
                        value={formData.description_ar}
                        onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="google_maps_link">{t('admin.googleMapsLink', 'Google Maps Link', 'رابط خرائط جوجل')}</Label>
                    <Input
                      id="google_maps_link"
                      value={formData.google_maps_link}
                      onChange={(e) => setFormData({...formData, google_maps_link: e.target.value})}
                      placeholder="https://maps.google.com/..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show_on_homepage"
                      checked={formData.show_on_homepage}
                      onCheckedChange={(checked) => setFormData({...formData, show_on_homepage: checked as boolean})}
                    />
                    <Label htmlFor="show_on_homepage">
                      {t('admin.showOnHomepage', 'Show on Homepage', 'عرض في الصفحة الرئيسية')}
                    </Label>
                  </div>

                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button type="submit">
                      {editingLocation 
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

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Card key={location.id} className="group hover:shadow-ocean transition-all duration-300">
                <CardHeader>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <CardTitle className={`text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? location.name_ar : location.name_en}
                      </CardTitle>
                    </div>
                    <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(location.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {location.description_en && (
                      <p className={`text-muted-foreground text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? location.description_ar : location.description_en}
                      </p>
                    )}
                    {location.google_maps_link && (
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <a href={location.google_maps_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                            {t('admin.viewOnMaps', 'View on Maps', 'عرض على الخرائط')}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {locations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('admin.noLocations', 'No locations found', 'لا توجد مواقع')}
              </h3>
              <p className="text-muted-foreground">
                {t('admin.addFirstLocation', 'Add your first location to get started', 'أضف أول موقع للبدء')}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLocationsPage;