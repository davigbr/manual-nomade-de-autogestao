import { motion } from 'framer-motion';
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

export default function Navigation({ currentChapter, onNavigate, readChapters, accentColor }) {
  const contentChapters = chapters.filter((c) => c.number !== '∞');
  const totalRead = Object.entries(readChapters)
    .filter(([id]) => id !== '7')
    .filter(([, v]) => v).length;
  const progressPct = Math.round((totalRead / contentChapters.length) * 100);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '260px',
        height: '100%',
        zIndex: 95,
        background: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '2.5rem 1rem 2rem',
        overflowY: 'auto',
      }}
    >
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

      {/* Progress */}
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

      {/* Progress bar */}
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
          style={{
            height: '100%',
            background: accentColor,
            borderRadius: '1px',
          }}
        />
      </div>

      {/* Chapter list */}
      {chapters.map((ch) => (
        <ChapterDot
          key={ch.id}
          chapter={ch}
          isActive={ch.id === currentChapter}
          isRead={readChapters[ch.id]}
          onClick={onNavigate}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}
