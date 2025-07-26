import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, BookOpen, Calendar, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArticleDetails {
  id: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  image_url?: string;
  created_at: string;
}

const ArticleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [article, setArticle] = useState<ArticleDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && article) {
      const title = language === 'ar' ? article.title_ar : article.title_en;
      try {
        await navigator.share({
          title: title,
          text: title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: t('article.linkCopied', 'Link Copied!', 'تم نسخ الرابط!'),
          description: t('article.linkCopiedDesc', 'Article link copied to clipboard', 'تم نسخ رابط المقال إلى الحافظة'),
        });
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse">
              <div className="bg-muted h-64 rounded-lg mb-8"></div>
              <div className="bg-muted h-8 rounded mb-4"></div>
              <div className="bg-muted h-4 rounded mb-2"></div>
              <div className="bg-muted h-4 rounded w-3/4 mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-muted h-4 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">
              {t('article.notFound', 'Article Not Found', 'المقال غير موجود')}
            </h1>
            <Link to="/articles">
              <Button variant="ocean">
                {t('article.backToArticles', 'Back to Articles', 'العودة إلى المقالات')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = language === 'ar' ? article.title_ar : article.title_en;
  const content = language === 'ar' ? article.content_ar : article.content_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20">
        {/* Navigation */}
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Link to="/articles">
            <Button variant="ghost" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('article.backToArticles', 'Back to Articles', 'العودة إلى المقالات')}
            </Button>
          </Link>
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 pb-20 max-w-4xl">
          {/* Article Header */}
          <header className="mb-12">
            {/* Article Image */}
            {article.image_url && (
              <div className="mb-8">
                <img
                  src={article.image_url}
                  alt={title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-ocean"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="space-y-6">
              <h1 className={`text-3xl md:text-5xl font-bold text-foreground leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {title}
              </h1>
              
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg">{formatDate(article.created_at)}</span>
                </div>
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Share2 className="h-4 w-4" />
                  {t('article.share', 'Share', 'مشاركة')}
                </Button>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className={`prose prose-lg max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
            <div 
              className="text-foreground leading-relaxed text-lg space-y-6"
              style={{ whiteSpace: 'pre-line' }}
            >
              {content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button
                onClick={handleShare}
                variant="ocean"
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Share2 className="h-4 w-4" />
                {t('article.shareArticle', 'Share This Article', 'شارك هذا المقال')}
              </Button>
              
              <Link to="/articles">
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <BookOpen className="h-4 w-4" />
                  {t('article.moreArticles', 'More Articles', 'المزيد من المقالات')}
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleDetailsPage;