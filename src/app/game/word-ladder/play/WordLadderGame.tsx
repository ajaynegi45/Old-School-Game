'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'
import {
  getRandomPuzzle,
  isValidWord,
  getHint,
  diffCount,
  type Difficulty,
  type PuzzlePair,
} from '../wordList'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GameStatus = 'playing' | 'won' | 'lost'

type ErrorKind =
  | 'not-a-word'
  | 'wrong-length'
  | 'multiple-changes'
  | 'no-change'
  | 'already-used'
  | null

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VALID_DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard']

const MAX_LIVES: Record<Difficulty, number> = {
  easy: 5,
  medium: 3,
  hard: 2,
}

const ERROR_MESSAGES: Record<NonNullable<ErrorKind>, string> = {
  'not-a-word': '❌ Not a valid word.',
  'wrong-length': '❌ Word must be the same length as the start word.',
  'multiple-changes': '❌ You can only change ONE letter at a time.',
  'no-change': '❌ The word must be different from the current one.',
  'already-used': '⚠️ You already used that word.',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns an array describing which positions changed vs the previous word */
function getChangedPositions(prev: string, current: string): boolean[] {
  return current.split('').map((ch, i) => ch !== prev[i])
}

/** Validates the difficulty search param against the allowlist */
function parseDifficulty(value: string | null): Difficulty {
  if (value !== null && (VALID_DIFFICULTIES as string[]).includes(value)) {
    return value as Difficulty
  }
  return 'medium'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WordLadderGame() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const difficulty = parseDifficulty(searchParams.get('difficulty'))

  const [puzzle, setPuzzle] = useState<PuzzlePair | null>(null)
  const [chain, setChain] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<GameStatus>('playing')
  const [error, setError] = useState<ErrorKind>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [lives, setLives] = useState<number>(() => MAX_LIVES[difficulty])
  const [shake, setShake] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  // Refs to hold pending timeout IDs so we can clean them up
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const maxLives = MAX_LIVES[difficulty]

  // ── Cleanup timers on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current)
      if (lostTimerRef.current) clearTimeout(lostTimerRef.current)
    }
  }, [])

  // ── Initialise / reset a puzzle ─────────────────────────────────────────
  const initPuzzle = useCallback(() => {
    // Cancel any pending timers from a previous game
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current)
    if (lostTimerRef.current) clearTimeout(lostTimerRef.current)

    const p = getRandomPuzzle(difficulty)
    setPuzzle(p)
    setChain([p.start])
    setInput('')
    setStatus('playing')
    setError(null)
    setHint(null)
    setHintsUsed(0)
    setLives(MAX_LIVES[difficulty])
  }, [difficulty])

  useEffect(() => {
    initPuzzle()
  }, [initPuzzle])

  // Focus the input whenever the player can act
  useEffect(() => {
    if (status === 'playing') inputRef.current?.focus()
  }, [status, chain])

  // ── Derived values ───────────────────────────────────────────────────────
  const stepsUsed = chain.length - 1
  const stepsLeft = puzzle ? puzzle.maxSteps - stepsUsed : 0
  const currentWord = chain[chain.length - 1] ?? ''

  // O(1) lookup for already-used words — avoids O(n) array scan on every submit
  const usedWordSet = useMemo(() => new Set(chain), [chain])

  // ── Error helper ─────────────────────────────────────────────────────────
  const triggerError = useCallback((kind: ErrorKind) => {
    setError(kind)
    setShake(true)
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current)
    shakeTimerRef.current = setTimeout(() => setShake(false), 500)
  }, [])

  // ── Submit a word ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!puzzle || status !== 'playing') return
    const word = input.trim().toUpperCase()
    if (word === '') return

    setHint(null)

    // ── Validations that do NOT cost a life ──────────────────────────────
    if (word.length !== puzzle.start.length) {
      triggerError('wrong-length')
      return
    }
    if (word === currentWord) {
      triggerError('no-change')
      return
    }
    if (diffCount(word, currentWord) !== 1) {
      triggerError('multiple-changes')
      return
    }
    if (usedWordSet.has(word)) {
      triggerError('already-used')
      return
    }

    // ── Dictionary check — costs one life ────────────────────────────────
    if (!isValidWord(word)) {
      triggerError('not-a-word')
      setLives((prev) => {
        const next = prev - 1
        if (next <= 0) {
          if (lostTimerRef.current) clearTimeout(lostTimerRef.current)
          lostTimerRef.current = setTimeout(() => setStatus('lost'), 400)
        }
        return next
      })
      return
    }

    // ── Valid move ───────────────────────────────────────────────────────
    const newChain = [...chain, word]
    setChain(newChain)
    setInput('')
    setError(null)

    if (word === puzzle.target) {
      setStatus('won')
      return
    }

    if (newChain.length - 1 >= puzzle.maxSteps) {
      setStatus('lost')
    }
  }, [puzzle, status, input, currentWord, usedWordSet, chain, triggerError])

  // ── Hint ─────────────────────────────────────────────────────────────────
  const handleHint = useCallback(() => {
    if (!puzzle || status !== 'playing') return
    // Pass the full chain so BFS never suggests an already-used word
    const next = getHint(currentWord, puzzle.target, chain)
    setHint(next ?? 'no-path')
    setHintsUsed((h) => h + 1)
  }, [puzzle, status, currentWord, chain])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }, [handleSubmit])

  // ── Render ───────────────────────────────────────────────────────────────
  if (!puzzle) {
    return <div className={styles.loading}>Loading puzzle…</div>
  }

  const progressPct = Math.min((stepsUsed / puzzle.maxSteps) * 100, 100)
  const progressColor =
    stepsLeft > puzzle.maxSteps * 0.5
      ? '#22c55e'
      : stepsLeft > puzzle.maxSteps * 0.25
      ? '#f97316'
      : '#ef4444'

  return (
    <div className={styles.container}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/game/word-ladder')}>
          ← Back
        </button>
        <h1 className={styles.title}>Word Ladder</h1>
        <span className={styles.diffBadge} data-difficulty={difficulty}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>

      {/* ── Stats bar ── */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Steps used</span>
          <span className={styles.statValue}>{stepsUsed}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Steps left</span>
          <span className={styles.statValue} style={{ color: progressColor }}>
            {stepsLeft}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Hints used</span>
          <span className={styles.statValue}>{hintsUsed}</span>
        </div>
      </div>

      {/* ── Lives ── */}
      <div className={styles.livesRow}>
        {Array.from({ length: maxLives }).map((_, i) => (
          <span
            key={i}
            className={`${styles.heart} ${i < lives ? styles.heartAlive : styles.heartDead}`}
          >
            {i < lives ? '❤️' : '🖤'}
          </span>
        ))}
        <span className={styles.livesLabel}>
          {lives > 0 ? `${lives} life${lives !== 1 ? 'ves' : ''} remaining` : 'No lives left'}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPct}%`, backgroundColor: progressColor }}
        />
      </div>

      {/* ── Target banner ── */}
      <div className={styles.targetBanner}>
        <span className={styles.targetLabel}>Target</span>
        <div className={styles.wordRow}>
          {puzzle.target.split('').map((letter, i) => {
            const matched = currentWord[i] === letter
            return (
              <span
                key={i}
                className={`${styles.tile} ${matched ? styles.tileMatch : styles.tileTarget}`}
              >
                {letter}
              </span>
            )
          })}
        </div>
      </div>

      {/* ── Word chain ── */}
      <div className={styles.chainContainer} aria-label="Word chain">
        {chain.map((word, wi) => {
          const isFirst = wi === 0
          const isLast = wi === chain.length - 1
          const prevWord = wi > 0 ? chain[wi - 1] : null
          const changed = prevWord ? getChangedPositions(prevWord, word) : null

          return (
            <div
              key={wi}
              className={`${styles.chainRow} ${isFirst ? styles.chainStart : ''} ${isLast && status === 'playing' ? styles.chainCurrent : ''} ${isLast && status === 'won' ? styles.chainWon : ''}`}
            >
              <span className={styles.chainIndex}>{wi === 0 ? '★' : wi}</span>
              <div className={styles.wordRow}>
                {word.split('').map((letter, li) => {
                  const wasChanged = changed ? changed[li] : false
                  return (
                    <span
                      key={li}
                      className={`${styles.tile} ${
                        isFirst
                          ? styles.tileStart
                          : wasChanged
                          ? styles.tileChanged
                          : styles.tileSame
                      } ${isLast && status === 'won' ? styles.tileWon : ''}`}
                    >
                      {letter}
                    </span>
                  )
                })}
              </div>
              {isFirst && <span className={styles.startBadge}>Start</span>}
            </div>
          )
        })}
      </div>

      {/* ── Hint display ── */}
      {hint && hint !== 'no-path' && status === 'playing' && (
        <div className={styles.hintBox}>
          💡 Try: <strong>{hint}</strong>
        </div>
      )}
      {hint === 'no-path' && status === 'playing' && (
        <div className={styles.hintBox} style={{ borderColor: '#fca5a5', background: '#fee2e2', color: '#b91c1c' }}>
          ❌ No path found from here — try a different route!
        </div>
      )}

      {/* ── Input area ── */}
      {status === 'playing' && (
        <div className={`${styles.inputArea} ${shake ? styles.shake : ''}`}>
          <input
            ref={inputRef}
            className={styles.wordInput}
            type="text"
            value={input}
            onChange={(e) => {
              setError(null)
              setInput(e.target.value.toUpperCase().slice(0, puzzle.start.length))
            }}
            onKeyDown={handleKeyDown}
            maxLength={puzzle.start.length}
            placeholder={'_'.repeat(puzzle.start.length)}
            aria-label="Enter your next word"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
          />
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Submit
          </button>
          <button className={styles.hintBtn} onClick={handleHint} title="Get a hint">
            💡 Hint
          </button>
        </div>
      )}

      {/* ── Error message ── */}
      {error && (
        <p className={styles.errorMsg} role="alert">
          {ERROR_MESSAGES[error]}
          {error === 'not-a-word' && ' (-1 ❤️)'}
        </p>
      )}

      {/* ── Win screen ── */}
      {status === 'won' && (
        <div className={styles.resultCard} data-result="won">
          <div className={styles.resultEmoji}>🎉</div>
          <h2 className={styles.resultTitle}>You did it!</h2>
          <p className={styles.resultDesc}>
            <strong>{puzzle.start}</strong> → <strong>{puzzle.target}</strong> in{' '}
            <strong>{stepsUsed} step{stepsUsed !== 1 ? 's' : ''}</strong> with{' '}
            <strong>{lives} life{lives !== 1 ? 'ves' : ''}</strong> remaining.
            {hintsUsed === 0 && ' No hints — impressive! 🧠'}
          </p>
          <div className={styles.resultActions}>
            <button className={styles.playAgainBtn} onClick={initPuzzle}>
              Play Again
            </button>
            <button className={styles.backBtnResult} onClick={() => router.push('/game/word-ladder')}>
              Change Difficulty
            </button>
          </div>
        </div>
      )}

      {/* ── Lose screen ── */}
      {status === 'lost' && (
        <div className={styles.resultCard} data-result="lost">
          <div className={styles.resultEmoji}>{lives <= 0 ? '💔' : '😔'}</div>
          <h2 className={styles.resultTitle}>
            {lives <= 0 ? 'Out of lives!' : 'Out of steps!'}
          </h2>
          <p className={styles.resultDesc}>
            You couldn&apos;t reach <strong>{puzzle.target}</strong>.
          </p>
          <OptimalPath start={puzzle.start} target={puzzle.target} />
          <div className={styles.resultActions}>
            <button className={styles.playAgainBtn} onClick={initPuzzle}>
              Try Again
            </button>
            <button className={styles.backBtnResult} onClick={() => router.push('/game/word-ladder')}>
              Change Difficulty
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-component: shows the BFS optimal path on loss
// ---------------------------------------------------------------------------
function OptimalPath({ start, target }: { start: string; target: string }) {
  const [path, setPath] = useState<string[] | null>(null)

  useEffect(() => {
    // Run BFS in a microtask to avoid blocking the render
    const timer = setTimeout(() => {
      // Dynamically import to keep the initial bundle clean
      import('../wordList').then(({ bfs, getWordSet }) => {
        const wordSet = getWordSet(start.length)
        const found = bfs(start, target, wordSet as Set<string>)
        setPath(found)
      })
    }, 50)
    return () => clearTimeout(timer)
  }, [start, target])

  if (!path) return <p className={styles.resultDesc}>Calculating optimal path…</p>

  return (
    <div className={styles.optimalPath}>
      <p className={styles.optimalLabel}>One possible path ({path.length - 1} steps):</p>
      <div className={styles.optimalChain}>
        {path.map((word, i) => (
          <span key={i} className={styles.optimalItem}>
            <span className={styles.optimalWord}>{word}</span>
            {i < path.length - 1 && <span className={styles.optimalArrow}>→</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
