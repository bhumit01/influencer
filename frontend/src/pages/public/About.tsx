import { motion } from 'framer-motion';
import { Shield, Users, Zap, Heart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const values = [
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'We believe in building a platform where every collaboration is built on trust and clear communication.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Our community of creators and brands is at the heart of everything we do.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We continuously evolve our platform to provide the best tools for meaningful partnerships.',
  },
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'Real connections between brands and creators who share genuine values and vision.',
  },
];

export function About() {
  return (
    <div>
      <section className="max-w-page section-padding py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-[1.15]">
            Building the future of{' '}
            <span className="gradient-text">creator-brand</span> collaboration
          </h1>
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
            InfluenceHub was founded with a simple mission: make it easy for authentic creators 
            and forward-thinking brands to find each other and build amazing campaigns together.
          </p>
          <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
            We believe that the best marketing comes from genuine partnerships, not transactional 
            relationships. Our platform is designed to foster meaningful connections that deliver 
            real value for both creators and brands.
          </p>
        </motion.div>
      </section>

      <section className="bg-neutral-50/50 border-y border-neutral-200/60">
        <div className="max-w-page section-padding py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
              Our <span className="gradient-text">values</span>
            </h2>
            <p className="mt-3 text-neutral-600">
              The principles that guide everything we build
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <v.icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{v.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-page section-padding py-16 sm:py-24 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join our growing community of brands and creators.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup?role=brand">
              <Button size="lg">Join as Brand</Button>
            </Link>
            <Link to="/signup?role=influencer">
              <Button variant="outline" size="lg">Join as Influencer</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
