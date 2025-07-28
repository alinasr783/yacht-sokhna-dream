import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from '@/assets/logo-yacht.png';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ELSOKHNA YACHTS" className="h-8 w-8 rounded-full" />
              <div className="text-2xl font-bold">
                ELSOKHNA <span className="text-accent font-extrabold">YACHTS</span>
              </div>
            </div>
            <p className="text-primary-foreground/80">
              {t('footer.description', 
                'Luxury yacht experiences in the pristine waters of El Sokhna',
                'تجارب يخوت فاخرة في المياه النقية للعين السخنة'
              )}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t('footer.contact', 'Contact Us', 'اتصل بنا')}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>01064283248</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>elsokhnayatch@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{t('footer.location', 'El Sokhna, Egypt', 'العين السخنة، مصر')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t('footer.quickLinks', 'Quick Links', 'روابط سريعة')}
            </h3>
            <div className="space-y-2">
              <Link to="/yachts" className="block hover:text-accent transition-colors">
                {t('footer.allYachts', 'All Yachts', 'جميع اليخوت')}
              </Link>
              <Link to="/locations" className="block hover:text-accent transition-colors">
                {t('footer.locations', 'Locations', 'المواقع')}
              </Link>
              <Link to="/articles" className="block hover:text-accent transition-colors">
                {t('footer.articles', 'Articles', 'المقالات')}
              </Link>
              <Link to="/admin" className="block hover:text-accent transition-colors text-xs opacity-60">
                {t('footer.adminLink', 'Are you the admin?', 'هل أنت المشرف؟')}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 ELSOKHNA YACHTS. {t('footer.rights', 'All rights reserved.', 'جميع الحقوق محفوظة.')}</p>
        </div>
      </div>
    </footer>
  );
};
