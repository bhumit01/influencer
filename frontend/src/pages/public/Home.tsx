import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Users,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Star,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfluencerCard } from '@/components/shared/InfluencerCard';
import { publicApi, influencerApi } from '@/lib/api';
import type { Category, InfluencerProfile } from '@/types';

const stats = [
  { label: 'Active Influencers', value: '2,500+' },
  { label: 'Brands', value: '800+' },
  { label: 'Campaigns', value: '5,000+' },
  { label: 'Countries', value: '60+' },
];

const features = [
  {
    icon: Search,
    title: 'Discover Talent',
    description: 'Browse through hundreds of vetted influencers across every niche and category.',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Insights',
    description: 'Access real engagement metrics, audience demographics, and performance data.',
  },
  {
    icon: Shield,
    title: 'Secure Enquiries',
    description: 'Every collaboration request is handled securely through our platform.',
  },
  {
    icon: Zap,
    title: 'Quick Matching',
    description: 'Smart algorithms help you find the perfect influencer for your campaign.',
  },
];

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);

  useEffect(() => {
    publicApi.categories().then((res) => setCategories(res.categories.slice(0, 6)));
    influencerApi
      .list({ per_page: 4 })
      .then((res) => setInfluencers(res.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-violet-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-brand-100/40 to-transparent" />
        <div className="relative max-w-page section-padding py-20 sm:py-28 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 mb-6">
              <Star className="h-3.5 w-3.5 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                Trusted by 800+ brands worldwide
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
              Connect with{' '}
              <span className="gradient-text">top influencers</span>
              <br />
              for your brand
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl leading-relaxed">
              The modern marketplace that connects brands with authentic creators.
              Discover, engage, and collaborate with influencers who match your vision.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/browse">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore Influencers
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg">
                  Join as Influencer
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 sm:mt-20"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-page section-padding py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Everything you need to{' '}
            <span className="gradient-text">collaborate</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            A complete platform for brands and influencers to find each other and build amazing campaigns.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-neutral-50/50 border-y border-neutral-200/60">
          <div className="max-w-page section-padding py-20 sm:py-28">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                  Browse by <span className="gradient-text">category</span>
                </h2>
                <p className="mt-2 text-neutral-600">
                  Find influencers in your specific niche
                </p>
              </div>
              <Link
                to="/categories"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/browse?category=${cat.slug}`}>
                  <Card hover className="flex items-center justify-between group">
                    <div>
                      <h3 className="font-medium text-neutral-900">{cat.name}</h3>
                      {cat.influencer_count !== undefined && (
                        <p className="text-sm text-neutral-500 mt-0.5">
                          {cat.influencer_count} influencers
                        </p>
                      )}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-brand-500 transition-colors" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Influencers */}
      {influencers.length > 0 && (
        <section className="max-w-page section-padding py-20 sm:py-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                Featured <span className="gradient-text">influencers</span>
              </h2>
              <p className="mt-2 text-neutral-600">
                Top creators ready for their next collaboration
              </p>
            </div>
            <Link to="/browse">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View all
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {influencers.map((inf) => (
              <InfluencerCard key={inf.id} influencer={inf} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-page section-padding py-20 sm:py-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to start{' '}
            <span className="text-brand-400">collaborating</span>?
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-xl mx-auto">
            Join thousands of brands and influencers already using InfluenceHub to create amazing campaigns.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/signup?role=brand">
              <Button
                size="lg"
                className="bg-white text-neutral-900 hover:bg-neutral-100"
              >
                Join as Brand
              </Button>
            </Link>
            <Link to="/signup?role=influencer">
              <Button
                variant="outline"
                size="lg"
                className="border-neutral-700 text-white hover:bg-neutral-800"
              >
                Join as Influencer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
