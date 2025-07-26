import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LocationCard } from '@/components/LocationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, MapPin } from 'lucide-react';

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  google_maps_link?: string;
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
      <Header />
      
      {/* Page Header */}
      <section className="relative bg-gradient-sunset text-primary-foreground py-20 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-12 w-12 mr-4" />
            <h1 className={`text-4xl md:text-6xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('locations.pageTitle', 'Premium Locations', 'المواقع المميزة')}
            </h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            {t('locations.pageDescription', 
              'Explore the most beautiful and exclusive yacht destinations around El Sokhna, each offering unique experiences and breathtaking views',
              'استكشف أجمل وأحصر وجهات اليخوت حول العين السخنة، كل منها يقدم تجارب فريدة ومناظر خلابة'
            )}
          </p>
          
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