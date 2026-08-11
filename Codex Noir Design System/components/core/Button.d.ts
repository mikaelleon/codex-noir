import React from 'react';
export interface ButtonProps {
  children: React.ReactNode;
  /** primary: filled gold; ghost: gold outline, transparent fill */
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
}
export function Button(props: ButtonProps): JSX.Element;
