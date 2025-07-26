import { useState } from 'react';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-yacht.png';

export const Header = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navigation = [
    { name: t('nav.home', 'Home', 'الرئيسية'), href: '/' },
    { name: t('nav.yachts', 'Yachts', 'اليخوت'), href: '/yachts' },
    { name: t('nav.locations', 'Locations', 'المواقع'), href: '/locations' },
    { name: t('nav.articles', 'Articles', 'المقالات'), href: '/articles' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link to="/" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <img src={logo} alt="ELSOKHNA" className="h-10 w-10" />
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
                ELSOKHNA
              </div>
              {language === 'ar' && (
                <div className="text-xs text-muted-foreground -mt-1">
                  يخوت العين السخنة
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Language Toggle */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} hover:bg-primary/10`}
            >
              <Globe className="h-4 w-4" />
              <span className="text-lg">{language === 'en' ? '🇸🇦' : '🇬🇧'}</span>
              <span className="hidden sm:inline text-sm">
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in-up">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};