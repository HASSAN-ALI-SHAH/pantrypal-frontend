import React from 'react';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <p className={`text-sm text-red-500 font-medium ${className}`}>
      {message}
    </p>
  );
};

export default ErrorMessage;
