import React from 'react';
export function SectionHeader({ children, sparkle = false }) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
    sparkle && React.createElement('span', { style: { color: 'var(--gold)', fontSize: 16 } }, '\u2726'),
    React.createElement('h2', { style: { margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bone)' } }, children)
  );
}
