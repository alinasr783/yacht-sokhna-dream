import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { YachtCard } from '@/components/YachtCard';
import { LocationCard } from '@/components/LocationCard';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-video-still.jpg';
import { Anchor, MapPin } from 'lucide-react';
import { YachtLoader } from '@/components/ui/loading-spinner';

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
  locations?: {
    name_en: string;
    name_ar: string;
  };
}

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  google_maps_link?: string;
}

const Index = () => {
  const { t } = useLanguage();
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch yachts with images and locations
        const { data: yachtsData } = await supabase
          .from('yachts')
          .select(`
            *,
            yacht_images(image_url, is_primary),
            locations(name_en, name_ar)
          `)
          .limit(6);

        // Fetch locations
        const { data: locationsData } = await supabase
          .from('locations')
          .select('*')
          .limit(6);

        setYachts(yachtsData || []);
        setLocations(locationsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center animate-[slowFloat_20s_ease-in-out_infinite]"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full animate-[float_6s_ease-in-out_infinite]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {t('siteName', 'ELSOKHNA YACHTS', 'يخوت العين السخنة')}
          </h1>
          <h2 className="text-2xl md:text-4xl mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            {t('hero.subtitle', 'Luxury Yacht Experiences', 'تجارب يخوت فاخرة')}
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
            {t('hero.description', 
              'Discover the pristine waters of El Sokhna with our premium yacht collection',
              'اكتشف المياه النقية للعين السخنة مع مجموعة اليخوت المميزة لدينا'
            )}
          </p>
          <div className="space-x-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <Button variant="hero" size="xl">
              {t('hero.exploreYachts', 'Explore Yachts', 'استكشف اليخوت')}
            </Button>
            <Button variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              {t('hero.viewLocations', 'View Locations', 'عرض المواقع')}
            </Button>
          </div>
        </div>
      </section>

      {/* Available Yachts Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Anchor className="h-8 w-8 text-primary mr-2" />
              <h2 className="text-4xl font-bold text-foreground">
                {t('yachts.title', 'Available Yachts', 'اليخوت المتاحة')}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('yachts.description', 
                'Choose from our exceptional fleet of luxury yachts',
                'اختر من أسطولنا الاستثنائي من اليخوت الفاخرة'
              )}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <YachtLoader size="lg" />
            </div>
          ) : yachts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yachts.map((yacht) => (
                <YachtCard key={yacht.id} yacht={{
                  ...yacht,
                  location: yacht.locations,
                  images: yacht.yacht_images
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t('yachts.noYachts', 'No yachts available at the moment', 'لا توجد يخوت متاحة في الوقت الحالي')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-primary mr-2" />
              <h2 className="text-4xl font-bold text-foreground">
                {t('locations.title', 'Premium Locations', 'المواقع المميزة')}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('locations.description', 
                'Explore breathtaking destinations around El Sokhna',
                'استكشف الوجهات الخلابة حول العين السخنة'
              )}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <YachtLoader size="lg" />
            </div>
          ) : locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t('locations.noLocations', 'No locations available at the moment', 'لا توجد مواقع متاحة في الوقت الحالي')}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;