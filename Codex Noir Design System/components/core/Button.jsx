import React from 'react';
export function Button({ children, variant = 'primary', ...rest }) {
  const [hover, setHover] = React.useState(false);
  const base = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '12px 26px', border: '1px solid var(--gold)', borderRadius: 0, background: 'transparent', cursor: 'pointer', transition: 'background 150ms var(--ease-standard), color 150ms var(--ease-standard), box-shadow 150ms var(--ease-standard), border-color 150ms var(--ease-standard)' };
  const variants = {
    primary: { background: hover ? 'var(--gold-bright)' : 'var(--gold)', color: 'var(--ink-black)', boxShadow: hover ? '0 0 0 1px var(--gold-bright)' : 'none' },
    ghost: { background: hover ? 'rgba(184,147,91,0.12)' : 'transparent', color: hover ? 'var(--gold-bright)' : 'var(--gold)', borderColor: hover ? 'var(--gold-bright)' : 'var(--gold)' },
  };
  return React.createElement('button', { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { ...base, ...variants[variant] }, ...rest }, children);
}
