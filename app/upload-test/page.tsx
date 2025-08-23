'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'

export default function UploadTestPage() {
  const [images, setImages] = useState<string[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleSubmit = () => {
    setUploadedUrls(images)
    console.log('Uploaded images:', images)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Upload Test</h1>
            
            <div className="space-y-8">
              {/* Image Upload Component */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Images</h2>
                <ImageUpload
                  images={images}
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                />
              </div>

              {/* Submit Button */}
              <div>
                <Button 
                  onClick={handleSubmit}
                  disabled={images.length === 0}
                  className="w-full"
                >
                  Test Upload ({images.length} images)
                </Button>
              </div>

              {/* Results */}
              {uploadedUrls.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded URLs</h2>
                  <div className="space-y-2">
                    {uploadedUrls.map((url, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Image {index + 1}:</p>
                        <p className="text-xs text-gray-500 break-all">{url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• Drag and drop images into the upload area</li>
                  <li>• Or click "Upload Images" to select files</li>
                  <li>• Images are automatically uploaded to Cloudinary</li>
                  <li>• Copy the URLs to use in your products</li>
                  <li>• Maximum 5 images per upload</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
