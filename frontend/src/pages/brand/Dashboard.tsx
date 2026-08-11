import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { brandApi } from '@/lib/api';
import type { Enquiry } from '@/types';

export function BrandDashboard() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    brandApi.getEnquiries(1).then((res) => setEnquiries(res.data));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome, {user?.profile && 'company_name' in user.profile
            ? (user.profile as { company_name?: string }).company_name || 'Brand'
            : 'Brand'}
        </h1>
        <p className="text-neutral-600 mt-1">Manage your influencer campaigns</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{enquiries.length}</p>
                <p className="text-sm text-neutral-600">Enquiries</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">0</p>
                <p className="text-sm text-neutral-600">Active</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {enquiries.filter((e) => e.status === 'pending').length}
                </p>
                <p className="text-sm text-neutral-600">Pending</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link to="/brand/discover">
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">Discover Influencers</p>
                    <p className="text-xs text-neutral-500">Find the perfect creators</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>
            <Link to="/brand/enquiries">
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">View Enquiries</p>
                    <p className="text-xs text-neutral-500">Track your collaboration requests</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Enquiries</h2>
            <Link to="/brand/enquiries">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
          {enquiries.length > 0 ? (
            <div className="space-y-3">
              {enquiries.slice(0, 5).map((enq) => (
                <div
                  key={enq.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {enq.subject || 'Enquiry'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      enq.status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : enq.status === 'read'
                        ? 'bg-blue-50 text-blue-700'
                        : enq.status === 'replied'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">No enquiries yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
