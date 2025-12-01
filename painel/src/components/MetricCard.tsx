import React from 'react';

interface Props {
  title: string;
  value: string | number;
  className?: string;
}

const MetricCard: React.FC<Props> = ({ title, value, className = '' }) => {
  return (
    <div className={`metric-card ${className}`} role="region" aria-label={title}>
      <div className="metric-title">{title}</div>
      <div className="metric-number">{value}</div>
    </div>
  );
};

export default MetricCard;
