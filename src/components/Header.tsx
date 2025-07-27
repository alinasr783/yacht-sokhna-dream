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
    <header className="relative bg-background border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img src={logo} alt="ELSOKHNA YACHTS" className="h-10 w-10" />
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-lg font-bold bg-gradient-ocean bg-clip-text text-transparent whitespace-nowrap leading-tight">
                ELSOKHNA <span className="text-primary font-extrabold">YACHTS</span>
              </div>
              {language === 'ar' && (
                <div className="text-xs text-muted-foreground -mt-1 whitespace-nowrap">
                  يخوت العين السخنة
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Language Toggle */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} hover:bg-primary/10`}
            >
              <Globe className="h-4 w-4" />
              <span className="text-lg">{language === 'en' ? '🇸🇦' : '🇬🇧'}</span>
              <span className="hidden sm:inline text-sm whitespace-nowrap">
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