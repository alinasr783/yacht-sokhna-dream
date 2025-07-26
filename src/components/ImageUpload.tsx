import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus } from 'lucide-react';

interface ImageUploadProps {
  bucketName: string;
  entityId?: string;
  entityType: 'yacht' | 'location' | 'article';
  onImagesChange: (imageUrls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
}

export const ImageUpload = ({ 
  bucketName, 
  entityId, 
  entityType, 
  onImagesChange, 
  initialImages = [],
  maxImages = 5 
}: ImageUploadProps) => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${entityType}_${Date.now()}.${fileExt}`;
    const filePath = `${entityType}s/${fileName}`;

    try {
      setUploading(true);
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.uploadError', 'Error uploading image', 'خطأ في رفع الصورة'),
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: t('admin.error', 'Error', 'خطأ'),
        description: t('admin.maxImagesError', `Maximum ${maxImages} images allowed`, `الحد الأقصى ${maxImages} صور`),
        variant: 'destructive',
      });
      return;
    }

    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter(url => url !== null) as string[];
    
    const newImages = [...images, ...validUrls];
    setImages(newImages);
    onImagesChange(newImages);

    // Reset the input
    event.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>{t('admin.images', 'Images', 'الصور')} ({images.length}/{maxImages})</Label>
      
      {/* Current Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-24 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                  {t('admin.primary', 'Primary', 'أساسية')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Label htmlFor="image-upload" className="cursor-pointer">
            <div className={`flex items-center gap-2 p-2 border-2 border-dashed border-muted-foreground/25 rounded-md hover:border-primary transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
              {uploading ? (
                <div className="animate-spin">⏳</div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="text-sm">
                {uploading 
                  ? t('admin.uploading', 'Uploading...', 'جاري الرفع...')
                  : t('admin.addImage', 'Add Image', 'إضافة صورة')
                }
              </span>
            </div>
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {t('admin.imageUploadNote', 'First image will be used as primary image', 'الصورة الأولى ستكون الصورة الأساسية')}
      </p>
    </div>
  );
};