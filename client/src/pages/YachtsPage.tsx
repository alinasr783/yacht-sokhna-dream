import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { YachtCard } from '@/components/YachtCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead, SEOData } from '@/components/SEOHead';
import { Search, Anchor } from 'lucide-react';
import yachtsHeroImage from '@/assets/yachts-page-hero.jpg';

interface Yacht {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string | null;
  description_ar?: string | null;
  price?: number | null;
  yacht_images: Array<{
    image_url: string;
    is_primary?: boolean | null;
  }>;
  locations?: {
    name_en: string;
    name_ar: string;
  } | null;
}

const YachtsPage = () => {
  const { t, isRTL } = useLanguage();
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYachts = async () => {
      try {
        const { data } = await supabase
          .from('yachts')
          .select(`
            *,
            yacht_images(image_url, is_primary),
            locations(name_en, name_ar)
          `)
          .order('created_at', { ascending: false });

        setYachts(data || []);
      } catch (error) {
        console.error('Error fetching yachts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYachts();
  }, []);

  const filteredYachts = yachts.filter(yacht => {
    const searchLower = searchTerm.toLowerCase();
    return yacht.name_en.toLowerCase().includes(searchLower) ||
           yacht.name_ar.includes(searchTerm) ||
           (yacht.description_en?.toLowerCase().includes(searchLower)) ||
           (yacht.description_ar?.includes(searchTerm));
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...SEOData.yachts} />
      <Header />
      
      {/* Page Header */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${yachtsHeroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Anchor className="h-16 w-16 mr-4 text-white" />
              <h1 className={`text-5xl md:text-7xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('yachts.pageTitle', 'Our Yacht Fleet', 'أسطول اليخوت لدينا')}
              </h1>
            </div>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 leading-relaxed text-white/90">
              {t('yachts.pageDescription', 
                'Discover our premium collection of luxury yachts, each offering unique experiences on the pristine waters of El Sokhna',
                'اكتشف مجموعتنا المميزة من اليخوت الفاخرة، كل منها يقدم تجارب فريدة على المياه النقية للعين السخنة'
              )}
            </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <Input
              type="text"
              placeholder={t('yachts.searchPlaceholder', 'Search yachts...', 'البحث عن اليخوت...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-background/10 backdrop-blur-md border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/70`}
            />
          </div>
          </div>
        </div>
      </section>

      {/* Yachts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-64 rounded-lg mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredYachts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredYachts.map((yacht) => (
                <YachtCard key={yacht.id} yacht={{
                  ...yacht,
                  location: yacht.locations,
                  images: yacht.yacht_images
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Anchor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t('yachts.noResults', 'No yachts found', 'لم يتم العثور على يخوت')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? t('yachts.noSearchResults', 'Try adjusting your search terms', 'حاول تعديل مصطلحات البحث')
                  : t('yachts.noYachts', 'No yachts available at the moment', 'لا توجد يخوت متاحة في الوقت الحالي')
                }
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="ocean">
                  {t('yachts.clearSearch', 'Clear Search', 'مسح البحث')}
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

export default YachtsPage;