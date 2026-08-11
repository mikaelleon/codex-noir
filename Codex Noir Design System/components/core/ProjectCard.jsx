import React from 'react';
export function ProjectCard({ index, title, description, quote, tags = [], onUnlocked }) {
  const [phase, setPhase] = React.useState('locked'); // locked -> drawing -> banner -> settled
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && phase === 'locked') {
          if (reduced) { setPhase('settled'); return; }
          setPhase('drawing');
          setTimeout(() => setPhase('banner'), 400);
          setTimeout(() => { setPhase('settled'); onUnlocked && onUnlocked(); }, 400 + 900);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [phase, reduced, onUnlocked]);

  const borderColor = phase === 'locked' ? 'var(--hairline)' : hover ? 'var(--gold-bright)' : 'var(--gold)';
  const bracket = (pos) => {
    const base = { position: 'absolute', width: hover ? 24 : 18, height: hover ? 24 : 18, borderColor: hover ? 'var(--gold-bright)' : 'var(--gold)', opacity: phase === 'locked' ? 0 : 1, transition: 'opacity 150ms var(--ease-standard), width 150ms var(--ease-standard), height 150ms var(--ease-standard), border-color 150ms var(--ease-standard)' };
    const map = {
      tl: { top: -1, left: -1, borderTop: '2px solid', borderLeft: '2px solid' },
      br: { bottom: -1, right: -1, borderBottom: '2px solid', borderRight: '2px solid' },
    };
    return { ...base, ...map[pos] };
  };

  if (phase === 'banner') {
    return React.createElement('div', { ref, style: { position: 'relative', border: '1px solid var(--gold)', background: 'var(--panel)', padding: '48px 26px', textAlign: 'center' } },
      React.createElement('div', { style: bracket('tl') }), React.createElement('div', { style: bracket('br') }),
      React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.3em', color: 'var(--taupe)', marginBottom: 14 } }, 'NOTIFICATION'),
      React.createElement('div', { style: { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 30, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--bone)', lineHeight: 1.3 } }, 'New Item'),
      React.createElement('div', { style: { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 30, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--oxblood-bright)', lineHeight: 1.3 } }, 'Unlocked'),
      React.createElement('div', { style: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--taupe)', marginTop: 12 } }, 'A new project has entered the archive.')
    );
  }

  return React.createElement('div', { ref, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { position: 'relative', border: `1px solid ${borderColor}`, background: 'var(--panel)', padding: '32px 34px', overflow: 'hidden', transform: hover && phase === 'settled' ? 'translateY(-4px)' : 'none', boxShadow: hover && phase === 'settled' ? 'var(--shadow-panel)' : 'none', transition: 'border-color 150ms var(--ease-standard), transform 150ms var(--ease-standard), box-shadow 150ms var(--ease-standard)' } },
    phase === 'drawing' && React.createElement('div', { style: { position: 'absolute', top: -1, left: 0, height: 1, width: '100%', background: 'var(--gold)', transformOrigin: 'left', animation: 'unlockDraw 400ms linear forwards' } }),
    React.createElement('div', { style: bracket('tl') }), React.createElement('div', { style: bracket('br') }),
    React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: 10 } }, `UNLOCKED: ${typeof index === 'number' ? String(index).padStart(2, '0') : index}`),
    React.createElement('h3', { style: { margin: '0 0 14px', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 30, letterSpacing: '0.03em', textTransform: 'uppercase', color: hover ? 'var(--bone)' : 'var(--gold-bright)', transition: 'color 150ms var(--ease-standard)' } }, title),
    quote && React.createElement('p', { style: { margin: '0 0 18px', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.6, color: 'var(--bone)' } }, `"${quote}"`),
    React.createElement('p', { style: { margin: '0 0 18px', fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--taupe)' } }, description),
    React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, tags.map((t, i) => React.createElement('span', { key: i, style: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold-bright)', border: '1px solid var(--hairline)', padding: '4px 10px' } }, t))),
    React.createElement('style', null, '@keyframes unlockDraw{from{transform:scaleX(0)}to{transform:scaleX(1)}}')
  );
}
