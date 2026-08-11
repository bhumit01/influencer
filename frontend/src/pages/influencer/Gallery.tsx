import { useEffect, useState, useRef } from 'react';
import { Image, Plus, X, Upload } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';
import { influencerApi } from '@/lib/api';
import type { GalleryItem } from '@/types';

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchGallery = () => {
    setIsLoading(true);
    influencerApi
      .getMyProfile()
      .then((res) => setItems(res.profile.gallery || []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddPhoto = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await influencerApi.upload('gallery', file, photoTitle || undefined);
      toast('Photo added to gallery', 'success');
      setShowModal(false);
      setPhotoTitle('');
      if (fileRef.current) fileRef.current.value = '';
      fetchGallery();
    } catch {
      toast('Failed to upload photo', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gallery</h1>
          <p className="text-neutral-600 mt-1">Showcase your best work</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowModal(true)}>
          Add Photo
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
              <img
                src={item.image_url}
                alt={item.title || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-red-600 hover:bg-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Image className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No photos yet</h3>
          <p className="text-neutral-500 mb-6">Add photos to showcase your work to brands</p>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowModal(true)}>
            Add Photo
          </Button>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Add Photo</h2>
            <div className="space-y-4">
              <Input
                label="Title (optional)"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="e.g., Summer campaign shoot"
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Photo *</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  isLoading={isUploading}
                  leftIcon={<Upload className="h-4 w-4" />}
                  onClick={handleAddPhoto}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
