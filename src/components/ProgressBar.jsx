import { motion } from 'framer-motion';
import chapters from '../data/chapters.js';

export default function ProgressBar({ currentChapter, scrollProgress, accentColor, onNavigate }) {
  // References don't count toward progress
  const progressChapters = chapters.filter((c) => c.number !== '∞');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '260px',
        right: 0,
        zIndex: 80,
        padding: '0 1rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {/* Chapter indicators */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          flex: 1,
          height: '3px',
          alignItems: 'center',
        }}
      >
        {progressChapters.map((ch) => {
          const isCurrent = ch.id === currentChapter;
          const isPast = ch.id < currentChapter;
          let width = '1fr';

          return (
            <button
              key={ch.id}
              onClick={() => onNavigate(ch.id)}
              title={ch.title}
              style={{
                flex: 1,
                height: '100%',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
                background: isPast
                  ? accentColor
                  : isCurrent
                  ? `${accentColor}60`
                  : 'rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.3s ease',
                minWidth: '4px',
              }}
            >
              {isCurrent && (
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
                  transition={{ duration: 0.1 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    background: accentColor,
                    borderRadius: '2px',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Chapter label */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: accentColor,
          opacity: 0.6,
          whiteSpace: 'nowrap',
        }}
      >
        {chapters[currentChapter].number}/{chapters[chapters.length - 2].number}
      </span>
    </div>
  );
}
