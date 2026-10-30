/**
 * Helper utility for handling property background images,
 * including client-side file compression and curated PG / Hostel presets.
 */

export const PROPERTY_PRESET_IMAGES = [
  {
    id: 'scenic-valley',
    name: 'Yosemite Mountain Pines',
    tag: 'Scenic',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'modern-pg',
    name: 'Modern PG & Co-Living',
    tag: 'Popular',
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'student-hostel',
    name: 'Student Residency',
    tag: 'Budget',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'urban-apartment',
    name: 'Urban Luxury Suites',
    tag: 'Premium',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'executive-pg',
    name: 'Executive PG House',
    tag: 'Cozy',
    url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'smart-coliving',
    name: 'Smart Co-Living Hub',
    tag: 'Trending',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'minimal-studio',
    name: 'Minimalist Studio PG',
    tag: 'Clean',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
  },
];

/**
 * Reads a local image file and compresses it to an optimized base64 Data URL.
 * Automatically limits max dimension to 1200px and JPEG quality to 82%
 * so payload size remains lean (~100-250KB) and saves instantly in MongoDB.
 */
export const processImageFile = (file, callback) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const rawDataUrl = event.target.result;
    const img = new Image();
    img.src = rawDataUrl;

    img.onload = () => {
      const maxDim = 1200;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const optimizedUrl = canvas.toDataURL('image/jpeg', 0.82);
      callback(optimizedUrl);
    };

    img.onerror = () => {
      callback(rawDataUrl);
    };
  };

  reader.readAsDataURL(file);
};
