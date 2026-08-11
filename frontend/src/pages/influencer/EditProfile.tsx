import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Camera, Plus, X, Globe, Instagram, Youtube, Music, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/Toast';
import { influencerApi, publicApi } from '@/lib/api';
import type { InfluencerProfile, Category, SocialLink, SocialPlatform } from '@/types';

const platformOptions: { value: SocialPlatform; label: string; icon: React.ReactNode }[] = [
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { value: 'youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
  { value: 'tiktok', label: 'TikTok', icon: <Music className="h-4 w-4" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
  { value: 'twitter', label: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { value: 'facebook', label: 'Facebook', icon: <Globe className="h-4 w-4" /> },
  { value: 'website', label: 'Website', icon: <Globe className="h-4 w-4" /> },
  { value: 'other', label: 'Other', icon: <Globe className="h-4 w-4" /> },
];

export function EditProfile() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    country: '',
    city: '',
    languages: '',
    followers: 0,
    engagement_rate: 0,
    pricing_min: 0,
    pricing_max: 0,
    availability: 'available' as 'available' | 'busy' | 'unavailable',
    experience_years: 0,
    accepts_barter: false,
    barter_description: '',
    contact_email: '',
    contact_phone: '',
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [socialLinks, setSocialLinks] = useState<Omit<SocialLink, 'id' | 'influencer_id'>[]>([]);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    Promise.all([
      influencerApi.getMyProfile(),
      publicApi.categories(),
    ])
      .then(([profileRes, catRes]) => {
        setProfile(profileRes.profile);
        setAllCategories(catRes.categories);
        if (profileRes.profile) {
          const p = profileRes.profile;
          setForm({
            first_name: p.first_name || '',
            last_name: p.last_name || '',
            bio: p.bio || '',
            country: p.country || '',
            city: p.city || '',
            languages: p.languages?.join(', ') || '',
            followers: p.followers || 0,
            engagement_rate: p.engagement_rate || 0,
            pricing_min: p.pricing_min || 0,
            pricing_max: p.pricing_max || 0,
            availability: p.availability || 'available',
            experience_years: p.experience_years || 0,
            accepts_barter: p.accepts_barter || false,
            barter_description: p.barter_description || '',
            contact_email: p.contact_email || '',
            contact_phone: p.contact_phone || '',
          });
          setSelectedCategoryIds(p.categories?.map((c) => c.id) || []);
          setSocialLinks(
            p.social_links?.map((l) => ({ platform: l.platform, url: l.url, handle: l.handle, followers: l.followers })) || []
          );
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handlePhotoUpload = async (type: 'profile_photo' | 'cover_photo', file: File) => {
    if (type === 'profile_photo') setUploadingProfile(true);
    else setUploadingCover(true);
    try {
      const result = await influencerApi.upload(type, file);
      toast('Photo updated successfully', 'success');
      // Refetch profile to get updated URLs
      const profileRes = await influencerApi.getMyProfile();
      setProfile(profileRes.profile);
    } catch {
      toast('Failed to upload photo', 'error');
    } finally {
      setUploadingProfile(false);
      setUploadingCover(false);
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoUpload('profile_photo', file);
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoUpload('cover_photo', file);
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: 'instagram', url: '', handle: '', followers: 0 }]);
  };

  const updateSocialLink = (index: number, field: keyof Omit<SocialLink, 'id' | 'influencer_id'>, value: string | number) => {
    const updated = [...socialLinks];
    (updated[index] as any)[field] = value;
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await influencerApi.updateProfile({
        ...form,
        languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
        accepts_barter: form.accepts_barter,
      });
      toast('Profile updated successfully!', 'success');
    } catch {
      toast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Edit Profile</h1>
        <p className="text-neutral-600 mt-1">Make your profile stand out to brands</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photos */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Photos</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="text-center">
                <input
                  ref={profilePhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoChange}
                />
                <div
                  className="h-24 w-24 rounded-full bg-neutral-100 mx-auto flex items-center justify-center relative group cursor-pointer overflow-hidden"
                  onClick={() => profilePhotoRef.current?.click()}
                >
                  {profile?.profile_photo ? (
                    <img src={profile.profile_photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-neutral-400" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  {uploadingProfile ? 'Uploading...' : 'Profile Photo'}
                </p>
              </div>
              <div className="text-center">
                <input
                  ref={coverPhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverPhotoChange}
                />
                <div
                  className="h-24 w-48 rounded-xl bg-neutral-100 flex items-center justify-center relative group cursor-pointer overflow-hidden"
                  onClick={() => coverPhotoRef.current?.click()}
                >
                  {profile?.cover_photo ? (
                    <img src={profile.cover_photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-neutral-400" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  {uploadingCover ? 'Uploading...' : 'Cover Photo'}
                </p>
              </div>
            </div>
          </Card>

          {/* Basic Info */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="First Name"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
              <Input
                label="Last Name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </div>
            <div className="mt-5 space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="w-full rounded-xl border-2 border-neutral-200 p-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-none"
                placeholder="Tell brands about yourself..."
              />
            </div>
          </Card>

          {/* Location & Languages */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Location & Languages</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="e.g., India"
              />
              <Input
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g., Mumbai"
              />
            </div>
            <div className="mt-5">
              <Input
                label="Languages (comma separated)"
                value={form.languages}
                onChange={(e) => setForm({ ...form, languages: e.target.value })}
                placeholder="e.g., Hindi, English, Tamil"
              />
            </div>
          </Card>

          {/* Categories */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Categories</h2>
            <p className="text-sm text-neutral-500 mb-4">Select the categories that best describe your content</p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                    selectedCategoryIds.includes(cat.id)
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Stats */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Stats</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Total Followers"
                type="number"
                value={form.followers}
                onChange={(e) => setForm({ ...form, followers: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Engagement Rate (%)"
                type="number"
                step="0.01"
                value={form.engagement_rate}
                onChange={(e) => setForm({ ...form, engagement_rate: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Experience (years)"
                type="number"
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Availability</label>
                <select
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value as any })}
                  className="w-full h-10 rounded-xl border-2 border-neutral-200 px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-white"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Pricing</h2>
            <p className="text-sm text-neutral-500 mb-4">Set your pricing (visible only to you and platform admins)</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Minimum Price (INR)"
                type="number"
                value={form.pricing_min}
                onChange={(e) => setForm({ ...form, pricing_min: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Maximum Price (INR)"
                type="number"
                value={form.pricing_max}
                onChange={(e) => setForm({ ...form, pricing_max: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </Card>

          {/* Social Links */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Social Links</h2>
              <Button type="button" variant="outline" size="sm" onClick={addSocialLink} leftIcon={<Plus className="h-3 w-3" />}>
                Add Link
              </Button>
            </div>
            {socialLinks.length === 0 ? (
              <p className="text-sm text-neutral-500">No social links added yet. Add your social media profiles.</p>
            ) : (
              <div className="space-y-3">
                {socialLinks.map((link, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50">
                    <div className="flex-1 grid sm:grid-cols-2 gap-3">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                        className="h-10 rounded-xl border-2 border-neutral-200 px-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-white"
                      >
                        {platformOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        placeholder="Followers"
                        type="number"
                        value={link.followers}
                        onChange={(e) => updateSocialLink(i, 'followers', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSocialLink(i)}
                      className="h-10 w-10 rounded-xl bg-white border-2 border-neutral-200 flex items-center justify-center text-red-500 hover:bg-red-50 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Barter Preferences */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Barter Preferences</h2>
            <p className="text-sm text-neutral-500 mb-4">Indicate if you're open to non-monetary collaborations</p>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="accepts_barter"
                checked={form.accepts_barter}
                onChange={(e) => setForm({ ...form, accepts_barter: e.target.checked })}
                className="h-5 w-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="accepts_barter" className="text-sm font-medium text-neutral-700">
                I am open to barter / product-based collaborations
              </label>
            </div>
            {form.accepts_barter && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Barter Details
                </label>
                <textarea
                  value={form.barter_description}
                  onChange={(e) => setForm({ ...form, barter_description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border-2 border-neutral-200 p-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-none"
                  placeholder="Describe what kind of barter arrangements you're interested in..."
                />
              </div>
            )}
          </Card>

          {/* Contact Info */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h2>
            <p className="text-sm text-neutral-500 mb-4">Private contact details (visible only to you and platform admins)</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Contact Email"
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                placeholder="creator@example.com"
              />
              <Input
                label="Contact Phone"
                type="tel"
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              isLoading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
