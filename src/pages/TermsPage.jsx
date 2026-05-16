import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChefHat, Shield, FileText, AlertTriangle, Mail } from 'lucide-react';

const sections = [
  {
    id: 'acceptance',
    icon: '✅',
    title: '1. Acceptance of Terms',
    content: `By accessing or using PantryPal ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. PantryPal reserves the right to update these terms at any time, and continued use of the Service constitutes acceptance of any changes.`,
  },
  {
    id: 'account',
    icon: '👤',
    title: '2. User Accounts',
    content: `You must provide accurate and complete information when creating your PantryPal account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use. You must be at least 13 years of age to create an account.`,
  },
  {
    id: 'use',
    icon: '📋',
    title: '3. Acceptable Use',
    content: `You agree to use PantryPal only for lawful purposes and in accordance with these Terms. You agree NOT to: use the Service in any way that violates applicable laws, attempt to gain unauthorized access to any part of the Service, transmit any harmful or malicious code, use automated means to access the Service without our permission, or resell or redistribute the Service without authorization.`,
  },
  {
    id: 'data',
    icon: '🗄️',
    title: '4. Data & Content',
    content: `You retain ownership of all pantry data, grocery lists, and personal information you enter into PantryPal. By using the Service, you grant PantryPal a limited license to store and process this data solely for the purpose of providing the Service to you. We do not sell your personal data to third parties.`,
  },
  {
    id: 'availability',
    icon: '⚡',
    title: '5. Service Availability',
    content: `PantryPal strives to maintain a reliable service but does not guarantee uninterrupted availability. We may perform scheduled or emergency maintenance at any time. We are not liable for any loss or damage resulting from service interruptions, data loss, or system downtime.`,
  },
  {
    id: 'termination',
    icon: '🚫',
    title: '6. Termination',
    content: `You may delete your account at any time through the Settings page. PantryPal reserves the right to suspend or terminate accounts that violate these Terms of Service, engage in fraudulent activity, or cause harm to other users or the platform. Upon termination, your data will be permanently deleted from our systems within 30 days.`,
  },
  {
    id: 'disclaimer',
    icon: '⚠️',
    title: '7. Disclaimer of Warranties',
    content: `PantryPal is provided "as is" without any warranties, express or implied. We do not guarantee that the Service will be error-free or that food expiry suggestions are 100% accurate. Always use your own judgment when determining if food is safe to consume. PantryPal is a management tool and not a food safety authority.`,
  },
  {
    id: 'contact',
    icon: '📧',
    title: '8. Contact Us',
    content: `If you have any questions about these Terms of Service, please contact us at support@pantrypal.app. We aim to respond to all inquiries within 2 business days.`,
  },
];

const TermsPage = () => {
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 border border-blue-100">
            <FileText size={32} className="text-primary" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-text-dark mb-3">Terms of Service</h1>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Please read these terms carefully before using PantryPal. They govern your use of our service.
          </p>
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
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-muted hover:text-primary hover:bg-blue-50 transition-all"
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
            {sections.map((s, i) => (
              <div
                key={s.id}
                id={s.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <h2 className="font-heading text-lg font-bold text-text-dark">{s.title}</h2>
                </div>
                <p className="text-text-muted leading-relaxed text-sm">{s.content}</p>
              </div>
            ))}

            {/* Footer note */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
              <Shield size={22} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-dark text-sm mb-1">Your trust matters to us</p>
                <p className="text-text-muted text-sm">
                  PantryPal is committed to handling your data responsibly. These terms exist to protect both you and us. If you have any concerns, please reach out at{' '}
                  <a href="mailto:support@pantrypal.app" className="text-primary hover:underline font-medium">support@pantrypal.app</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
