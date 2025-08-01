import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContactInfo } from '@/hooks/useContactInfo';

interface YachtCardProps {
  yacht: {
    id: string;
    name_en: string;
    name_ar: string;
    description_en?: string;
    description_ar?: string;
    price?: number;
    location?: {
      name_en: string;
      name_ar: string;
    };
    images?: Array<{
      image_url: string;
      is_primary?: boolean;
    }>;
  };
}

export const YachtCard = ({ yacht }: YachtCardProps) => {
  const { t, language } = useLanguage();
  const contactInfo = useContactInfo();

  const primaryImage = yacht.images?.find(img => img.is_primary) || yacht.images?.[0];
  const yachtName = language === 'ar' ? yacht.name_ar : yacht.name_en;
  const yachtDescription = language === 'ar' ? yacht.description_ar : yacht.description_en;
  const locationName = yacht.location ? (language === 'ar' ? yacht.location.name_ar : yacht.location.name_en) : '';

  const handleContact = (type: 'whatsapp' | 'phone' | 'email') => {
    switch (type) {
      case 'whatsapp':
        const whatsappNumber = contactInfo.whatsapp || '01158954215';
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`I'm interested in ${yachtName}`)}`);
        break;
      case 'phone':
        const phoneNumber = contactInfo.phone || '01158954215';
        window.open(`tel:${phoneNumber}`);
        break;
      case 'email':
        window.open(`mailto:${contactInfo.email}?subject=${encodeURIComponent(`Inquiry about ${yachtName}`)}`);
        break;
    }
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-ocean transition-all duration-500 animate-fade-in-up">
      <div className="relative overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={yachtName}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-ocean flex items-center justify-center">
            <span className="text-primary-foreground text-lg font-semibold">
              {t('yacht.noImage', 'No Image Available', 'لا توجد صورة متاحة')}
            </span>
          </div>
        )}
        
        {yacht.price && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold">
            ${yacht.price.toLocaleString()}
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">{yachtName}</h3>
            {locationName && (
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{locationName}</span>
              </div>
            )}
            {yachtDescription && (
              <p className="text-muted-foreground text-sm line-clamp-3">
                {yachtDescription}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link to={`/yacht/${yacht.id}`} className="flex-1">
              <Button variant="ocean" className="w-full">
                {t('yacht.viewDetails', 'View Details', 'عرض التفاصيل')}
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleContact('whatsapp')}
                title="WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleContact('email')}
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};