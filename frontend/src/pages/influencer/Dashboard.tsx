import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle, Image, Briefcase, ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { influencerApi } from '@/lib/api';
import { formatNumber, formatCurrency } from '@/lib/utils';
import type { InfluencerProfile } from '@/types';

export function InfluencerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    influencerApi
      .getMyProfile()
      .then((res) => setProfile(res.profile))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

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
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome, {profile?.first_name || 'Influencer'}
        </h1>
        <p className="text-neutral-600 mt-1">Manage your profile and collaborations</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(profile?.followers || 0)}
                </p>
                <p className="text-sm text-neutral-600">Followers</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {profile?.engagement_rate || 0}%
                </p>
                <p className="text-sm text-neutral-600">Engagement</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {profile?.pricing_min
                    ? formatCurrency(profile.pricing_min, profile.pricing_currency)
                    : '--'}
                </p>
                <p className="text-sm text-neutral-600">Min. Price</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link to="/influencer/edit-profile">
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">Edit Profile</p>
                    <p className="text-xs text-neutral-500">Update your bio, photos, and info</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>
            <Link to="/influencer/gallery">
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Image className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">Gallery</p>
                    <p className="text-xs text-neutral-500">Showcase your best work</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>
            <Link to="/influencer/collaborations">
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">Collaborations</p>
                    <p className="text-xs text-neutral-500">Manage past partnerships</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Profile Status</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Profile Photo', done: !!profile?.profile_photo },
              { label: 'Cover Photo', done: !!profile?.cover_photo },
              { label: 'Bio', done: !!profile?.bio },
              { label: 'Categories', done: !!(profile?.categories && profile.categories.length > 0) },
              { label: 'Social Links', done: !!(profile?.social_links && profile.social_links.length > 0) },
              { label: 'Pricing', done: !!profile?.pricing_min },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">{item.label}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.done
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.done ? 'Complete' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <Link to="/influencer/edit-profile">
              <Button variant="secondary" className="w-full">
                Complete Profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
