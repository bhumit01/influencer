import { Link } from 'react-router-dom';
import { MapPin, Users, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatNumber } from '@/lib/utils';
import type { InfluencerProfile } from '@/types';

interface InfluencerCardProps {
  influencer: InfluencerProfile;
}

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  return (
    <Link to={`/influencer/${influencer.id}`}>
      <Card hover className="h-full group">
        <div className="relative h-32 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-100 via-violet-50 to-brand-50">
          {influencer.cover_photo && (
            <img
              src={influencer.cover_photo}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="flex items-start gap-4 -mt-12 relative z-10">
          <Avatar
            src={influencer.profile_photo}
            firstName={influencer.first_name}
            lastName={influencer.last_name}
            size="lg"
            className="ring-4 ring-white shadow-md"
          />
          <div className="pt-6 min-w-0">
            <h3 className="font-semibold text-neutral-900 truncate">
              {influencer.first_name || influencer.last_name
                ? `${influencer.first_name || ''} ${influencer.last_name || ''}`
                : 'Influencer'}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {influencer.categories?.slice(0, 2).map((cat) => (
                <Badge key={cat.id} variant="brand" size="sm">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {influencer.country && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <MapPin className="h-3.5 w-3.5" />
              {influencer.country}{influencer.city ? `, ${influencer.city}` : ''}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Users className="h-3.5 w-3.5" />
            {formatNumber(influencer.followers || 0)} followers
          </div>

          {influencer.engagement_rate && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <TrendingUp className="h-3.5 w-3.5" />
              {influencer.engagement_rate}% engagement
            </div>
          )}
        </div>

        {influencer.bio && (
          <p className="mt-3 text-sm text-neutral-600 line-clamp-2">
            {influencer.bio}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <Badge
            variant={
              influencer.availability === 'available'
                ? 'success'
                : influencer.availability === 'busy'
                ? 'warning'
                : 'danger'
            }
            size="sm"
          >
            {influencer.availability || 'available'}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
