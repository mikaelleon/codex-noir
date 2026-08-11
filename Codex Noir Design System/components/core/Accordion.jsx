import React from 'react';
export function Accordion({ items = [] }) {
  const [open, setOpen] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  return React.createElement('div', { style: { borderTop: '1px solid var(--hairline)' } },
    items.map((it, i) => {
      const isOpen = open === i;
      const isHover = hover === i;
      return React.createElement('div', { key: i, style: { borderBottom: '1px solid var(--hairline)' } },
        React.createElement('button', {
          onClick: () => setOpen(isOpen ? -1 : i),
          onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(-1),
          style: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, background: 'transparent', border: 'none', cursor: 'pointer', padding: '20px 4px', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: 16, letterSpacing: '0.04em', color: isOpen || isHover ? 'var(--gold-bright)' : 'var(--bone)', transition: 'color 150ms var(--ease-standard)' }
        },
          React.createElement('span', null, it.q),
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontSize: 18, flexShrink: 0, display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms var(--ease-standard)' } }, isOpen ? '\u2212' : '+')
        ),
        isOpen && React.createElement('p', { style: { margin: '0 4px 22px', fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--taupe)', maxWidth: 640, animation: 'fadeIn 150ms var(--ease-standard)' } }, it.a),
        React.createElement('style', null, '@keyframes fadeIn{from{opacity:0}to{opacity:1}}')
      );
    })
  );
}
