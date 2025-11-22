'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function CreateListingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    model: '',
    series: '',
    year: '',
    manufacturer: '',
    scale: '',
    color: '',
    location: '',
    condition: 'NEW',
    rarity: 'COMMON',
    price: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || formData.title.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    if (!formData.description || formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }

    if (!formData.model) {
      setError('Model is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setIsLoading(true);

    try {
      const priceInDollars = parseFloat(formData.price);
      const priceCents = Math.round(priceInDollars * 100);

      const listingData: any = {
        title: formData.title,
        description: formData.description,
        model: formData.model,
        condition: formData.condition,
        rarity: formData.rarity,
        priceCents: priceCents,
      };

      // Optional fields
      if (formData.year) {
        listingData.year = parseInt(formData.year);
      }
      
      // Add images if they exist and are valid URLs
      if (images.length > 0) {
        listingData.images = images;
      }

      const response = await api.post('/listings', listingData);
      router.push(`/listings/${response.data.id}`);
    } catch (err: any) {
      console.error('Create listing error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create New Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Images */}
              <div>
                <Label>Images (Optional)</Label>
                <p className="text-sm text-gray-500 mb-2">Upload images from your device</p>
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={10}
                />
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 2023 Super Treasure Hunt Nissan Skyline GT-R"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your Hot Wheels car..."
                  rows={5}
                  required
                />
              </div>

              {/* Two Column Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g., Nissan Skyline GT-R"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="series">Series</Label>
                  <Input
                    id="series"
                    value={formData.series}
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                    placeholder="e.g., Fast & Furious"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g., 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g., Mattel"
                  />
                </div>
                <div>
                  <Label htmlFor="scale">Scale</Label>
                  <Input
                    id="scale"
                    value={formData.scale}
                    onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                    placeholder="e.g., 1:64"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Blue Metallic"
                  />
                </div>
              </div>

              {/* Condition and Rarity */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    id="condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    required
                  >
                    <option value="NEW">New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="USED">Used</option>
                    <option value="DAMAGED">Damaged</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rarity">Rarity *</Label>
                  <Select
                    id="rarity"
                    value={formData.rarity}
                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                    required
                  >
                    <option value="COMMON">Common</option>
                    <option value="UNCOMMON">Uncommon</option>
                    <option value="RARE">Rare</option>
                    <option value="ULTRA_RARE">Ultra Rare</option>
                  </Select>
                </div>
              </div>

              {/* Price and Location */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York, NY"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Creating...' : 'Create Listing'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
