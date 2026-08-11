import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from '@/components/ui/Toast';
import { authApi, api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function Signup() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'brand' | 'influencer'>(
    (searchParams.get('role') as 'brand' | 'influencer') || 'influencer'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 8) {
      toast('Password must be at least 8 characters', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const data: { email: string; password: string; role: string; company_name?: string } = {
        email,
        password,
        role,
      };
      if (role === 'brand') {
        data.company_name = companyName || 'My Company';
      }
      const res = await authApi.signup(data);
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      toast('Account created successfully!', 'success');
      navigate(res.user.role === 'brand' ? '/brand/dashboard' : '/influencer/dashboard');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Signup failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-padding py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">IH</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
          <p className="text-neutral-600 mt-2">Join InfluenceHub today</p>
        </div>

        <Card padding="lg">
          {/* Role selector */}
          <div className="flex rounded-xl border-2 border-neutral-200 p-1 mb-6">
            <button
              onClick={() => setRole('influencer')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all',
                role === 'influencer'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <User className="h-4 w-4" />
              Influencer
            </button>
            <button
              onClick={() => setRole('brand')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all',
                role === 'brand'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Building2 className="h-4 w-4" />
              Brand
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'brand' && (
              <Input
                label="Company Name"
                placeholder="Your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={<Building2 className="h-4 w-4" />}
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />
            <p className="text-xs text-neutral-500">
              By signing up, you agree to our{' '}
              <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>.
            </p>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Create account
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
