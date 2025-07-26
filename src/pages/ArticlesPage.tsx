import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { YachtLoader } from '@/components/ui/loading-spinner';
import articlesHeroImage from '@/assets/articles-page-hero.jpg';

interface Article {
  id: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  image_url?: string;
  created_at: string;
}

const ArticlesPage = () => {
  const { t, language, isRTL } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        setArticles(data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    const searchLower = searchTerm.toLowerCase();
    const title = language === 'ar' ? article.title_ar : article.title_en;
    const content = language === 'ar' ? article.content_ar : article.content_en;
    
    return title.toLowerCase().includes(searchLower) ||
           content.toLowerCase().includes(searchLower);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${articlesHeroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 mr-4" />
            <h1 className={`text-4xl md:text-6xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('articles.pageTitle', 'Latest Articles', 'أحدث المقالات')}
            </h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            {t('articles.pageDescription', 
              'Discover insights, tips, and stories about luxury yacht experiences in El Sokhna and the Red Sea',
              'اكتشف الرؤى والنصائح والقصص حول تجارب اليخوت الفاخرة في العين السخنة والبحر الأحمر'
            )}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <Input
              type="text"
              placeholder={t('articles.searchPlaceholder', 'Search articles...', 'البحث في المقالات...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-background/10 backdrop-blur-md border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/70`}
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-48 rounded-lg mb-4"></div>
                  <div className="bg-muted h-6 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => {
                const title = language === 'ar' ? article.title_ar : article.title_en;
                const content = language === 'ar' ? article.content_ar : article.content_en;
                const excerpt = content.length > 150 ? content.substring(0, 150) + '...' : content;

                return (
                  <Card key={article.id} className="group overflow-hidden shadow-card hover:shadow-ocean transition-all duration-500 animate-fade-in hover:scale-[1.02]" style={{animationDelay: `${0.1 * (filteredArticles.indexOf(article) % 3)}s`}}>
                    {/* Article Image */}
                    <div className="relative overflow-hidden">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-luxury flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-primary-foreground" />
                        </div>
                      )}
                      
                      {/* Date Badge */}
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-md text-sm">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(article.created_at)}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className={`text-xl font-bold text-foreground line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {title}
                        </h3>
                        
                        <p className={`text-muted-foreground line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {excerpt}
                        </p>

                        <Link to={`/article/${article.id}`}>
                          <Button variant="ocean" className={`w-full group ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {t('articles.readMore', 'Read More', 'اقرأ المزيد')}
                            <ArrowRight className={`h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t('articles.noResults', 'No articles found', 'لم يتم العثور على مقالات')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? t('articles.noSearchResults', 'Try adjusting your search terms', 'حاول تعديل مصطلحات البحث')
                  : t('articles.noArticles', 'No articles available at the moment', 'لا توجد مقالات متاحة في الوقت الحالي')
                }
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="ocean">
                  {t('articles.clearSearch', 'Clear Search', 'مسح البحث')}
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

export default ArticlesPage;