// Client-side only Cloudinary functions
export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'omorfo_preset') // You'll create this in Cloudinary

    fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          resolve(data.secure_url)
        } else {
          reject(new Error('Upload failed'))
        }
      })
      .catch(error => reject(error))
  })
}

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
} = {}) => {
  const { width, height, quality = 80, format = 'auto' } = options
  
  let url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
  
  const transformations = []
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)
  
  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`
  }
  
  return `${url}/${publicId}`
}
