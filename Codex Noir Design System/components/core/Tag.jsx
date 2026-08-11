import React from 'react';
export function Tag({ children }) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('span', {
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-mono)', fontSize: 13, color: hover ? 'var(--ink-black)' : 'var(--gold-bright)',
      background: hover ? 'var(--gold-bright)' : 'transparent',
      border: `1px solid ${hover ? 'var(--gold-bright)' : 'var(--hairline)'}`, borderRadius: 0, padding: '6px 12px', display: 'inline-block',
      cursor: 'default', transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'background 150ms var(--ease-standard), color 150ms var(--ease-standard), border-color 150ms var(--ease-standard), transform 150ms var(--ease-standard)'
    }
  }, children);
}
