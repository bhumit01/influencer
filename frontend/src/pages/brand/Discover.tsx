import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { SearchBar } from '@/components/shared/SearchBar';
import { InfluencerCard } from '@/components/shared/InfluencerCard';
import { useInfluencers } from '@/hooks/useInfluencers';
import { publicApi } from '@/lib/api';
import type { Category } from '@/types';

export function BrandDiscover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = searchParams.get('category') || undefined;
  const searchParam = searchParams.get('search') || undefined;
  const pageParam = parseInt(searchParams.get('page') || '1');

  const { data, isLoading } = useInfluencers({
    category: categoryParam,
    search: searchParam,
    page: pageParam,
  });

  useEffect(() => {
    publicApi.categories().then((res) => setCategories(res.categories));
  }, []);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set('search', query);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCategoryFilter = (slug: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Discover Influencers</h1>
        <p className="text-neutral-600 mt-1">Find the perfect creators for your brand</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar
          onSearch={handleSearch}
          initialValue={searchParam || ''}
          className="flex-1"
        />
        <Button
          variant="outline"
          leftIcon={<SlidersHorizontal className="h-4 w-4" />}
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          Filters
        </Button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 space-y-1">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                !categoryParam
                  ? 'bg-neutral-100 text-neutral-900 font-medium'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.slug)}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  categoryParam === cat.slug
                    ? 'bg-neutral-100 text-neutral-900 font-medium'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {cat.name}
                {cat.influencer_count !== undefined && (
                  <span className="text-neutral-400 ml-1 text-xs">
                    ({cat.influencer_count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile filters */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setShowFilters(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-neutral-900 mb-4">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { handleCategoryFilter(null); setShowFilters(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded-lg ${!categoryParam ? 'bg-neutral-100 font-medium' : 'text-neutral-600'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { handleCategoryFilter(cat.slug); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-lg ${categoryParam === cat.slug ? 'bg-neutral-100 font-medium' : 'text-neutral-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : data && data.data.length > 0 ? (
            <>
              <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                <Users className="h-4 w-4" />
                <span>{data.pagination.total} influencers found</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.map((inf, i) => (
                  <motion.div
                    key={inf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <InfluencerCard influencer={inf} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: data.pagination.total_pages }, (_, i) => i + 1)
                    .filter((p) => {
                      const page = data.pagination.page;
                      return p === 1 || p === page || p === page + 1 || p === page - 1 || p === data.pagination.total_pages;
                    })
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center gap-1">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-2 text-neutral-400">...</span>
                        )}
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', String(p));
                            setSearchParams(params);
                          }}
                          className={`h-9 min-w-[2.25rem] rounded-lg text-sm font-medium transition-colors ${
                            data.pagination.page === p
                              ? 'bg-neutral-900 text-white'
                              : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No influencers found</h3>
              <p className="text-neutral-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
