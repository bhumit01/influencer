import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Film, Plane, Utensils, Dumbbell, Monitor, Music2, Briefcase, GraduationCap, Mountain, Camera } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { publicApi } from '@/lib/api';
import type { Category } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  'fashion-beauty': <Film className="h-6 w-6" />,
  'travel-lifestyle': <Plane className="h-6 w-6" />,
  'food-cooking': <Utensils className="h-6 w-6" />,
  'fitness-health': <Dumbbell className="h-6 w-6" />,
  'tech-gaming': <Monitor className="h-6 w-6" />,
  'music-entertainment': <Music2 className="h-6 w-6" />,
  'business-finance': <Briefcase className="h-6 w-6" />,
  'education-science': <GraduationCap className="h-6 w-6" />,
  'sports-outdoors': <Mountain className="h-6 w-6" />,
  'photography-art': <Camera className="h-6 w-6" />,
};

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    publicApi
      .categories()
      .then((res) => setCategories(res.categories))
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
    <div className="max-w-page section-padding py-12 sm:py-16">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          Browse by <span className="gradient-text">Category</span>
        </h1>
        <p className="mt-3 text-lg text-neutral-600">
          Find influencers in your specific niche. Each category is curated to help you discover the perfect creators.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link to={`/browse?category=${cat.slug}`}>
              <Card hover className="group h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-100 transition-colors">
                    {categoryIcons[cat.slug] || <Film className="h-6 w-6" />}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {cat.description}
                  </p>
                )}
                {cat.influencer_count !== undefined && (
                  <p className="text-sm text-neutral-500 mt-3">
                    {cat.influencer_count} influencer{cat.influencer_count !== 1 ? 's' : ''}
                  </p>
                )}
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
