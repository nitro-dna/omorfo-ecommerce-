'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadImage } from '@/lib/cloudinary-client'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  className = '' 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      
      const newImages = [...images, ...uploadedUrls].slice(0, maxImages)
      onImagesChange(newImages)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const canAddMore = images.length < maxImages

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {canAddMore && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="space-y-2">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mb-2"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500">
                {images.length}/{maxImages} images uploaded
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </div>
        </div>
      )}

      {!canAddMore && (
        <p className="text-sm text-gray-500 text-center">
          Maximum {maxImages} images allowed
        </p>
      )}
    </div>
  )
}
