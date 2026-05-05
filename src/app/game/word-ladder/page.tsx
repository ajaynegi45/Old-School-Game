'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import type { Difficulty } from './wordList'

const DIFFICULTY_INFO: Record<
  Difficulty,
  { label: string; description: string; wordLen: string; steps: string; color: string }
> = {
  easy: {
    label: 'Easy',
    description: '3-letter words. Great for beginners.',
    wordLen: '3 letters',
    steps: 'Up to 7 steps',
    color: '#22C55E',
  },
  medium: {
    label: 'Medium',
    description: '4-letter words. A solid challenge.',
    wordLen: '4 letters',
    steps: 'Up to 9 steps',
    color: '#F97316',
  },
  hard: {
    label: 'Hard',
    description: '5-letter words. For expert wordsmiths.',
    wordLen: '5 letters',
    steps: 'Up to 8 steps',
    color: '#EF4444',
  },
}

export default function WordLadderLanding() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const router = useRouter()

  const handleStart = () => {
    router.push(`/game/word-ladder/play?difficulty=${difficulty}`)
  }

  return (
    <div className={styles.container}>
      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.badge}>🧠 Brain Training</div>
        <h1 className={styles.title}>Word Ladder</h1>
        <p className={styles.subtitle}>
          Transform one word into another — one letter at a time.
        </p>
      </header>

      {/* ── Difficulty Picker ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Choose Difficulty</h2>

        <div className={styles.difficultyGrid}>
          {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((d) => {
            const info = DIFFICULTY_INFO[d]
            return (
              <button
                key={d}
                className={`${styles.diffBtn} ${difficulty === d ? styles.diffBtnActive : ''}`}
                style={difficulty === d ? { borderColor: info.color, backgroundColor: info.color + '18' } : {}}
                onClick={() => setDifficulty(d)}
                aria-pressed={difficulty === d}
              >
                <span className={styles.diffLabel} style={difficulty === d ? { color: info.color } : {}}>
                  {info.label}
                </span>
                <span className={styles.diffWordLen}>{info.wordLen}</span>
                <span className={styles.diffSteps}>{info.steps}</span>
                <span className={styles.diffDesc}>{info.description}</span>
              </button>
            )
          })}
        </div>

        <button
          className={styles.startBtn}
          onClick={handleStart}
          style={{ backgroundColor: DIFFICULTY_INFO[difficulty].color }}
        >
          ▶ Start Game
        </button>
      </section>

      {/* ── How to Play ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📖 How to Play</h2>
        <div className={styles.rulesList}>
          <div className={styles.rule}>
            <span className={styles.ruleNum}>1</span>
            <p>
              You are given a <strong>start word</strong> and a{' '}
              <strong>target word</strong> of the same length.
            </p>
          </div>
          <div className={styles.rule}>
            <span className={styles.ruleNum}>2</span>
            <p>
              Each step you must type a valid English word that differs from the
              previous word by <strong>exactly one letter</strong>.
            </p>
          </div>
          <div className={styles.rule}>
            <span className={styles.ruleNum}>3</span>
            <p>
              Reach the target word before you run out of steps to win!
            </p>
          </div>
          <div className={styles.rule}>
            <span className={styles.ruleNum}>4</span>
            <p>
              Stuck? Use the <strong>💡 Hint</strong> button to reveal the next
              optimal word (use sparingly).
            </p>
          </div>
        </div>

        <div className={styles.exampleBox}>
          <p className={styles.exampleLabel}>Example: COLD → WARM</p>
          <div className={styles.exampleChain}>
            {['COLD', 'CORD', 'WORD', 'WARD', 'WARM'].map((w, i, arr) => (
              <span key={w} className={styles.exampleItem}>
                <span className={styles.exampleWord}>{w}</span>
                {i < arr.length - 1 && <span className={styles.arrow}>→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cognitive Benefits ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🧠 Cognitive Benefits</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>💾</div>
            <h3>Working Memory</h3>
            <p>
              Holding multiple possible transformations in mind at once
              strengthens working memory and trains the <em>prefrontal cortex</em>.
            </p>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🔍</div>
            <h3>Pattern Recognition</h3>
            <p>
              Spotting letter patterns and word families sharpens visual memory
              and orthographic processing in the <em>left hemisphere</em>.
            </p>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🎯</div>
            <h3>Strategic Thinking</h3>
            <p>
              Planning several moves ahead builds executive function and
              forward-planning ability tied to the <em>prefrontal cortex</em>.
            </p>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>📚</div>
            <h3>Vocabulary Recall</h3>
            <p>
              Retrieving words under mild pressure reinforces long-term memory
              pathways and improves verbal fluency.
            </p>
          </div>
        </div>
      </section>

      {/* ── Scientific Backing ── */}
      <section className={`${styles.section} ${styles.scienceSection}`}>
        <h2 className={styles.sectionTitle}>📄 Scientific Backing</h2>
        <ul className={styles.scienceList}>
          <li>
            <strong>Verbal fluency &amp; memory:</strong> Word puzzles improve
            working memory and cognitive flexibility.{' '}
            <em>
              Journal of Neuropsychiatry &amp; Clinical Neurosciences, 2014
            </em>
            .
          </li>
          <li>
            <strong>Aphasia rehabilitation:</strong> Word-ladder style tasks are
            used clinically to strengthen word-retrieval pathways damaged by
            stroke. <em>(Stroke Rehabilitation Research, 2018)</em>
          </li>
          <li>
            <strong>Cognitive Reserve Theory:</strong> Regular engagement with
            word games builds mental resilience and is associated with reduced
            risk of cognitive decline in aging.{' '}
            <em>Stern, Y. — Cognitive reserve in ageing and Alzheimer&apos;s disease, 2012</em>
            .
          </li>
        </ul>
      </section>

      {/* ── Final CTA ── */}
      <div className={styles.ctaBottom}>
        <button
          className={styles.startBtn}
          onClick={handleStart}
          style={{ backgroundColor: DIFFICULTY_INFO[difficulty].color }}
        >
          ▶ Start Playing — {DIFFICULTY_INFO[difficulty].label}
        </button>
      </div>
    </div>
  )
}
