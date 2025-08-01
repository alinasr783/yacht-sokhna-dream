import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, User } from 'lucide-react';

const AdminLoginPage = () => {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check admin credentials
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (adminData) {
        // Store admin session in localStorage
        localStorage.setItem('admin_session', JSON.stringify({
          id: adminData.id,
          email: adminData.email,
          loginTime: Date.now()
        }));

        toast({
          title: t('admin.loginSuccess', 'Login Successful', 'تم تسجيل الدخول بنجاح'),
          description: t('admin.welcome', 'Welcome to admin dashboard', 'مرحباً بك في لوحة الادارة'),
        });

        // Force page reload to ensure admin session is recognized
        window.location.href = '/admin/dashboard';
      } else {
        toast({
          title: t('admin.loginError', 'Login Failed', 'فشل تسجيل الدخول'),
          description: t('admin.invalidCredentials', 'Invalid email or password', 'بريد إلكتروني أو كلمة مرور غير صحيحة'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('admin.loginError', 'Login Failed', 'فشل تسجيل الدخول'),
        description: t('admin.loginErrorMessage', 'An error occurred during login', 'حدث خطأ أثناء تسجيل الدخول'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md shadow-luxury">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto bg-gradient-ocean p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('admin.title', 'Admin Login', 'دخول الادارة')}
                </CardTitle>
                <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('admin.subtitle', 'Access the admin dashboard', 'الوصول إلى لوحة الادارة')}
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={isRTL ? 'text-right block' : ''}>
                      {t('admin.email', 'Email', 'البريد الإلكتروني')}
                    </Label>
                    <div className="relative">
                      <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('admin.emailPlaceholder', 'Enter your email', 'أدخل بريدك الإلكتروني')}
                        className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className={isRTL ? 'text-right block' : ''}>
                      {t('admin.password', 'Password', 'كلمة المرور')}
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('admin.passwordPlaceholder', 'Enter your password', 'أدخل كلمة المرور')}
                        className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="ocean"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading 
                      ? t('admin.loggingIn', 'Logging in...', 'جارِ تسجيل الدخول...')
                      : t('admin.login', 'Login', 'دخول')
                    }
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('admin.note', 'Only authorized administrators can access this area', 'يمكن للمديرين المعتمدين فقط الوصول إلى هذه المنطقة')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLoginPage;