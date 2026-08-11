import React from 'react';
export function IndexNumber({ n }) {
  const v = typeof n === 'number' ? String(n).padStart(2, '0') : n;
  return React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 32, color: 'var(--gold)' } }, v);
}
