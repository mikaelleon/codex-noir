import React from 'react';
export function ContactLink({ href, children }) {
  return React.createElement('a', { href, style: { fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--bone)' } }, children);
}
