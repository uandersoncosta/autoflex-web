import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  gradient?: 'primary' | 'success' | 'danger' | 'info' | 'accent' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glass = false,
  gradient = 'none'
}) => {
  const classNames = [
    'card',
    glass && 'card-glass',
    gradient !== 'none' && `card-gradient-${gradient}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
};
