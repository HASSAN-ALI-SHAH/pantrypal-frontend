import { useEffect, useRef } from 'react';

const ProgressBar = ({ value = 100, className = '' }) => {
  const fillRef = useRef(null);
  const clampedValue = Math.max(0, Math.min(100, value));

  const colorClass =
    clampedValue > 50 ? '' :
    clampedValue > 25 ? 'warning' : 'danger';

  useEffect(() => {
    if (fillRef.current) {
      // Reset then animate
      fillRef.current.style.width = '0%';
      const raf = requestAnimationFrame(() => {
        fillRef.current.style.width = `${clampedValue}%`;
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [clampedValue]);

  return (
    <div className={`progress-bar-track ${className}`}>
      <div
        ref={fillRef}
        className={`progress-bar-fill ${colorClass}`}
        style={{ width: '0%' }}
      />
    </div>
  );
};

export default ProgressBar;
