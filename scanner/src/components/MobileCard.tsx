import React from 'react';

const MobileCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <div className={`card ${className || ''}`}>
      {children}
    </div>
  );
};

export default MobileCard;
