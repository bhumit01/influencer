import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Search, UserCheck, UserX, Edit2 } from 'lucide-react';

type CreatorStatus = 'active' | 'inactive' | 'suspended';

interface Creator {
  id: number;
  user_id: number;
  email: string;
  role: string;
  status: CreatorStatus;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  profile_photo: string | null;
  country: string | null;
  city: string | null;
  followers: number;
  categories?: { name: string }[];
}

export function AdminCreators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CreatorStatus | ''>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadCreators();
  }, [page, statusFilter]);

  const loadCreators = () => {
    setLoading(true);
    adminApi
      .getCreators(page, search || undefined, statusFilter || undefined)
      .then((res) => {
        setCreators(res.data as unknown as Creator[]);
        setTotalPages(res.pagination.total_pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setPage(1);
      loadCreators();
    }, 500);
    setSearchTimeout(timeout);
  };

  const updateStatus = (userId: number, status: CreatorStatus) => {
    setUpdatingId(userId);
    adminApi
      .updateCreator(userId, { status })
      .then(() => loadCreators())
      .catch(console.error)
      .finally(() => setUpdatingId(null));
  };

  const getStatusBadge = (status: CreatorStatus) => {
    const variants: Record<CreatorStatus, 'green' | 'gray' | 'red'> = {
      active: 'green',
      inactive: 'gray',
      suspended: 'red',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading && creators.length === 0) {
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
          <h1 className="text-2xl font-bold text-neutral-900">Creators</h1>
          <p className="text-neutral-600 mt-1">Manage influencer profiles and accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search creators..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
            leftIcon={<Search className="h-4 w-4" />}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as CreatorStatus | '');
              setPage(1);
            }}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Creator</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Followers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {creators.map((creator) => (
                <tr key={creator.user_id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={creator.profile_photo} name={`${creator.first_name} ${creator.last_name}`} size="sm" />
                      <div>
                        <p className="font-medium text-neutral-900">
                          {creator.first_name} {creator.last_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {creator.categories?.map(c => c.name).join(', ') || 'No categories'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{creator.email}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {creator.city ? `${creator.city}, ` : ''}{creator.country || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {creator.followers.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(creator.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {creator.status !== 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatus(creator.user_id, 'active')}
                          disabled={updatingId === creator.user_id}
                          title="Activate"
                        >
                          <UserCheck className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {creator.status !== 'suspended' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatus(creator.user_id, 'suspended')}
                          disabled={updatingId === creator.user_id}
                          title="Suspend"
                        >
                          <UserX className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/influencer/${creator.id}`, '_blank')}
                        title="View Profile"
                      >
                        <Edit2 className="h-4 w-4" />
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
