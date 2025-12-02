import React from 'react';

const MobileButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { full?: boolean }> = ({ children, full, className, ...rest }) => (
  <button className={`${className || ''} ${full ? 'big-button' : 'button'}`} {...rest}>
    {children}
  </button>
);

export default MobileButton;
