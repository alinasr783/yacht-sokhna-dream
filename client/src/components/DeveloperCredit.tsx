import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Code, Cpu, Binary, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const DeveloperCredit = () => {
  const { t, isRTL } = useLanguage();
  const [currentIcon, setCurrentIcon] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const icons = [
    <Code key="code" className="h-3 w-3" />,
    <Cpu key="cpu" className="h-3 w-3" />,
    <Binary key="binary" className="h-3 w-3" />,
    <Sparkles key="sparkles" className="h-3 w-3" />
  ];

  useEffect(() => {
    // تغيير الأيقونة كل 1.5 ثانية
    const iconInterval = setInterval(() => {
      if (!isHovered) {
        setCurrentIcon((prev) => (prev + 1) % icons.length);
      }
    }, 1500);

    return () => clearInterval(iconInterval);
  }, [isHovered]);

  return (
    <div 
      className={`w-full bg-gray-900 py-1.5 px-3 border-t border-gray-700 ${isRTL ? 'font-arabic' : 'font-sans'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center justify-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="text-[11px] text-gray-300">
          {t('developer.developedBy', 'Crafted by', 'صمم بواسطة')}
        </span>

        <div className="flex items-center gap-1">
          <span className={`text-indigo-400 transition-all duration-300 ${isHovered ? 'scale-125' : ''}`}>
            {icons[currentIcon]}
          </span>

          <Link 
            to="truefolio.tech" 
            target="_blank"
            className="text-[11px] text-indigo-400 hover:text-white transition-all duration-200 flex items-center gap-0.5 group font-medium"
          >
            <span className="group-hover:underline decoration-dotted underline-offset-2">TreuFolio</span>
            <ExternalLink className="h-3 w-3 transition-transform duration-200 group-hover:translate-y-[-1px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
