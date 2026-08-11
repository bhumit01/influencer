import { useState, useEffect, useCallback } from 'react';
import { influencerApi } from '@/lib/api';
import type { InfluencerProfile, PaginatedResponse } from '@/types';

interface UseInfluencersOptions {
  category?: string;
  search?: string;
  country?: string;
  availability?: string;
  min_followers?: number;
  max_followers?: number;
  page?: number;
}

export function useInfluencers(options: UseInfluencersOptions = {}) {
  const [data, setData] = useState<PaginatedResponse<InfluencerProfile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | undefined> = {};
      if (options.category) params.category = options.category;
      if (options.search) params.search = options.search;
      if (options.country) params.country = options.country;
      if (options.availability) params.availability = options.availability;
      if (options.min_followers) params.min_followers = options.min_followers;
      if (options.max_followers) params.max_followers = options.max_followers;
      if (options.page) params.page = options.page;

      const result = await influencerApi.list(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch influencers');
    } finally {
      setIsLoading(false);
    }
  }, [options.category, options.search, options.country, options.availability, options.min_followers, options.max_followers, options.page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
