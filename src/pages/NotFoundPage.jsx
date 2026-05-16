import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-lg"
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-8xl mb-6"
      >
        🥡
      </motion.div>
      <h1 className="font-heading text-8xl font-extrabold text-primary-sky mb-2">404</h1>
      <h2 className="font-heading text-3xl font-bold text-text-dark mb-3">Page Not Found</h2>
      <p className="text-text-muted text-lg mb-8">
        Oops! Looks like this page went past its expiry date. It's no longer here.
      </p>
      <Link to="/dashboard">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="btn btn-primary btn-lg shadow-blue-md"
        >
          <Home size={18} /> Back to Dashboard
        </motion.button>
      </Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
