import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "+201064283248";

  const openChat = () => {
    window.open(`https://wa.me/${phoneNumber.replace(/[^\d+]/g, "")}`, '_blank');
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-72 bg-white rounded-lg shadow-xl overflow-hidden animate-popup">
          <div className="bg-gradient-ocean p-4 text-white flex justify-between items-center">
            <h3 className="text-lg font-bold">تواصل معنا على واتساب</h3>
            <button 
              onClick={togglePopup}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          </div>

          <div className="p-4 text-gray-700 border-b">
            <div className="mb-3">
              <p className="text-sm">رقم الواتساب:</p>
              <p className="text-lg font-bold text-primary">{phoneNumber}</p>
            </div>
            <p className="text-sm">متاح للرد من الساعة 9 صباحاً حتى 10 مساءً</p>
          </div>

          <button 
            onClick={openChat}
            className="w-full py-3 bg-gradient-ocean text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FontAwesomeIcon icon={faWhatsapp} size="lg" />
            بدء المحادثة
          </button>
        </div>
      )}

      <div 
        onClick={togglePopup}
        className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-red-500' : 'bg-gradient-ocean'
        } relative`}
      >
        <FontAwesomeIcon 
          icon={isOpen ? faXmark : faWhatsapp} 
          className="text-white text-2xl z-10" 
        />

        {!isOpen && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75 animation-delay-1000"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default WhatsAppButton;