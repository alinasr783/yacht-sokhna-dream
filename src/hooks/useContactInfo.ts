import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfo {
  email: string;
  phone: string | null;
  whatsapp: string | null;
}

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@yachtcharter.com',
    phone: null,
    whatsapp: null
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (data) {
        setContactInfo({
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  return contactInfo;
};