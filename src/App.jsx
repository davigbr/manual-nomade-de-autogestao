import { useState, useEffect, useCallback } from 'react';
import chapters from './data/chapters.js';
import Scene3D from './components/Scene3D.jsx';
import ChapterContent from './components/ChapterContent.jsx';
import Navigation from './components/Navigation.jsx';
import ProgressBar from './components/ProgressBar.jsx';

const STORAGE_KEY = 'manual-nomade:v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data === 'object' && data.currentChapter !== undefined && data.readChapters) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded — silently fail
  }
}

export default function App() {
  const saved = loadState();
  const [currentChapter, setCurrentChapter] = useState(saved?.currentChapter ?? 0);
  const [readChapters, setReadChapters] = useState(saved?.readChapters ?? {});
  const [scrollProgress, setScrollProgress] = useState(0);

  const chapter = chapters[currentChapter];

  // Persist state changes
  useEffect(() => {
    saveState({ currentChapter, readChapters });
  }, [currentChapter, readChapters]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentChapter((prev) => Math.min(prev + 1, chapters.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentChapter((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleScroll = useCallback((progress) => {
    setScrollProgress(progress);
  }, []);

  const handleNavigate = useCallback((id) => {
    setCurrentChapter(id);
    setScrollProgress(0);
  }, []);

  const handleMarkRead = useCallback((id) => {
    setReadChapters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const accentColor = chapter?.accentColor || '#f4a261';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0a0a0a' }}>
      {/* 3D Scene background */}
      <Scene3D chapter={chapter} scrollProgress={scrollProgress} />

      {/* Content overlay */}
      <ChapterContent
        chapter={chapter}
        onScroll={handleScroll}
        readChapters={readChapters}
        onMarkRead={handleMarkRead}
      />

      {/* Navigation sidebar */}
      <Navigation
        currentChapter={currentChapter}
        onNavigate={handleNavigate}
        readChapters={readChapters}
        accentColor={accentColor}
      />

      {/* Progress bar */}
      <ProgressBar
        currentChapter={currentChapter}
        scrollProgress={scrollProgress}
        accentColor={accentColor}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
