import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin, Phone, Mail, Star, Users, Anchor } from 'lucide-react';

interface YachtDetails {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  features_en?: string;
  features_ar?: string;
  price?: number;
  yacht_images: Array<{
    image_url: string;
    is_primary?: boolean;
  }>;
  locations?: {
    id: string;
    name_en: string;
    name_ar: string;
    google_maps_link?: string;
  };
}

const YachtDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, isRTL } = useLanguage();
  const [yacht, setYacht] = useState<YachtDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchYacht = async () => {
      if (!id) return;
      
      try {
        const { data } = await supabase
          .from('yachts')
          .select(`
            *,
            yacht_images(image_url, is_primary),
            locations(id, name_en, name_ar, google_maps_link)
          `)
          .eq('id', id)
          .single();

        setYacht(data);
      } catch (error) {
        console.error('Error fetching yacht:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYacht();
  }, [id]);

  const handleContact = (type: 'whatsapp' | 'phone' | 'email') => {
    const yachtName = yacht ? (language === 'ar' ? yacht.name_ar : yacht.name_en) : '';
    switch (type) {
      case 'whatsapp':
        window.open(`https://wa.me/01158954215?text=${encodeURIComponent(`I'm interested in ${yachtName}`)}`);
        break;
      case 'phone':
        window.open('tel:01158954215');
        break;
      case 'email':
        window.open(`mailto:alinasreldin783@gmail.com?subject=${encodeURIComponent(`Inquiry about ${yachtName}`)}`);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="bg-muted h-96 rounded-lg mb-8"></div>
              <div className="bg-muted h-8 rounded mb-4"></div>
              <div className="bg-muted h-4 rounded mb-2"></div>
              <div className="bg-muted h-4 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!yacht) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <Anchor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">
              {t('yacht.notFound', 'Yacht Not Found', 'اليخت غير موجود')}
            </h1>
            <Link to="/yachts">
              <Button variant="ocean">
                {t('yacht.backToYachts', 'Back to Yachts', 'العودة إلى اليخوت')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const yachtName = language === 'ar' ? yacht.name_ar : yacht.name_en;
  const yachtDescription = language === 'ar' ? yacht.description_ar : yacht.description_en;
  const yachtFeatures = language === 'ar' ? yacht.features_ar : yacht.features_en;
  const locationName = yacht.locations ? (language === 'ar' ? yacht.locations.name_ar : yacht.locations.name_en) : '';

  const images = yacht.yacht_images || [];
  const primaryImage = images.find(img => img.is_primary) || images[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/yachts">
            <Button variant="ghost" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('yacht.backToYachts', 'Back to Yachts', 'العودة إلى اليخوت')}
            </Button>
          </Link>
        </div>

        {/* Yacht Images */}
        <section className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Image */}
            <div className="lg:col-span-2">
              {images.length > 0 ? (
                <img
                  src={images[selectedImageIndex]?.image_url || primaryImage?.image_url}
                  alt={yachtName}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-ocean"
                />
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-gradient-ocean flex items-center justify-center rounded-lg">
                  <span className="text-primary-foreground text-xl font-semibold">
                    {t('yacht.noImage', 'No Image Available', 'لا توجد صورة متاحة')}
                  </span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="space-y-4">
                {images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`${yachtName} ${index + 1}`}
                    className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all ${
                      selectedImageIndex === index ? 'ring-2 ring-primary' : 'hover:opacity-80'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Yacht Details */}
        <section className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Location */}
              <div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h1 className={`text-4xl font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {yachtName}
                  </h1>
                  {yacht.price && (
                    <Badge className="bg-accent text-accent-foreground font-bold text-lg px-4 py-2">
                      ${yacht.price.toLocaleString()}
                    </Badge>
                  )}
                </div>
                
                {yacht.locations && (
                  <div className={`flex items-center gap-2 text-muted-foreground mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{locationName}</span>
                    {yacht.locations.google_maps_link && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => window.open(yacht.locations?.google_maps_link, '_blank')}
                        className="p-0 h-auto text-primary"
                      >
                        {t('yacht.viewOnMap', 'View on Map', 'عرض على الخريطة')}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {yachtDescription && (
                <div>
                  <h2 className={`text-2xl font-bold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('yacht.about', 'About This Yacht', 'حول هذا اليخت')}
                  </h2>
                  <p className={`text-muted-foreground text-lg leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                    {yachtDescription}
                  </p>
                </div>
              )}

              {/* Features */}
              {yachtFeatures && (
                <div>
                  <h2 className={`text-2xl font-bold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('yacht.features', 'Features & Amenities', 'المميزات والخدمات')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {yachtFeatures.split(',').map((feature, index) => (
                      <div key={index} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Star className="h-5 w-5 text-accent" />
                        <span className="text-foreground">{feature.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 shadow-card sticky top-24">
                <h3 className={`text-xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('yacht.contactUs', 'Contact Us', 'اتصل بنا')}
                </h3>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => handleContact('whatsapp')}
                    variant="ocean"
                    size="lg"
                    className="w-full"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    WhatsApp: 01158954215
                  </Button>
                  
                  <Button
                    onClick={() => handleContact('phone')}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {t('yacht.call', 'Call Now', 'اتصل الآن')}
                  </Button>
                  
                  <Button
                    onClick={() => handleContact('email')}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    {t('yacht.email', 'Send Email', 'إرسال بريد')}
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('yacht.contactNote', 
                      'Contact us for availability, pricing, and special packages.',
                      'اتصل بنا للاستعلام عن التوفر والأسعار والعروض الخاصة.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default YachtDetailsPage;