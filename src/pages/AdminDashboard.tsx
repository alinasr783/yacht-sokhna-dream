import { useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Anchor, MapPin, BookOpen, LogOut, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { t, isRTL } = useLanguage();
  const { adminSession, logout, requireAuth } = useAdminAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  if (!adminSession) return null;

  const dashboardItems = [
    {
      title: t('admin.manageYachts', 'Manage Yachts', 'إدارة اليخوت'),
      description: t('admin.yachtsDesc', 'Add, edit, and delete yachts', 'إضافة وتعديل وحذف اليخوت'),
      icon: Anchor,
      href: '/admin/yachts',
      color: 'bg-gradient-ocean'
    },
    {
      title: t('admin.manageLocations', 'Manage Locations', 'إدارة المواقع'),
      description: t('admin.locationsDesc', 'Add, edit, and delete locations', 'إضافة وتعديل وحذف المواقع'),
      icon: MapPin,
      href: '/admin/locations',
      color: 'bg-gradient-sunset'
    },
    {
      title: t('admin.manageArticles', 'Manage Articles', 'إدارة المقالات'),
      description: t('admin.articlesDesc', 'Add, edit, and delete articles', 'إضافة وتعديل وحذف المقالات'),
      icon: BookOpen,
      href: '/admin/articles',
      color: 'bg-gradient-luxury'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className={`flex items-center justify-between mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <h1 className={`text-4xl font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('admin.dashboard', 'Admin Dashboard', 'لوحة الادارة')}
              </h1>
              <p className={`text-muted-foreground text-lg mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('admin.welcome', `Welcome back, ${adminSession.email}`, `مرحباً بك، ${adminSession.email}`)}
              </p>
            </div>
            <Button onClick={logout} variant="outline" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <LogOut className="h-4 w-4" />
              {t('admin.logout', 'Logout', 'خروج')}
            </Button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dashboardItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Card className="group hover:shadow-ocean transition-all duration-300 cursor-pointer h-full">
                  <CardHeader className="text-center">
                    <div className={`mx-auto ${item.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className={`text-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                      {item.description}
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Button variant="ghost" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Plus className="h-4 w-4" />
                        {t('admin.manage', 'Manage', 'إدارة')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;