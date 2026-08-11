import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type EnquiryStatus = 'pending' | 'read' | 'replied' | 'closed';

interface Enquiry {
  id: number;
  brand_id: number | null;
  influencer_id: number;
  subject: string | null;
  message: string;
  budget_range: string | null;
  campaign_details: string | null;
  contact_name: string | null;
  contact_email: string | null;
  status: EnquiryStatus;
  created_at: string;
  first_name?: string;
  last_name?: string;
  profile_photo?: string;
  country?: string;
  brand_email?: string;
  company_name?: string;
  admin_notes?: string;
}

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | ''>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, [page, statusFilter]);

  const loadEnquiries = () => {
    setLoading(true);
    adminApi
      .getEnquiries(page, statusFilter || undefined)
      .then((res) => {
        setEnquiries(res.data);
        setTotalPages(res.pagination.total_pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const updateStatus = (id: number, status: EnquiryStatus) => {
    setUpdatingId(id);
    adminApi
      .updateEnquiry(id, { status })
      .then(() => loadEnquiries())
      .catch(console.error)
      .finally(() => setUpdatingId(null));
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    const variants: Record<EnquiryStatus, 'yellow' | 'blue' | 'green' | 'gray'> = {
      pending: 'yellow',
      read: 'blue',
      replied: 'green',
      closed: 'gray',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading && enquiries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Enquiries</h1>
          <p className="text-neutral-600 mt-1">Review and manage collaboration enquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as EnquiryStatus | '');
              setPage(1);
            }}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Influencer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={enquiry.profile_photo} name={`${enquiry.first_name} ${enquiry.last_name}`} size="sm" />
                      <div>
                        <p className="font-medium text-neutral-900">
                          {enquiry.first_name} {enquiry.last_name}
                        </p>
                        <p className="text-xs text-neutral-500">{enquiry.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {enquiry.company_name ? (
                      <div>
                        <p className="font-medium text-neutral-900">{enquiry.company_name}</p>
                        <p className="text-xs text-neutral-500">{enquiry.brand_email}</p>
                      </div>
                    ) : (
                      <span className="text-neutral-500 text-sm">
                        {enquiry.contact_name || enquiry.contact_email || 'Anonymous'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-sm text-neutral-900 truncate">{enquiry.subject || 'No subject'}</p>
                    <p className="text-xs text-neutral-500 truncate">{enquiry.message}</p>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(enquiry.status)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {new Date(enquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus(enquiry.id, 'read')}
                        disabled={updatingId === enquiry.id || enquiry.status === 'read'}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus(enquiry.id, 'replied')}
                        disabled={updatingId === enquiry.id || enquiry.status === 'replied'}
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus(enquiry.id, 'closed')}
                        disabled={updatingId === enquiry.id || enquiry.status === 'closed'}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-neutral-600 px-4">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
