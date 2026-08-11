import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Users, Building2, MessageSquare, Clock } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState<{
    total_influencers: number;
    total_brands: number;
    total_enquiries: number;
    pending_enquiries: number;
    total_categories: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Creators',
      value: stats?.total_influencers ?? 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Brands',
      value: stats?.total_brands ?? 0,
      icon: Building2,
      color: 'from-violet-500 to-purple-500',
    },
    {
      title: 'Total Enquiries',
      value: stats?.total_enquiries ?? 0,
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Pending Enquiries',
      value: stats?.pending_enquiries ?? 0,
      icon: Clock,
      color: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-600 mt-1">Manage creators, enquiries, and categories</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">{stat.title}</p>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/admin/creators" className="block p-3 rounded-lg hover:bg-neutral-50 transition-colors">
              <span className="font-medium text-neutral-900">Manage Creators</span>
              <p className="text-sm text-neutral-600">View and update creator profiles</p>
            </a>
            <a href="/admin/enquiries" className="block p-3 rounded-lg hover:bg-neutral-50 transition-colors">
              <span className="font-medium text-neutral-900">Manage Enquiries</span>
              <p className="text-sm text-neutral-600">Review and respond to enquiries</p>
            </a>
            <a href="/admin/categories" className="block p-3 rounded-lg hover:bg-neutral-50 transition-colors">
              <span className="font-medium text-neutral-900">Manage Categories</span>
              <p className="text-sm text-neutral-600">Add or edit influencer categories</p>
            </a>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
          <p className="text-neutral-600 text-sm">Activity feed coming soon...</p>
        </Card>
      </div>
    </div>
  );
}
