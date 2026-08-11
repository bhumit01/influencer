import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Globe,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Instagram,
  Youtube,
  Music,
  Linkedin,
  MessageSquare,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatNumber, socialPlatformColor } from '@/lib/utils';
import { influencerApi, publicApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/Toast';
import type { InfluencerProfile as InfluencerProfileType } from '@/types';

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  tiktok: <Music className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
};

export function InfluencerProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<InfluencerProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    contact_name: '',
    contact_email: '',
    subject: '',
    message: '',
    budget_range: '',
    campaign_details: '',
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      influencerApi
        .getById(parseInt(id))
        .then((res) => setProfile(res.influencer))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.message.trim()) return;
    if (!user && (!contactForm.contact_name.trim() || !contactForm.contact_email.trim())) {
      toast('Please provide your name and email', 'error');
      return;
    }
    setIsSending(true);
    try {
      await publicApi.sendEnquiry({
        influencer_id: parseInt(id!),
        ...contactForm,
      });
      toast('Enquiry sent successfully! We\'ll help you connect with this creator.', 'success');
      setShowContactModal(false);
      setContactForm({ contact_name: '', contact_email: '', subject: '', message: '', budget_range: '', campaign_details: '' });
    } catch {
      toast('Failed to send enquiry', 'error');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-page section-padding py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Influencer not found</h2>
        <Link to="/browse">
          <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />}>
            Back to browse
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-brand-200 via-violet-100 to-brand-100 relative">
        {profile.cover_photo && (
          <img
            src={profile.cover_photo}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="max-w-page section-padding">
        {/* Profile header */}
        <div className="-mt-16 sm:-mt-24 relative z-10 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8">
          <Avatar
            src={profile.profile_photo}
            firstName={profile.first_name}
            lastName={profile.last_name}
            size="xl"
            className="ring-4 ring-white shadow-xl sm:h-28 sm:w-28 sm:text-3xl"
          />
          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  {profile.first_name || profile.last_name
                    ? `${profile.first_name || ''} ${profile.last_name || ''}`
                    : 'Influencer'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {profile.country && (
                    <span className="flex items-center gap-1 text-sm text-neutral-600">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.country}{profile.city ? `, ${profile.city}` : ''}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm text-neutral-600">
                    <Calendar className="h-3.5 w-3.5" />
                    Member since {profile.member_since ? new Date(profile.member_since).getFullYear() : 'N/A'}
                  </span>
                  <Badge
                    variant={profile.availability === 'available' ? 'success' : profile.availability === 'busy' ? 'warning' : 'danger'}
                  >
                    {profile.availability}
                  </Badge>
                </div>
              </div>
              <Button
                size="lg"
                leftIcon={<MessageSquare className="h-4 w-4" />}
                onClick={() => setShowContactModal(true)}
              >
                Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        {profile.categories && profile.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {profile.categories.map((cat) => (
              <Link key={cat.id} to={`/browse?category=${cat.slug}`}>
                <Badge variant="brand" size="md" className="cursor-pointer hover:bg-brand-100">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {profile.bio && (
              <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">About</h2>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Stats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="h-5 w-5 text-neutral-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-900">
                    {formatNumber(profile.followers || 0)}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">Followers</div>
                </div>
                {profile.engagement_rate && (
                  <div className="text-center">
                    <TrendingUp className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-emerald-600">
                      {profile.engagement_rate}%
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">Engagement</div>
                  </div>
                )}
                {profile.experience_years && (
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-brand-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-neutral-900">
                      {profile.experience_years}+
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">Years</div>
                  </div>
                )}
              </div>
            </Card>

            {/* Gallery */}
            {profile.gallery && profile.gallery.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {profile.gallery.map((item) => (
                    <div
                      key={item.id}
                      className="aspect-square rounded-xl overflow-hidden bg-neutral-100"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title || ''}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Past collaborations */}
            {profile.collaborations && profile.collaborations.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  Past Collaborations
                </h2>
                <div className="space-y-4">
                  {profile.collaborations.map((collab) => (
                    <div
                      key={collab.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50"
                    >
                      {collab.image_url ? (
                        <img
                          src={collab.image_url}
                          alt={collab.brand_name}
                          className="h-14 w-14 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                          <span className="text-brand-600 font-bold text-lg">
                            {collab.brand_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-neutral-900">
                          {collab.brand_name}
                        </h4>
                        {collab.description && (
                          <p className="text-sm text-neutral-600 mt-1">
                            {collab.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social links */}
            {profile.social_links && profile.social_links.length > 0 && (
              <Card>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  Social Links
                </h3>
                <div className="space-y-2">
                  {profile.social_links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                    >
                      <div
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br ${socialPlatformColor(
                          link.platform
                        )} flex items-center justify-center text-white shrink-0`}
                      >
                        {platformIcons[link.platform] || <Globe className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900 capitalize truncate">
                          {link.platform}
                        </p>
                        {link.followers > 0 && (
                          <p className="text-xs text-neutral-500">
                            {formatNumber(link.followers)} followers
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <Card>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.languages.map((lang) => (
                    <Badge key={lang}>{lang}</Badge>
                  ))}
                </div>
              </Card>
            )}


          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-1">
              Contact Influencer
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Tell us about your campaign and we'll help you connect with this creator.
            </p>
            <form onSubmit={handleContact} className="space-y-4">
              {!user && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={contactForm.contact_name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, contact_name: e.target.value })
                      }
                      className="w-full h-10 rounded-xl border-2 border-neutral-200 px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={contactForm.contact_email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, contact_email: e.target.value })
                      }
                      className="w-full h-10 rounded-xl border-2 border-neutral-200 px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  className="w-full h-10 rounded-xl border-2 border-neutral-200 px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  placeholder="e.g., Collaboration Opportunity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  rows={4}
                  required
                  className="w-full rounded-xl border-2 border-neutral-200 p-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-none"
                  placeholder="Describe your campaign or collaboration idea..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Budget Range
                </label>
                <input
                  type="text"
                  value={contactForm.budget_range}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, budget_range: e.target.value })
                  }
                  className="w-full h-10 rounded-xl border-2 border-neutral-200 px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  placeholder="e.g., $1,000 - $5,000"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isSending}
                  disabled={!contactForm.message.trim()}
                >
                  Send Enquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
