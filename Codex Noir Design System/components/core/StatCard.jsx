import React from 'react';
export function StatCard({ education, interests, goals }) {
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  const rows = [
    ['Educational Background', education],
    ['Programming Interests', interests],
    ['Career Goals', goals],
  ];
  const row = ([label, value], i) => React.createElement('div', {
    key: label, onMouseEnter: () => setHoverIdx(i), onMouseLeave: () => setHoverIdx(-1),
    style: { position: 'relative', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, padding: '14px 0 14px 14px', borderTop: '1px solid var(--hairline)', background: hoverIdx === i ? 'rgba(184,147,91,0.06)' : 'transparent', transition: 'background 150ms var(--ease-standard)' }
  },
    React.createElement('span', { style: { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 13, opacity: hoverIdx === i ? 1 : 0, transition: 'opacity 150ms var(--ease-standard)' } }, '\u2726'),
    React.createElement('span', { style: { fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: hoverIdx === i ? 'var(--gold-bright)' : 'var(--gold)', transition: 'color 150ms var(--ease-standard)' } }, label),
    React.createElement('span', { style: { fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--bone)', lineHeight: 1.5 } }, value)
  );
  return React.createElement('div', { style: { border: '1px solid var(--gold)', padding: '24px 28px', background: 'var(--panel)', maxWidth: 560 } }, rows.map(row));
}
