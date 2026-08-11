import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { authApi, api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

// Public pages
import { Home } from '@/pages/public/Home';
import { BrowseInfluencers } from '@/pages/public/BrowseInfluencers';
import { InfluencerProfilePage } from '@/pages/public/InfluencerProfile';
import { Categories } from '@/pages/public/Categories';
import { About } from '@/pages/public/About';
import { Contact } from '@/pages/public/Contact';
import { Login } from '@/pages/public/Login';
import { Signup } from '@/pages/public/Signup';

// Brand pages
import { BrandDashboard } from '@/pages/brand/Dashboard';
import { BrandDiscover } from '@/pages/brand/Discover';
import { BrandEnquiries } from '@/pages/brand/Enquiries';

// Influencer pages
import { InfluencerDashboard } from '@/pages/influencer/Dashboard';
import { EditProfile } from '@/pages/influencer/EditProfile';
import { Gallery } from '@/pages/influencer/Gallery';
import { Collaborations } from '@/pages/influencer/Collaborations';

// Admin pages
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { AdminCreators } from '@/pages/admin/Creators';
import { AdminEnquiries } from '@/pages/admin/Enquiries';
import { AdminCategories } from '@/pages/admin/Categories';

function AuthLoader({ children }: { children: React.ReactNode }) {
  const { setUser, setToken, isLoading, setLoading } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('ih_token');
    if (token) {
      api.setToken(token);
      setToken(token);
      authApi
        .me()
        .then((res) => setUser(res.user))
        .catch(() => {
          localStorage.removeItem('ih_token');
          api.setToken(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthLoader>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseInfluencers />} />
            <Route path="/influencer/:id" element={<InfluencerProfilePage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Brand dashboard */}
          <Route path="/brand" element={<DashboardLayout />}>
            <Route path="dashboard" element={<BrandDashboard />} />
            <Route path="discover" element={<BrandDiscover />} />
            <Route path="enquiries" element={<BrandEnquiries />} />
          </Route>

          {/* Influencer dashboard */}
          <Route path="/influencer" element={<DashboardLayout />}>
            <Route path="dashboard" element={<InfluencerDashboard />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="collaborations" element={<Collaborations />} />
          </Route>

          {/* Admin dashboard */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="creators" element={<AdminCreators />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>
        </Routes>
      </AuthLoader>
    </BrowserRouter>
  );
}
