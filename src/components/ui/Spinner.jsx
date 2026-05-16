import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({ size = 24, className = '' }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{
        width: size,
        height: size,
        border: '3px solid #e5e7eb',
        borderTopColor: '#10B981',
        borderRadius: '50%',
      }}
    />
  </div>
);

export default Spinner;
