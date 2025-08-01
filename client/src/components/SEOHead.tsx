import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHeadProps {
  title?: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  keywords?: {
    en: string;
    ar: string;
  };
  image?: string;
  url?: string;
  type?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = {
    en: "Premium Yacht Rentals in Egypt - Best Deals in Red Sea | ElSokhna Yachts",
    ar: "تأجير اليخوت الفاخرة في مصر - أفضل العروض في البحر الأحمر | السخنة يخوت"
  },
  description = {
    en: "Experience luxury yacht rentals in Egypt's top destinations including Sahl Hasheesh, Hurghada, El Sokhna, and Red Sea. Book your exclusive sailing adventure today with premium service and professional crew.",
    ar: "استمتع بتأجير اليخوت الفاخرة في أفضل وجهات مصر بما في ذلك سهل حشيش والغردقة والسخنة والبحر الأحمر. احجز مغامرتك البحرية الحصرية اليوم مع خدمة مميزة وطاقم محترف."
  },
  keywords = {
    en: "yacht rental Egypt, Red Sea yacht charter, Sahl Hasheesh yacht rental, Hurghada yacht booking, El Sokhna yacht charter, luxury yacht rental, sailing Egypt, yacht charter Red Sea, marine activities Egypt, yacht booking Egypt",
    ar: "تأجير يخوت مصر, تأجير يخوت البحر الأحمر, تأجير يخوت سهل حشيش, حجز يخوت الغردقة, تأجير يخوت السخنة, تأجير يخوت فاخرة, الإبحار في مصر, تأجير يخوت البحر الأحمر, الأنشطة البحرية مصر, حجز يخوت مصر"
  },
  image = "https://i.ibb.co/xtrMxDNQ/logo-yacht-RIz0-QMq-C.jpg",
  url = "https://elsokhnayatchs.com/",
  type = "website"
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    // Update document title
    document.title = language === 'ar' ? title.ar : title.en;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', language === 'ar' ? description.ar : description.en);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', language === 'ar' ? keywords.ar : keywords.en);
    }

    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', language === 'ar' ? title.ar : title.en);
    }

    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', language === 'ar' ? description.ar : description.en);
    }

    // Update Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', language === 'ar' ? title.ar : title.en);
    }

    // Update Twitter description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', language === 'ar' ? description.ar : description.en);
    }

    // Update Open Graph locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute('content', language === 'ar' ? 'ar_EG' : 'en_US');
    }

    // Update canonical URL if URL parameter is provided
    if (url) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        const canonicalUrl = language === 'ar' ? `${url}?lang=ar` : url;
        canonical.setAttribute('href', canonicalUrl);
      }
    }

  }, [language, title, description, keywords, image, url]);

  return null; // This component doesn't render anything visible
};

// SEO data for different pages
export const SEOData = {
  home: {
    title: {
      en: "Premium Yacht Rentals in Egypt - Best Deals in Red Sea | ElSokhna Yachts",
      ar: "تأجير اليخوت الفاخرة في مصر - أفضل العروض في البحر الأحمر | السخنة يخوت"
    },
    description: {
      en: "Experience luxury yacht rentals in Egypt's top destinations including Sahl Hasheesh, Hurghada, El Sokhna, and Red Sea. Book your exclusive sailing adventure today with premium service and professional crew.",
      ar: "استمتع بتأجير اليخوت الفاخرة في أفضل وجهات مصر بما في ذلك سهل حشيش والغردقة والسخنة والبحر الأحمر. احجز مغامرتك البحرية الحصرية اليوم مع خدمة مميزة وطاقم محترف."
    }
  },
  yachts: {
    title: {
      en: "Luxury Yachts for Rent in Egypt - Premium Fleet | ElSokhna Yachts",
      ar: "يخوت فاخرة للإيجار في مصر - أسطول مميز | السخنة يخوت"
    },
    description: {
      en: "Browse our exclusive fleet of luxury yachts available for charter in Egypt's Red Sea. From intimate boats to grand yachts, find the perfect vessel for your sailing adventure.",
      ar: "تصفح أسطولنا الحصري من اليخوت الفاخرة المتاحة للاستئجار في البحر الأحمر بمصر. من القوارب الحميمة إلى اليخوت الكبيرة، اعثر على السفينة المثالية لمغامرتك البحرية."
    }
  },
  locations: {
    title: {
      en: "Top Sailing Destinations in Egypt - Red Sea Locations | ElSokhna Yachts",
      ar: "أفضل وجهات الإبحار في مصر - مواقع البحر الأحمر | السخنة يخوت"
    },
    description: {
      en: "Discover Egypt's most beautiful sailing destinations including Hurghada, Sahl Hasheesh, El Sokhna, and more. Explore pristine waters and stunning coastlines with our yacht charters.",
      ar: "اكتشف أجمل وجهات الإبحار في مصر بما في ذلك الغردقة وسهل حشيش والسخنة وأكثر. استكشف المياه النقية والسواحل الخلابة مع تأجير اليخوت لدينا."
    }
  },
  articles: {
    title: {
      en: "Yacht Charter Tips & Red Sea Sailing Guides | ElSokhna Yachts",
      ar: "نصائح تأجير اليخوت ودلائل الإبحار في البحر الأحمر | السخنة يخوت"
    },
    description: {
      en: "Expert tips and comprehensive guides for yacht chartering in Egypt. Learn about the best sailing seasons, destinations, and what to expect on your luxury yacht adventure.",
      ar: "نصائح خبراء ودلائل شاملة لاستئجار اليخوت في مصر. تعرف على أفضل مواسم الإبحار والوجهات وما يمكن توقعه في مغامرة اليخت الفاخرة."
    }
  }
};