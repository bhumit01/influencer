import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'Explore', href: '/browse' },
      { label: 'Categories', href: '/categories' },
      { label: 'For Brands', href: '/brands' },
      { label: 'For Influencers', href: '/influencers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/60 bg-neutral-50/50">
      <div className="max-w-page section-padding py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">IH</span>
              </div>
              <span className="text-lg font-bold text-neutral-900">InfluenceHub</span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              The modern marketplace connecting brands with authentic influencers for meaningful collaborations.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-neutral-200/60">
        <div className="max-w-page section-padding py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} InfluenceHub. All rights reserved.
          </p>
          <p className="text-sm text-neutral-400 flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> for creators
          </p>
        </div>
      </div>
    </footer>
  );
}
