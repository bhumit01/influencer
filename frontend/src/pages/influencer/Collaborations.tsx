import { useEffect, useState } from 'react';
import { Briefcase, Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import type { Collaboration } from '@/types';

export function Collaborations() {
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    brand_name: '',
    description: '',
    start_date: '',
    end_date: '',
  });

  const fetchCollabs = () => {
    setIsLoading(true);
    api.get<{ collaborations: Collaboration[] }>('/influencers/collaborations')
      .then((res) => setCollabs(res.collaborations))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCollabs();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand_name.trim()) return;
    setIsSaving(true);
    try {
      await api.post('/influencers/collaborations', form);
      toast('Collaboration added', 'success');
      setShowForm(false);
      setForm({ brand_name: '', description: '', start_date: '', end_date: '' });
      fetchCollabs();
    } catch {
      toast('Failed to add collaboration', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Collaborations</h1>
          <p className="text-neutral-600 mt-1">Past brand partnerships</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>
          Add Collaboration
        </Button>
      </div>

      {collabs.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {collabs.map((collab) => (
            <Card key={collab.id}>
              <div className="flex items-start gap-4">
                {collab.image_url ? (
                  <img
                    src={collab.image_url}
                    alt={collab.brand_name}
                    className="h-14 w-14 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <span className="text-brand-600 font-bold text-lg">
                      {collab.brand_name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-neutral-900">{collab.brand_name}</h3>
                  {collab.description && (
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                      {collab.description}
                    </p>
                  )}
                  {collab.start_date && (
                    <p className="text-xs text-neutral-500 mt-2">
                      {new Date(collab.start_date).toLocaleDateString()}
                      {collab.end_date && ` - ${new Date(collab.end_date).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Briefcase className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No collaborations yet
          </h3>
          <p className="text-neutral-500 mb-6">
            Add your past brand partnerships to build trust
          </p>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>
            Add Collaboration
          </Button>
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Add Collaboration</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                label="Brand Name *"
                value={form.brand_name}
                onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
                placeholder="e.g., Nike"
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border-2 border-neutral-200 p-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-none"
                  placeholder="Describe the collaboration..."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={isSaving}>
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
