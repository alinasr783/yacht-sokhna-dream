import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LocationCard } from '@/components/LocationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead, SEOData } from '@/components/SEOHead';
import { Search, MapPin } from 'lucide-react';
import locationsHeroImage from '@/assets/locations-page-hero.jpg';

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string | null;
  description_ar?: string | null;
  google_maps_link?: string | null;
  yacht_count?: number;
}

const LocationsPage = () => {
  const { t, isRTL } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch locations with yacht count
        const { data: locationsData } = await supabase
          .from('locations')
          .select('*')
          .order('created_at', { ascending: false });

        if (locationsData) {
          // Get yacht count for each location
          const locationsWithCount = await Promise.all(
            locationsData.map(async (location) => {
              const { count } = await supabase
                .from('yachts')
                .select('*', { count: 'exact', head: true })
                .eq('location_id', location.id);
              
              return {
                ...location,
                yacht_count: count || 0
              };
            })
          );
          
          setLocations(locationsWithCount);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(location => {
    const searchLower = searchTerm.toLowerCase();
    return location.name_en.toLowerCase().includes(searchLower) ||
           location.name_ar.includes(searchTerm) ||
           (location.description_en?.toLowerCase().includes(searchLower)) ||
           (location.description_ar?.includes(searchTerm));
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...SEOData.locations} />
      <Header />
      
      {/* Page Header */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${locationsHeroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <MapPin className="h-16 w-16 mr-4 text-white" />
              <h1 className={`text-5xl md:text-7xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('locations.pageTitle', 'Premium Locations', 'المواقع المميزة')}
              </h1>
            </div>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 leading-relaxed text-white/90">
              {t('locations.pageDescription', 
                'Explore the most beautiful and exclusive yacht destinations around El Sokhna, each offering unique experiences and breathtaking views',
                'استكشف أجمل وأحصر وجهات اليخوت حول العين السخنة، كل منها يقدم تجارب فريدة ومناظر خلابة'
              )}
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <Input
              type="text"
              placeholder={t('locations.searchPlaceholder', 'Search locations...', 'البحث عن المواقع...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-background/10 backdrop-blur-md border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/70`}
            />
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-48 rounded-lg mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLocations.map((location) => (
                <LocationCard 
                  key={location.id} 
                  location={location} 
                  yachtCount={location.yacht_count}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t('locations.noResults', 'No locations found', 'لم يتم العثور على مواقع')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? t('locations.noSearchResults', 'Try adjusting your search terms', 'حاول تعديل مصطلحات البحث')
                  : t('locations.noLocations', 'No locations available at the moment', 'لا توجد مواقع متاحة في الوقت الحالي')
                }
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="ocean">
                  {t('locations.clearSearch', 'Clear Search', 'مسح البحث')}
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationsPage;