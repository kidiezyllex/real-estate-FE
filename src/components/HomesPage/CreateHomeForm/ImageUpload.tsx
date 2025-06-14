"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { IconUpload, IconX, IconPhoto, IconLoader2, IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUploadFile } from '@/hooks/useUpload';
import { toast } from 'react-toastify';

interface ImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

const ImageUpload = ({ onImagesChange, maxImages = 5, existingImages = [] }: ImageUploadProps) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadFileMutation } = useUploadFile();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      toast.error(`Chỉ có thể tải lên tối đa ${remainingSlots} ảnh nữa`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} không phải là hình ảnh`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`File ${file.name} quá lớn. Kích thước tối đa là 5MB`);
        return;
      }

      uploadImage(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = (file: File) => {
    setUploading(true);
    
    uploadFileMutation(
      { file },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200 && data.data?.url) {
            const newImages = [...images, data.data.url];
            setImages(newImages);
            onImagesChange(newImages);
            toast.success('Tải ảnh lên thành công');
          } else {
            toast.error('Tải ảnh lên thất bại');
          }
          setUploading(false);
        },
        onError: (error) => {
          toast.error(`Lỗi tải ảnh: ${error.message}`);
          setUploading(false);
        }
      }
    );
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Vui lòng chỉ kéo thả file hình ảnh');
      return;
    }

    const remainingSlots = maxImages - images.length;
    if (imageFiles.length > remainingSlots) {
      toast.error(`Chỉ có thể tải lên tối đa ${remainingSlots} ảnh nữa`);
      return;
    }

    imageFiles.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn. Kích thước tối đa là 5MB`);
        return;
      }
      uploadImage(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-mainTextV1">
          Hình ảnh căn hộ ({images.length}/{maxImages})
        </h3>
        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <IconUpload className="h-4 w-4 mr-2" />
            )}
            Tải ảnh lên
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length === 0 ? (
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <IconPhoto className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 text-center mb-2">
              Kéo thả ảnh vào đây hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-500 text-center">
              Hỗ trợ: JPG, PNG, GIF (tối đa 5MB mỗi file)
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imageUrl}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <IconX className="h-3 w-3" />
              </Button>
            </motion.div>
          ))}
          
          {images.length < maxImages && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: images.length * 0.1 }}
            >
              <Card
                className="aspect-square border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="flex flex-col items-center justify-center h-full">
                  {uploading ? (
                    <IconLoader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <IconPlus className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 text-center">
                        Thêm ảnh
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <IconLoader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Đang tải ảnh lên...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 