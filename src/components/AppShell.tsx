'use client';

import { useEffect, useState } from 'react';
import { AboutScreen } from '@/components/AboutScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { HomeScreen } from '@/components/HomeScreen';
import { LeadCaptureStep } from '@/components/LeadCaptureStep';
import { QuizForm } from '@/components/QuizForm';
import { ResultsScreen } from '@/components/ResultsScreen';
import type { AnswerMap } from '@/lib/scoring/calculateResult';
import { calculateResult } from '@/lib/scoring/calculateResult';
import { clearRemoteResults, createResult, fetchResults, updateResult } from '@/lib/api/results';
import {
  clearLocalResults,
  loadLocalResults,
  saveLocalResult,
  type FeedbackRating,
  type SavedResultEntry,
} from '@/lib/storage/results';
import { trackEvent } from '@/lib/analytics/analytics';
import { getSourceMetadata } from '@/lib/analytics/source';

type Screen = 'home' | 'about' | 'quiz' | 'lead' | 'results' | 'history';

export function AppShell() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeResult, setActiveResult] = useState<SavedResultEntry | null>(null);
  const [savedResults, setSavedResults] = useState<SavedResultEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLeadSaving, setIsLeadSaving] = useState(false);
  const [isFeedbackSaving, setIsFeedbackSaving] = useState(false);

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

  function updateSavedResultsState(entry: SavedResultEntry) {
    saveLocalResult(entry);
    setSavedResults((prev) => {
      const next = [entry, ...prev.filter((item) => item.id !== entry.id)];
      return next.slice(0, 10);
    });
  }

  async function handleComplete(answers: AnswerMap) {
    const computed = calculateResult(answers);
    const source = getSourceMetadata();
    const entry: SavedResultEntry = {
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      answers,
      primary: computed.primary,
      secondary: computed.secondary,
      summary: computed.summary,
      strengths: computed.strengths,
      watchouts: computed.watchouts,
      leadName: null,
      leadEmail: null,
      leadCapturedAt: null,
      feedbackRating: null,
      feedbackText: null,
      feedbackSubmittedAt: null,
      utmSource: source.utmSource ?? null,
      utmMedium: source.utmMedium ?? null,
      utmCampaign: source.utmCampaign ?? null,
    };

    setIsSaving(true);
    trackEvent('quiz_completed', { answersCount: Object.keys(answers).length });

    try {
      const remoteEntry = await createResult(answers, source);
      setActiveResult(remoteEntry);
      updateSavedResultsState(remoteEntry);
    } catch {
      setActiveResult(entry);
      updateSavedResultsState(entry);
    } finally {
      setIsSaving(false);
      setScreen('lead');
    }
  }

  function handleOpenSaved(entry: SavedResultEntry) {
    setActiveResult(entry);
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

  async function handleLeadSubmit(payload: { leadName: string | null; leadEmail: string | null }) {
    if (!activeResult) return;

    setIsLeadSaving(true);
    trackEvent('lead_submitted', {
      hasName: Boolean(payload.leadName),
      hasEmail: Boolean(payload.leadEmail),
    });

    const nextEntry: SavedResultEntry = {
      ...activeResult,
      leadName: payload.leadName,
      leadEmail: payload.leadEmail,
      leadCapturedAt: new Date().toISOString(),
    };

    try {
      if (activeResult.id && !activeResult.id.startsWith('local-')) {
        const updated = await updateResult(activeResult.id, payload);
        setActiveResult(updated);
        updateSavedResultsState(updated);
      } else {
        setActiveResult(nextEntry);
        updateSavedResultsState(nextEntry);
      }
    } catch {
      setActiveResult(nextEntry);
      updateSavedResultsState(nextEntry);
    } finally {
      setIsLeadSaving(false);
      setScreen('results');
    }
  }

  function handleLeadSkip() {
    trackEvent('lead_skipped');
    setScreen('results');
  }

  function handleLeadViewed() {
    trackEvent('lead_capture_viewed', {
      resultId: activeResult?.id ?? null,
    });
  }

  async function handleFeedbackSubmit(payload: { feedbackRating: FeedbackRating; feedbackText: string | null }) {
    if (!activeResult) return;

    setIsFeedbackSaving(true);
    trackEvent('feedback_submitted', {
      feedbackRating: payload.feedbackRating,
      hasText: Boolean(payload.feedbackText),
    });

    const nextEntry: SavedResultEntry = {
      ...activeResult,
      feedbackRating: payload.feedbackRating,
      feedbackText: payload.feedbackText,
      feedbackSubmittedAt: new Date().toISOString(),
    };

    try {
      if (activeResult.id && !activeResult.id.startsWith('local-')) {
        const updated = await updateResult(activeResult.id, payload);
        setActiveResult(updated);
        updateSavedResultsState(updated);
      } else {
        setActiveResult(nextEntry);
        updateSavedResultsState(nextEntry);
      }
    } catch {
      setActiveResult(nextEntry);
      updateSavedResultsState(nextEntry);
    } finally {
      setIsFeedbackSaving(false);
    }
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
        {screen === 'lead' && activeResult && (
          <LeadCaptureStep
            onViewed={handleLeadViewed}
            onSkip={handleLeadSkip}
            onSubmit={handleLeadSubmit}
            isSubmitting={isLeadSaving}
          />
        )}
        {screen === 'results' && activeResult && (
          <ResultsScreen
            entry={activeResult}
            onRetake={() => setScreen('quiz')}
            onOpenHistory={() => setScreen('history')}
            onBackHome={() => setScreen('home')}
            onFeedbackSubmit={handleFeedbackSubmit}
            isFeedbackSaving={isFeedbackSaving}
          />
        )}
        {screen === 'history' && (
          <HistoryScreen
            savedResults={savedResults}
            onOpenSaved={handleOpenSaved}
            onClearHistory={handleClearHistory}
            onBack={() => setScreen(activeResult ? 'results' : 'home')}
          />
        )}
      </div>
    </main>
  );
}
