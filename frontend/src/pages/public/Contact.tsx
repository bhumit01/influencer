import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from '@/components/ui/Toast';
import { publicApi } from '@/lib/api';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast('Please fill in all required fields', 'error');
      return;
    }
    setIsSending(true);
    try {
      await publicApi.contact(form);
      toast('Message sent successfully! We\'ll get back to you soon.', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-page section-padding py-12 sm:py-16">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
              Get in <span className="gradient-text">touch</span>
            </h1>
            <p className="mt-3 text-lg text-neutral-600">
              Have a question, feedback, or want to learn more? We&apos;d love to hear from you.
            </p>

            <div className="space-y-6 mt-10">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Email</h3>
                  <p className="text-sm text-neutral-600">hello@influencehub.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Live Chat</h3>
                  <p className="text-sm text-neutral-600">Available Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Location</h3>
                  <p className="text-sm text-neutral-600">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-3">
          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Name *"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Subject"
                placeholder="How can we help?"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">
                  Message *
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  required
                  className="w-full rounded-xl border-2 border-neutral-200 p-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <Button
                type="submit"
                size="lg"
                isLoading={isSending}
                rightIcon={<Send className="h-4 w-4" />}
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
