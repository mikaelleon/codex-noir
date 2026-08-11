/* @ds-bundle: {"format":4,"namespace":"CodexNoirDesignSystem_72fc46","components":[{"name":"Accordion","sourcePath":"components/core/Accordion.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"ContactLink","sourcePath":"components/core/ContactLink.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"IndexNumber","sourcePath":"components/core/IndexNumber.jsx"},{"name":"ProjectCard","sourcePath":"components/core/ProjectCard.jsx"},{"name":"SectionHeader","sourcePath":"components/core/SectionHeader.jsx"},{"name":"StatCard","sourcePath":"components/core/StatCard.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Accordion.jsx":"ec6dc53d698e","components/core/Button.jsx":"294ad1834cc1","components/core/ContactLink.jsx":"503a910ef689","components/core/Divider.jsx":"a7db7d3989e0","components/core/IndexNumber.jsx":"0663c2541005","components/core/ProjectCard.jsx":"f70296929f0c","components/core/SectionHeader.jsx":"ae34ce5fdf09","components/core/StatCard.jsx":"be77979e1ad7","components/core/Tag.jsx":"99e3ddda1364"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CodexNoirDesignSystem_72fc46 = window.CodexNoirDesignSystem_72fc46 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Accordion.jsx
try { (() => {
function Accordion({
  items = []
}) {
  const [open, setOpen] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  return React.createElement('div', {
    style: {
      borderTop: '1px solid var(--hairline)'
    }
  }, items.map((it, i) => {
    const isOpen = open === i;
    const isHover = hover === i;
    return React.createElement('div', {
      key: i,
      style: {
        borderBottom: '1px solid var(--hairline)'
      }
    }, React.createElement('button', {
      onClick: () => setOpen(isOpen ? -1 : i),
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(-1),
      style: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '20px 4px',
        textAlign: 'left',
        fontFamily: 'var(--font-heading)',
        fontSize: 16,
        letterSpacing: '0.04em',
        color: isOpen || isHover ? 'var(--gold-bright)' : 'var(--bone)',
        transition: 'color 150ms var(--ease-standard)'
      }
    }, React.createElement('span', null, it.q), React.createElement('span', {
      style: {
        fontFamily: 'var(--font-mono)',
        color: 'var(--gold)',
        fontSize: 18,
        flexShrink: 0,
        display: 'inline-block',
        transform: isOpen ? 'rotate(180deg)' : 'none',
        transition: 'transform 150ms var(--ease-standard)'
      }
    }, isOpen ? '\u2212' : '+')), isOpen && React.createElement('p', {
      style: {
        margin: '0 4px 22px',
        fontFamily: 'var(--font-body)',
        fontSize: 17,
        lineHeight: 1.6,
        color: 'var(--taupe)',
        maxWidth: 640,
        animation: 'fadeIn 150ms var(--ease-standard)'
      }
    }, it.a), React.createElement('style', null, '@keyframes fadeIn{from{opacity:0}to{opacity:1}}'));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  children,
  variant = 'primary',
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '12px 26px',
    border: '1px solid var(--gold)',
    borderRadius: 0,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'background 150ms var(--ease-standard), color 150ms var(--ease-standard), box-shadow 150ms var(--ease-standard), border-color 150ms var(--ease-standard)'
  };
  const variants = {
    primary: {
      background: hover ? 'var(--gold-bright)' : 'var(--gold)',
      color: 'var(--ink-black)',
      boxShadow: hover ? '0 0 0 1px var(--gold-bright)' : 'none'
    },
    ghost: {
      background: hover ? 'rgba(184,147,91,0.12)' : 'transparent',
      color: hover ? 'var(--gold-bright)' : 'var(--gold)',
      borderColor: hover ? 'var(--gold-bright)' : 'var(--gold)'
    }
  };
  return React.createElement('button', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant]
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/ContactLink.jsx
try { (() => {
function ContactLink({
  href,
  children
}) {
  return React.createElement('a', {
    href,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      color: 'var(--bone)'
    }
  }, children);
}
Object.assign(__ds_scope, { ContactLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ContactLink.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function Divider() {
  return React.createElement('hr', {
    style: {
      border: 'none',
      borderTop: '1px solid var(--hairline)',
      margin: 0
    }
  });
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/IndexNumber.jsx
try { (() => {
function IndexNumber({
  n
}) {
  const v = typeof n === 'number' ? String(n).padStart(2, '0') : n;
  return React.createElement('span', {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: 32,
      color: 'var(--gold)'
    }
  }, v);
}
Object.assign(__ds_scope, { IndexNumber });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IndexNumber.jsx", error: String((e && e.message) || e) }); }

// components/core/ProjectCard.jsx
try { (() => {
function ProjectCard({
  index,
  title,
  description,
  quote,
  tags = [],
  onUnlocked
}) {
  const [phase, setPhase] = React.useState('locked'); // locked -> drawing -> banner -> settled
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && phase === 'locked') {
          if (reduced) {
            setPhase('settled');
            return;
          }
          setPhase('drawing');
          setTimeout(() => setPhase('banner'), 400);
          setTimeout(() => {
            setPhase('settled');
            onUnlocked && onUnlocked();
          }, 400 + 900);
        }
      });
    }, {
      threshold: 0.4
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [phase, reduced, onUnlocked]);
  const borderColor = phase === 'locked' ? 'var(--hairline)' : hover ? 'var(--gold-bright)' : 'var(--gold)';
  const bracket = pos => {
    const base = {
      position: 'absolute',
      width: hover ? 24 : 18,
      height: hover ? 24 : 18,
      borderColor: hover ? 'var(--gold-bright)' : 'var(--gold)',
      opacity: phase === 'locked' ? 0 : 1,
      transition: 'opacity 150ms var(--ease-standard), width 150ms var(--ease-standard), height 150ms var(--ease-standard), border-color 150ms var(--ease-standard)'
    };
    const map = {
      tl: {
        top: -1,
        left: -1,
        borderTop: '2px solid',
        borderLeft: '2px solid'
      },
      br: {
        bottom: -1,
        right: -1,
        borderBottom: '2px solid',
        borderRight: '2px solid'
      }
    };
    return {
      ...base,
      ...map[pos]
    };
  };
  if (phase === 'banner') {
    return React.createElement('div', {
      ref,
      style: {
        position: 'relative',
        border: '1px solid var(--gold)',
        background: 'var(--panel)',
        padding: '48px 26px',
        textAlign: 'center'
      }
    }, React.createElement('div', {
      style: bracket('tl')
    }), React.createElement('div', {
      style: bracket('br')
    }), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.3em',
        color: 'var(--taupe)',
        marginBottom: 14
      }
    }, 'NOTIFICATION'), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--bone)',
        lineHeight: 1.3
      }
    }, 'New Item'), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--oxblood-bright)',
        lineHeight: 1.3
      }
    }, 'Unlocked'), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--taupe)',
        marginTop: 12
      }
    }, 'A new project has entered the archive.'));
  }
  return React.createElement('div', {
    ref,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      border: `1px solid ${borderColor}`,
      background: 'var(--panel)',
      padding: '32px 34px',
      overflow: 'hidden',
      transform: hover && phase === 'settled' ? 'translateY(-4px)' : 'none',
      boxShadow: hover && phase === 'settled' ? 'var(--shadow-panel)' : 'none',
      transition: 'border-color 150ms var(--ease-standard), transform 150ms var(--ease-standard), box-shadow 150ms var(--ease-standard)'
    }
  }, phase === 'drawing' && React.createElement('div', {
    style: {
      position: 'absolute',
      top: -1,
      left: 0,
      height: 1,
      width: '100%',
      background: 'var(--gold)',
      transformOrigin: 'left',
      animation: 'unlockDraw 400ms linear forwards'
    }
  }), React.createElement('div', {
    style: bracket('tl')
  }), React.createElement('div', {
    style: bracket('br')
  }), React.createElement('div', {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.2em',
      color: 'var(--gold)',
      marginBottom: 10
    }
  }, `UNLOCKED: ${typeof index === 'number' ? String(index).padStart(2, '0') : index}`), React.createElement('h3', {
    style: {
      margin: '0 0 14px',
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 30,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      color: hover ? 'var(--bone)' : 'var(--gold-bright)',
      transition: 'color 150ms var(--ease-standard)'
    }
  }, title), quote && React.createElement('p', {
    style: {
      margin: '0 0 18px',
      fontFamily: 'var(--font-body)',
      fontStyle: 'italic',
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--bone)'
    }
  }, `"${quote}"`), React.createElement('p', {
    style: {
      margin: '0 0 18px',
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--taupe)'
    }
  }, description), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, tags.map((t, i) => React.createElement('span', {
    key: i,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--gold-bright)',
      border: '1px solid var(--hairline)',
      padding: '4px 10px'
    }
  }, t))), React.createElement('style', null, '@keyframes unlockDraw{from{transform:scaleX(0)}to{transform:scaleX(1)}}'));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeader.jsx
try { (() => {
function SectionHeader({
  children,
  sparkle = false
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, sparkle && React.createElement('span', {
    style: {
      color: 'var(--gold)',
      fontSize: 16
    }
  }, '\u2726'), React.createElement('h2', {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--bone)'
    }
  }, children));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/core/StatCard.jsx
try { (() => {
function StatCard({
  education,
  interests,
  goals
}) {
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  const rows = [['Educational Background', education], ['Programming Interests', interests], ['Career Goals', goals]];
  const row = ([label, value], i) => React.createElement('div', {
    key: label,
    onMouseEnter: () => setHoverIdx(i),
    onMouseLeave: () => setHoverIdx(-1),
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '180px 1fr',
      gap: 16,
      padding: '14px 0 14px 14px',
      borderTop: '1px solid var(--hairline)',
      background: hoverIdx === i ? 'rgba(184,147,91,0.06)' : 'transparent',
      transition: 'background 150ms var(--ease-standard)'
    }
  }, React.createElement('span', {
    style: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--gold)',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      opacity: hoverIdx === i ? 1 : 0,
      transition: 'opacity 150ms var(--ease-standard)'
    }
  }, '\u2726'), React.createElement('span', {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: hoverIdx === i ? 'var(--gold-bright)' : 'var(--gold)',
      transition: 'color 150ms var(--ease-standard)'
    }
  }, label), React.createElement('span', {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      color: 'var(--bone)',
      lineHeight: 1.5
    }
  }, value));
  return React.createElement('div', {
    style: {
      border: '1px solid var(--gold)',
      padding: '24px 28px',
      background: 'var(--panel)',
      maxWidth: 560
    }
  }, rows.map(row));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  children
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('span', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: hover ? 'var(--ink-black)' : 'var(--gold-bright)',
      background: hover ? 'var(--gold-bright)' : 'transparent',
      border: `1px solid ${hover ? 'var(--gold-bright)' : 'var(--hairline)'}`,
      borderRadius: 0,
      padding: '6px 12px',
      display: 'inline-block',
      cursor: 'default',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'background 150ms var(--ease-standard), color 150ms var(--ease-standard), border-color 150ms var(--ease-standard), transform 150ms var(--ease-standard)'
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ContactLink = __ds_scope.ContactLink;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.IndexNumber = __ds_scope.IndexNumber;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

})();
