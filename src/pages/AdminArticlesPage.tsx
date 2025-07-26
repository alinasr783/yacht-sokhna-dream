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
import { BookOpen, Plus, Edit, Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  image_url?: string;
  created_at: string;
}

const AdminArticlesPage = () => {
  const { t, isRTL, language } = useLanguage();
  const { adminSession, requireAuth } = useAdminAuth();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    content_en: '',
    content_ar: '',
    image_url: ''
  });

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    if (adminSession) {
      fetchArticles();
    }
  }, [adminSession]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const articleData = {
        title_en: formData.title_en,
        title_ar: formData.title_ar,
        content_en: formData.content_en,
        content_ar: formData.content_ar,
        image_url: formData.image_url || null
      };

      if (editingArticle) {
        await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);
        toast({
          title: t('admin.success', 'Success', 'نجح'),
          description: t('admin.articleUpdated', 'Article updated successfully', 'تم تحديث المقال بنجاح'),
        });
      } else {
        await supabase
          .from('articles')
          .insert(articleData);
        toast({
          title: t('admin.success', 'Success', 'نجح'),
          description: t('admin.articleCreated', 'Article created successfully', 'تم إنشاء المقال بنجاح'),
        });
      }

      setIsDialogOpen(false);
      setEditingArticle(null);
      setFormData({
        title_en: '',
        title_ar: '',
        content_en: '',
        content_ar: '',
        image_url: ''
      });
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.errorSaving', 'Error saving article', 'خطأ في حفظ المقال'),
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title_en: article.title_en,
      title_ar: article.title_ar,
      content_en: article.content_en,
      content_ar: article.content_ar,
      image_url: article.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete', 'Are you sure you want to delete this article?', 'هل أنت متأكد من حذف هذا المقال؟'))) {
      return;
    }

    try {
      await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      toast({
        title: t('admin.success', 'Success', 'نجح'),
        description: t('admin.articleDeleted', 'Article deleted successfully', 'تم حذف المقال بنجاح'),
      });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.errorDeleting', 'Error deleting article', 'خطأ في حذف المقال'),
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!adminSession) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-20">
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
      
      <div className="pt-20 pb-20">
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
                  {t('admin.manageArticles', 'Manage Articles', 'إدارة المقالات')}
                </h1>
                <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('admin.articlesCount', `${articles.length} articles`, `${articles.length} مقال`)}
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => {
                    setEditingArticle(null);
                    setFormData({
                      title_en: '',
                      title_ar: '',
                      content_en: '',
                      content_ar: '',
                      image_url: ''
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {t('admin.addArticle', 'Add Article', 'إضافة مقال')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingArticle 
                      ? t('admin.editArticle', 'Edit Article', 'تعديل المقال')
                      : t('admin.addArticle', 'Add Article', 'إضافة مقال')
                    }
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title_en">{t('admin.titleEn', 'Title (English)', 'العنوان (إنجليزي)')}</Label>
                      <Input
                        id="title_en"
                        value={formData.title_en}
                        onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title_ar">{t('admin.titleAr', 'Title (Arabic)', 'العنوان (عربي)')}</Label>
                      <Input
                        id="title_ar"
                        value={formData.title_ar}
                        onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image_url">{t('admin.imageUrl', 'Image URL', 'رابط الصورة')}</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="content_en">{t('admin.contentEn', 'Content (English)', 'المحتوى (إنجليزي)')}</Label>
                      <Textarea
                        id="content_en"
                        value={formData.content_en}
                        onChange={(e) => setFormData({...formData, content_en: e.target.value})}
                        rows={10}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="content_ar">{t('admin.contentAr', 'Content (Arabic)', 'المحتوى (عربي)')}</Label>
                      <Textarea
                        id="content_ar"
                        value={formData.content_ar}
                        onChange={(e) => setFormData({...formData, content_ar: e.target.value})}
                        rows={10}
                        required
                      />
                    </div>
                  </div>

                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button type="submit">
                      {editingArticle 
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

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="group hover:shadow-ocean transition-all duration-300">
                <CardHeader>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle className={`text-lg line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? article.title_ar : article.title_en}
                      </CardTitle>
                    </div>
                    <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={isRTL ? article.title_ar : article.title_en}
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <p className={`text-muted-foreground text-sm line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? article.content_ar : article.content_en}
                    </p>
                    <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('admin.noArticles', 'No articles found', 'لا توجد مقالات')}
              </h3>
              <p className="text-muted-foreground">
                {t('admin.addFirstArticle', 'Add your first article to get started', 'أضف أول مقال للبدء')}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminArticlesPage;