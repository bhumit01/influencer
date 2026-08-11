import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { brandApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Enquiry } from '@/types';

const statusVariant: Record<string, 'warning' | 'default' | 'success' | 'danger'> = {
  pending: 'warning',
  read: 'default',
  replied: 'success',
  closed: 'danger',
};

export function BrandEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = (p: number) => {
    setIsLoading(true);
    brandApi
      .getEnquiries(p)
      .then((res) => {
        setEnquiries(res.data);
        setTotalPages(res.pagination.total_pages);
        setPage(res.pagination.page);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetch(page);
  }, [page]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Enquiries</h1>
        <p className="text-neutral-600 mt-1">Track your collaboration requests</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq, i) => (
            <motion.div
              key={enq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-neutral-900">
                        {enq.subject || 'General Enquiry'}
                      </h3>
                      <Badge variant={statusVariant[enq.status]} size="sm">
                        {enq.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap line-clamp-3">
                      {enq.message}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(enq.created_at)}
                      </span>
                      {enq.budget_range && (
                        <span>Budget: {enq.budget_range}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant={statusVariant[enq.status]}>
                    {enq.status}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 min-w-[2.25rem] rounded-lg text-sm font-medium transition-colors ${
                    page === p
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <MessageSquare className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No enquiries yet
          </h3>
          <p className="text-neutral-500">
            When you contact influencers, your enquiries will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
