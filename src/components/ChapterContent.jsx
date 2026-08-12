import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chapters from '../data/chapters.js';

function renderText(text) {
  // Escape HTML first, then parse **bold** and *italic*
  const esc = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const withBold = esc.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const withItalic = withBold.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return withItalic;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const stagger = (i) => ({
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  },
});

function SectionBlock({ section, index, accentColor }) {
  return (
    <motion.div
      key={index}
      variants={stagger(index)}
      initial="initial"
      animate="animate"
      style={{ marginBottom: '2.5rem' }}
    >
      {section.heading && (
        <h3
          style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: '1.5rem',
            fontWeight: 600,
            color: accentColor,
            marginBottom: '1rem',
            lineHeight: 1.4,
          }}
        >
          {section.heading}
        </h3>
      )}

      {section.paragraphs.map((p, pi) => (
        <motion.p
          key={pi}
          variants={stagger(index * 2 + pi + 1)}
          initial="initial"
          animate="animate"
          style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: '1.15rem',
            lineHeight: 1.85,
            marginBottom: '1.2rem',
            color: 'rgba(224,216,200,0.85)',
            maxWidth: '680px',
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: renderText(p) }} />
        </motion.p>
      ))}

      {section.subsections &&
        section.subsections.map((sub, si) => (
          <div key={si} style={{ marginLeft: '1.5rem', marginTop: '1rem', borderLeft: `2px solid ${accentColor}40`, paddingLeft: '1.5rem' }}>
            <h4
              style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: '1.25rem',
                fontWeight: 600,
                color: accentColor,
                marginBottom: '0.75rem',
                opacity: 0.85,
              }}
            >
              {sub.heading}
            </h4>
            {sub.paragraphs.map((sp, spi) => (
              <p
                key={spi}
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  marginBottom: '1rem',
                  color: 'rgba(224,216,200,0.75)',
                  maxWidth: '640px',
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: renderText(sp) }} />
              </p>
            ))}
          </div>
        ))}
    </motion.div>
  );
}

export default function ChapterContent({ chapter, onScroll, readChapters, onMarkRead }) {
  const containerRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const isRead = readChapters[chapter.id];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
      onScroll(progress || 0);

      // Show "mark read" button when scrolled past 90%
      setShowButton(progress > 0.85);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  // Scroll to top on chapter change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    setShowButton(false);
  }, [chapter.id]);

  return (
    <>
      {/* Fixed header bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '260px',
          right: 0,
          height: '72px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.95) 60%, rgba(10,10,10,0))',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: '1.3rem',
            fontWeight: 600,
            color: chapter.accentColor,
            letterSpacing: '0.02em',
          }}
        >
          Manual Nômade de Autogestão
        </span>
      </div>

      <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: '260px',
        right: 0,
        height: '100%',
        zIndex: 10,
        overflowY: 'auto',
        overflowX: 'hidden',
        pointerEvents: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Hero spacer */}
      <div style={{ height: '55vh', pointerEvents: 'none' }} />

      {/* Content */}
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Chapter number */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.8rem',
                fontWeight: 500,
                color: chapter.accentColor,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Capítulo {chapter.number}
              {isRead && (
                <span style={{ marginLeft: '0.75rem', opacity: 0.6, fontSize: '0.7rem' }}>
                  ✓ LIDO
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 700,
                color: chapter.color,
                marginBottom: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              {chapter.title}
            </motion.h1>

            {/* Subtitle — skip for references */}
            {chapter.number !== '∞' && chapter.subtitle && (
            <motion.p
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.05rem',
                fontWeight: 300,
                color: 'rgba(224,216,200,0.5)',
                marginBottom: '3rem',
                maxWidth: '600px',
                lineHeight: 1.6,
              }}
            >
              {chapter.subtitle}
            </motion.p>
            )}

            {/* Sections */}
            {chapter.sections.map((section, i) => (
              <SectionBlock
                key={i}
                section={section}
                index={i}
                accentColor={chapter.accentColor}
              />
            ))}

            {/* Mark as read button — skip for references */}
            {chapter.number !== '∞' && (
            <AnimatePresence>
              {(showButton || isRead) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  style={{
                    marginTop: '2rem',
                    marginBottom: '3rem',
                    textAlign: 'center',
                  }}
                >
                  <button
                    onClick={() => onMarkRead(chapter.id)}
                    style={{
                      background: isRead
                        ? 'rgba(255,255,255,0.06)'
                        : `${chapter.accentColor}20`,
                      border: `1px solid ${isRead ? 'rgba(255,255,255,0.15)' : chapter.accentColor}60`,
                      color: isRead ? 'rgba(255,255,255,0.5)' : chapter.accentColor,
                      padding: '0.7rem 2rem',
                      borderRadius: '2rem',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isRead
                        ? 'rgba(255,255,255,0.1)'
                        : `${chapter.accentColor}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = isRead
                        ? 'rgba(255,255,255,0.06)'
                        : `${chapter.accentColor}20`;
                    }}
                  >
                    {isRead ? 'Marcar como não lido' : 'Marcar como lido'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: '40vh', pointerEvents: 'none' }} />
    </div>
    </>
  );
}
