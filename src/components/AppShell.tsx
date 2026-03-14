'use client';

import { useEffect, useState } from 'react';
import { AboutScreen } from '@/components/AboutScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { HomeScreen } from '@/components/HomeScreen';
import { QuizForm } from '@/components/QuizForm';
import { ResultsScreen } from '@/components/ResultsScreen';
import type { AnswerMap } from '@/lib/scoring/calculateResult';
import { calculateResult } from '@/lib/scoring/calculateResult';
import { clearRemoteResults, createResult, fetchResults } from '@/lib/api/results';
import { clearLocalResults, loadLocalResults, saveLocalResult, type SavedResultEntry } from '@/lib/storage/results';
import { trackEvent } from '@/lib/analytics/analytics';
import { getSourceMetadata } from '@/lib/analytics/source';

type Screen = 'home' | 'about' | 'quiz' | 'results' | 'history';

export function AppShell() {
  const [screen, setScreen] = useState<Screen>('home');
  const [latestAnswers, setLatestAnswers] = useState<AnswerMap | null>(null);
  const [savedResults, setSavedResults] = useState<SavedResultEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadResults() {
      try {
        const remoteResults = await fetchResults(controller.signal);
        if (isActive) {
          setSavedResults(remoteResults);
        }
      } catch {
        if (isActive) {
          setSavedResults(loadLocalResults());
        }
      }
    }

    loadResults();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  async function handleComplete(answers: AnswerMap) {
    const computed = calculateResult(answers);
    const source = getSourceMetadata();
    const entry: SavedResultEntry = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      answers,
      primary: computed.primary,
      secondary: computed.secondary,
      summary: computed.summary,
      strengths: computed.strengths,
      watchouts: computed.watchouts,
      utmSource: source.utmSource ?? null,
      utmMedium: source.utmMedium ?? null,
      utmCampaign: source.utmCampaign ?? null,
    };

    setLatestAnswers(answers);
    setScreen('results');
    setIsSaving(true);
    trackEvent('quiz_completed', { answersCount: Object.keys(answers).length });

    try {
      const remoteEntry = await createResult(answers, source);
      saveLocalResult(remoteEntry);
      setSavedResults((prev) => {
        const next = [remoteEntry, ...prev.filter((item) => item.id !== remoteEntry.id)];
        return next.slice(0, 10);
      });
    } catch {
      setSavedResults(saveLocalResult(entry));
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenSaved(entry: SavedResultEntry) {
    setLatestAnswers(entry.answers);
    setScreen('results');
  }

  async function handleClearHistory() {
    try {
      await clearRemoteResults();
      clearLocalResults();
      setSavedResults([]);
    } catch {
      setSavedResults(clearLocalResults());
    }
  }

  function handleStartQuiz() {
    trackEvent('quiz_started');
    setScreen('quiz');
  }

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        {isSaving && (
          <div className="mx-auto mb-4 max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
            Saving your result...
          </div>
        )}

        {screen === 'home' && <HomeScreen onStart={handleStartQuiz} onShowAbout={() => setScreen('about')} />}
        {screen === 'about' && <AboutScreen onBack={() => setScreen('home')} />}
        {screen === 'quiz' && <QuizForm onComplete={handleComplete} onBackHome={() => setScreen('home')} />}
        {screen === 'results' && latestAnswers && (
          <ResultsScreen
            answers={latestAnswers}
            onRetake={() => setScreen('quiz')}
            onOpenHistory={() => setScreen('history')}
            onBackHome={() => setScreen('home')}
          />
        )}
        {screen === 'history' && (
          <HistoryScreen
            savedResults={savedResults}
            onOpenSaved={handleOpenSaved}
            onClearHistory={handleClearHistory}
            onBack={() => setScreen(latestAnswers ? 'results' : 'home')}
          />
        )}
      </div>
    </main>
  );
}
