import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: {
    id: string;
    title_en: string;
    title_ar: string;
    content_en: string;
    content_ar: string;
    image_url?: string;
    created_at: string;
  };
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const { t, language } = useLanguage();

  const articleTitle = language === 'ar' ? article.title_ar : article.title_en;
  const articleContent = language === 'ar' ? article.content_ar : article.content_en;
  
  // استخراج النص من HTML للمعاينة
  const getPlainText = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const plainContent = getPlainText(articleContent);
  const contentPreview = plainContent.length > 150 
    ? plainContent.substring(0, 150) + '...' 
    : plainContent;

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-ocean transition-all duration-500 animate-fade-in-up">
      <div className="relative overflow-hidden">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={articleTitle}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-elegant flex items-center justify-center">
            <span className="text-primary-foreground text-lg font-semibold">
              {t('article.noImage', 'No Image Available', 'لا توجد صورة متاحة')}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{articleTitle}</h3>
            <div className="flex items-center text-muted-foreground text-sm mb-3">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
              {contentPreview}
            </p>
          </div>

          <Link to={`/article/${article.id}`}>
            <Button variant="ocean" className="w-full">
              {t('article.readMore', 'Read More', 'اقرأ المزيد')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};