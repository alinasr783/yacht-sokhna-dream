import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LocationCardProps {
  location: {
    id: string;
    name_en: string;
    name_ar: string;
    description_en?: string;
    description_ar?: string;
    google_maps_link?: string;
    images?: Array<{
      image_url: string;
      is_primary?: boolean;
    }>;
  };
  yachtCount?: number;
}

export const LocationCard = ({ location, yachtCount }: LocationCardProps) => {
  const { t, language } = useLanguage();

  const locationName = language === 'ar' ? location.name_ar : location.name_en;
  const locationDescription = language === 'ar' ? location.description_ar : location.description_en;

  const handleMapClick = () => {
    if (location.google_maps_link) {
      window.open(location.google_maps_link, '_blank');
    }
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-ocean transition-all duration-500 animate-fade-in-up">
      <div className="relative overflow-hidden">
        {location.images?.[0] ? (
          <img
            src={location.images[0].image_url}
            alt={locationName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-48 bg-gradient-sunset flex items-center justify-center">
            <div className="text-center text-primary-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2 animate-float" />
              <h3 className="text-2xl font-bold">{locationName}</h3>
            </div>
          </div>
        )}
        
        {yachtCount !== undefined && (
          <div className="absolute top-4 right-4 bg-white/90 text-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {yachtCount} {t('location.yachts', 'Yachts', 'يخت')}
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">{locationName}</h3>
          </div>
          {locationDescription && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {locationDescription}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/location/${location.id}`} className="flex-1">
              <Button variant="ocean" className="w-full text-sm font-medium">
                {t('location.viewYachts', 'View Yachts', 'عرض اليخوت')}
              </Button>
            </Link>
            
            {location.google_maps_link && (
              <Button
                variant="ghost"
                onClick={handleMapClick}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-600 hover:bg-transparent text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                {t('location.openMap', 'Open Map', 'فتح الخريطة')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};