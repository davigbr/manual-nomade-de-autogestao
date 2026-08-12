import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chapters from '../data/chapters.js';

const circleSize = 10;

function ChapterDot({ chapter, isActive, isRead, onClick, accentColor }) {
  return (
    <button
      onClick={() => onClick(chapter.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.4rem 0.5rem',
        border: 'none',
        background: isActive ? `${accentColor}15` : 'transparent',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'background 0.2s ease',
      }}
    >
      <span
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: '50%',
          background: isActive ? accentColor : isRead ? `${accentColor}50` : 'rgba(255,255,255,0.15)',
          border: isActive ? `2px solid ${accentColor}` : '2px solid transparent',
          flexShrink: 0,
          transition: 'all 0.3s ease',
        }}
      />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.75rem',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? accentColor : 'rgba(255,255,255,0.5)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'color 0.3s ease',
        }}
      >
        {chapter.number !== '∞' && `${chapter.number}. `}{chapter.title}
      </span>
    </button>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

function SidebarContent({ accentColor, totalRead, contentChapters, progressPct, currentChapter, readChapters, onNavigate, onClose, isMobile }) {
  return (
    <>
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'right',
            padding: '0 0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          Fechar ×
        </div>
      )}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '0.3rem',
          paddingLeft: '0.5rem',
        }}
      >
        Manual Nômade
      </div>
      <div
        style={{
          fontFamily: "'Crimson Text', serif",
          fontSize: '1.1rem',
          color: accentColor,
          marginBottom: '0.2rem',
          paddingLeft: '0.5rem',
        }}
      >
        Autogestão
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: '1.5rem',
          paddingLeft: '0.5rem',
        }}
      >
        {totalRead}/{contentChapters.length} lidos · {progressPct}%
      </div>
      <div
        style={{
          height: '2px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '1px',
          margin: '0 0.5rem 1.5rem',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          style={{ height: '100%', background: accentColor, borderRadius: '1px' }}
        />
      </div>
      {chapters.map((ch) => (
        <ChapterDot
          key={ch.id}
          chapter={ch}
          isActive={ch.id === currentChapter}
          isRead={readChapters[ch.id]}
          onClick={(id) => { onNavigate(id); if (isMobile) onClose(); }}
          accentColor={accentColor}
        />
      ))}
    </>
  );
}

export default function Navigation({ currentChapter, onNavigate, readChapters, accentColor }) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const contentChapters = chapters.filter((c) => c.number !== '∞');
  const totalRead = Object.entries(readChapters)
    .filter(([id]) => id !== '7')
    .filter(([, v]) => v).length;
  const progressPct = Math.round((totalRead / contentChapters.length) * 100);

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: isMobile ? '280px' : 'var(--sidebar-width)',
    height: '100%',
    zIndex: 95,
    background: 'rgba(8,8,8,0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    padding: '2.5rem 1rem 2rem',
    overflowY: 'auto',
  };

  const sharedContent = (
    <SidebarContent
      accentColor={accentColor}
      totalRead={totalRead}
      contentChapters={contentChapters}
      progressPct={progressPct}
      currentChapter={currentChapter}
      readChapters={readChapters}
      onNavigate={onNavigate}
      onClose={() => setMobileOpen(false)}
      isMobile={isMobile}
    />
  );

  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: 'fixed',
            top: '0.75rem',
            left: '0.75rem',
            zIndex: 100,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: `1px solid ${accentColor}40`,
            background: 'rgba(10,10,10,0.7)',
            backdropFilter: 'blur(8px)',
            color: accentColor,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ☰
        </button>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.4)' }}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={sidebarStyle}
              >
                {sharedContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Desktop: always visible */}
      {!isMobile && (
        <div style={sidebarStyle}>
          {sharedContent}
        </div>
      )}
    </>
  );
}
