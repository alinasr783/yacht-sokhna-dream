import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { YachtCard } from '@/components/YachtCard';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react';

interface LocationDetails {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  google_maps_link?: string;
}

interface Yacht {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  price?: number;
  yacht_images: Array<{
    image_url: string;
    is_primary?: boolean;
  }>;
}

const LocationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, isRTL } = useLanguage();
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!id) return;
      
      try {
        // Fetch location details
        const { data: locationData } = await supabase
          .from('locations')
          .select('*')
          .eq('id', id)
          .single();

        // Fetch yachts at this location
        const { data: yachtsData } = await supabase
          .from('yachts')
          .select(`
            *,
            yacht_images(image_url, is_primary)
          `)
          .eq('location_id', id);

        setLocation(locationData ? {
          ...locationData,
          description_en: locationData.description_en || undefined,
          description_ar: locationData.description_ar || undefined,
          google_maps_link: locationData.google_maps_link || undefined
        } : null);
        setYachts(yachtsData ? yachtsData.map(yacht => ({
          ...yacht,
          description_en: yacht.description_en || undefined,
          description_ar: yacht.description_ar || undefined,
          features_en: yacht.features_en || undefined,
          features_ar: yacht.features_ar || undefined,
          currency: yacht.currency || undefined,
          price: yacht.price || undefined,
          price_from: yacht.price_from || undefined,
          price_to: yacht.price_to || undefined,
          location_id: yacht.location_id || undefined,
          yacht_images: yacht.yacht_images.map(img => ({
            ...img,
            is_primary: img.is_primary ?? false
          }))
        })) : []);
      } catch (error) {
        console.error('Error fetching location data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="bg-muted h-64 rounded-lg mb-8"></div>
              <div className="bg-muted h-8 rounded mb-4"></div>
              <div className="bg-muted h-4 rounded mb-2"></div>
              <div className="bg-muted h-4 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">
              {t('location.notFound', 'Location Not Found', 'الموقع غير موجود')}
            </h1>
            <Link to="/locations">
              <Button variant="ocean">
                {t('location.backToLocations', 'Back to Locations', 'العودة إلى المواقع')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const locationName = language === 'ar' ? location.name_ar : location.name_en;
  const locationDescription = language === 'ar' ? location.description_ar : location.description_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pb-4">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/locations">
            <Button variant="ghost" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('location.backToLocations', 'Back to Locations', 'العودة إلى المواقع')}
            </Button>
          </Link>
        </div>

        {/* Location Header */}
        <section className="relative bg-gradient-to-br from-primary to-primary-dark text-primary-foreground py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-8">
              <MapPin className="h-16 w-16 mr-4 text-white" />
              <h1 className={`text-5xl md:text-7xl font-bold ${isRTL ? 'text-right' : 'text-left'} text-white`}>
                {locationName}
              </h1>
            </div>
            
            {locationDescription && (
              <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-10 text-white/90 leading-relaxed">
                {locationDescription}
              </p>
            )}

            {location.google_maps_link && (
              <Button
                onClick={() => window.open(location.google_maps_link, '_blank')}
                variant="hero"
                size="lg"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                {t('location.openInMaps', 'Open in Google Maps', 'افتح في خرائط جوجل')}
              </Button>
            )}
          </div>
        </section>

        {/* Available Yachts */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                {t('location.availableYachts', 'Available Yachts at This Location', 'اليخوت المتاحة في هذا الموقع')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t('location.yachtsDescription', 
                  `Discover ${yachts.length} premium yachts available at ${locationName}`,
                  `اكتشف ${yachts.length} يخت مميز متاح في ${locationName}`
                )}
              </p>
            </div>

            {yachts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {yachts.map((yacht) => (
                  <YachtCard 
                    key={yacht.id} 
                    yacht={{
                      ...yacht,
                      images: yacht.yacht_images,
                      location: {
                        name_en: location.name_en,
                        name_ar: location.name_ar
                      }
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t('location.noYachts', 'No Yachts Available', 'لا توجد يخوت متاحة')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t('location.noYachtsDescription', 
                    'There are currently no yachts available at this location. Check back soon!',
                    'لا توجد يخوت متاحة حالياً في هذا الموقع. تحقق مرة أخرى قريباً!'
                  )}
                </p>
                <Link to="/yachts">
                  <Button variant="ocean">
                    {t('location.viewAllYachts', 'View All Yachts', 'عرض جميع اليخوت')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default LocationDetailsPage;