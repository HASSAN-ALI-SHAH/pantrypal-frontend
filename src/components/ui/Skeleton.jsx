const Skeleton = ({ width = '100%', height = '1rem', className = '', rounded = false }) => (
  <div
    className={`skeleton ${rounded ? 'rounded-full' : ''} ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="flex justify-between items-start">
      <Skeleton width="60%" height="1.1rem" />
      <Skeleton width="2rem" height="1.1rem" rounded />
    </div>
    <Skeleton height="0.75rem" />
    <Skeleton width="80%" height="0.75rem" />
    <Skeleton height="6px" rounded className="mt-2" />
    <div className="flex gap-2 mt-3">
      <Skeleton width="5rem" height="1.8rem" />
      <Skeleton width="5rem" height="1.8rem" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-3 border-b border-gray-100">
        <Skeleton width="25%" height="0.9rem" />
        <Skeleton width="15%" height="0.9rem" />
        <Skeleton width="10%" height="0.9rem" />
        <Skeleton width="15%" height="0.9rem" />
        <Skeleton width="12%" height="1.4rem" rounded />
        <Skeleton width="12%" height="1.8rem" />
      </div>
    ))}
  </div>
);

export default Skeleton;
