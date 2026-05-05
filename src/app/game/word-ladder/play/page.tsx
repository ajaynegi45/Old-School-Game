'use client'

import { Suspense } from 'react'
import WordLadderGame from './WordLadderGame'

export default function WordLadderPlayPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', fontSize: '1.2rem' }}>Loading…</div>}>
      <WordLadderGame />
    </Suspense>
  )
}
