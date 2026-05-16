import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChefHat, Shield, Lock, Eye, Database, Bell, UserCheck, Mail } from 'lucide-react';

const sections = [
  {
    id: 'overview',
    icon: '🛡️',
    title: '1. Overview',
    content: `PantryPal ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it. By using PantryPal, you agree to the collection and use of information in accordance with this policy.`,
  },
  {
    id: 'collection',
    icon: '📥',
    title: '2. Information We Collect',
    items: [
      { label: 'Account Information', desc: 'Your name and email address when you register.' },
      { label: 'Pantry Data', desc: 'Food items, quantities, expiry dates, categories, and notes you enter.' },
      { label: 'Grocery Lists', desc: 'Shopping list items and purchase history.' },
      { label: 'Usage Settings', desc: 'Your preferences like theme, alert days, and notification settings.' },
      { label: 'Authentication Tokens', desc: 'JWT tokens stored locally in your browser for session management.' },
    ],
  },
  {
    id: 'use',
    icon: '⚙️',
    title: '3. How We Use Your Information',
    items: [
      { label: 'Service Delivery', desc: 'To operate and maintain your pantry management account.' },
      { label: 'Smart Features', desc: 'To generate recipe suggestions and expiry alerts based on your pantry data.' },
      { label: 'Authentication', desc: 'To verify your identity via OTP and JWT tokens.' },
      { label: 'Communication', desc: 'To send OTP verification emails and important account notifications.' },
      { label: 'Improvement', desc: 'To understand how users interact with the app to improve features.' },
    ],
  },
  {
    id: 'storage',
    icon: '🗄️',
    title: '4. Data Storage & Security',
    content: `Your data is stored in a PostgreSQL database on secure servers. Passwords are never stored in plain text — they are hashed using bcryptjs before storage. JWT authentication tokens are stored only in your browser's localStorage and are never transmitted to third parties. We implement industry-standard security practices to protect against unauthorized access.`,
  },
  {
    id: 'sharing',
    icon: '🤝',
    title: '5. Data Sharing',
    content: `PantryPal does NOT sell, trade, or rent your personal information to third parties. Your pantry data is completely private and is never shared with other users or external companies. The only external service we use is Gmail SMTP (via Nodemailer) exclusively for sending OTP verification emails to your registered address.`,
  },
  {
    id: 'cookies',
    icon: '🍪',
    title: '6. Cookies & Local Storage',
    content: `PantryPal uses browser localStorage to store your authentication token and user session data so you stay logged in across visits. We do not use advertising cookies or third-party tracking cookies. You can clear your localStorage at any time through your browser settings, which will log you out of the app.`,
  },
  {
    id: 'rights',
    icon: '✋',
    title: '7. Your Rights',
    items: [
      { label: 'Access', desc: 'You can view all your data at any time within the app.' },
      { label: 'Edit', desc: 'You can update your profile information from the Settings page.' },
      { label: 'Delete', desc: 'You can clear all your pantry data or delete your account from Settings → Danger Zone.' },
      { label: 'Export', desc: 'You can export your pantry data from the Reports page.' },
      { label: 'Portability', desc: 'Your data belongs to you. Contact us to request a full data export.' },
    ],
  },
  {
    id: 'retention',
    icon: '⏳',
    title: '8. Data Retention',
    content: `We retain your data for as long as your account is active. If you delete your account, all associated data including pantry items, grocery lists, consumption logs, and settings will be permanently removed from our servers within 30 days. OTP verification codes stored in memory are automatically purged after 10 minutes.`,
  },
  {
    id: 'children',
    icon: '👶',
    title: '9. Children\'s Privacy',
    content: `PantryPal is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child, please contact us immediately at support@pantrypal.app.`,
  },
  {
    id: 'contact',
    icon: '📧',
    title: '10. Contact Us',
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at support@pantrypal.app. We aim to respond within 2 business days.`,
  },
];

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <ChefHat size={22} className="text-primary" />
              <span className="font-heading font-bold text-lg text-text-dark">PantryPal</span>
            </div>
          </div>
          <span className="text-sm text-text-muted hidden sm:block">Last updated: May 2026</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-4 border border-green-100">
            <Shield size={32} className="text-green-600" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-text-dark mb-3">Privacy Policy</h1>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            We take your privacy seriously. Here's exactly what we collect, why we collect it, and how you can control it.
          </p>
        </motion.div>

        {/* Quick badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { icon: Lock, label: 'Passwords Hashed', color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { icon: Eye, label: 'No Tracking', color: 'text-green-600 bg-green-50 border-green-100' },
            { icon: Database, label: 'No Data Sales', color: 'text-purple-600 bg-purple-50 border-purple-100' },
            { icon: UserCheck, label: 'You Own Your Data', color: 'text-amber-600 bg-amber-50 border-amber-100' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${color}`}>
              <Icon size={15} />
              {label}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky sidebar nav */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-2">Sections</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-muted hover:text-green-600 hover:bg-green-50 transition-all"
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="font-medium line-clamp-1">{s.title.replace(/^\d+\.\s/, '')}</span>
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3 space-y-6"
          >
            {sections.map((s) => (
              <div
                key={s.id}
                id={s.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <h2 className="font-heading text-lg font-bold text-text-dark">{s.title}</h2>
                </div>
                {s.content && (
                  <p className="text-text-muted leading-relaxed text-sm">{s.content}</p>
                )}
                {s.items && (
                  <ul className="space-y-2.5 mt-1">
                    {s.items.map((item) => (
                      <li key={item.label} className="flex gap-3 text-sm">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                        <span>
                          <span className="font-semibold text-text-dark">{item.label}:</span>{' '}
                          <span className="text-text-muted">{item.desc}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Footer note */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex gap-4">
              <Mail size={22} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-dark text-sm mb-1">Questions about your privacy?</p>
                <p className="text-text-muted text-sm">
                  We're happy to answer any questions about how we handle your data. Contact us at{' '}
                  <a href="mailto:support@pantrypal.app" className="text-green-600 hover:underline font-medium">support@pantrypal.app</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
