const Card = ({ children, className = '', glass = false, hover = true, style }) => (
  <div
    style={style}
    className={`${glass ? 'card-glass' : 'card'} ${hover ? '' : '!transform-none !shadow-card'} ${className}`}
  >
    {children}
  </div>
);

export default Card;
