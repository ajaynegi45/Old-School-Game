'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Extended icons array with 40 unique symbols
const ALL_CARD_SYMBOLS = [
  // Entertainment & Games
  '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎹',
  '🎺', '🎻', '🎤', '🎧', '🎬', '🎰', '🎳', '🏓',
  
  // Animals & Nature
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐸', '🐵', '🐒', '🦋', '🐝',
  
  // Food & Drinks
  '🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🍒', '🍑',
  '🥝', '🍍', '🥭', '🍉', '🍕', '🍔', '🌭', '🍟',
  
  // Objects & Symbols
  '⭐', '🌟', '✨', '💎', '🔥', '💧', '🌈', '☀️'
];

// Fisher-Yates shuffle algorithm for better randomization
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to select random symbols for the game
const selectRandomSymbols = (count = 8) => {
  const shuffled = shuffleArray(ALL_CARD_SYMBOLS);
  return shuffled.slice(0, count);
};

const MemoryFlipCardGame = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [cardSymbols, setCardSymbols] = useState<string[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [bestScore, setBestScore] = useState<{moves: number, time: number} | null>(null);

  const getDifficultySettings = () => {
    switch(difficulty) {
      case 'easy': return { pairs: 6, gridCols: 4 };
      case 'medium': return { pairs: 8, gridCols: 4 };
      case 'hard': return { pairs: 12, gridCols: 6 };
      default: return { pairs: 6, gridCols: 4 };
    }
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const { pairs } = getDifficultySettings();
    const selectedSymbols = selectRandomSymbols(pairs);
    setCardSymbols(selectedSymbols);
    
    const shuffledCards = shuffleArray([...selectedSymbols, ...selectedSymbols])
      .map((symbol, index) => ({
        id: index,
        value: symbol,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTime(0);
    setIsGameActive(false);
    setGameCompleted(false);
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && !gameCompleted) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, gameCompleted]);

  // Initialize game on mount and difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Load best score from localStorage
 useEffect(() => {
  try {
    const savedBestScore = localStorage.getItem('memoryGameBestScore');
    if (savedBestScore) {
      setBestScore(JSON.parse(savedBestScore));
    }
  } catch (error) {
    console.warn('Unable to load best score:', error);
  }
}, []);

  const handleCardClick = (clickedCard: Card) => {
    if (!isGameActive) {
      setIsGameActive(true);
    }

    if (
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);

    setCards(prev =>
      prev.map(card =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check for game completion
  useEffect(() => {
    const { pairs } = getDifficultySettings();
    if (matchedPairs === pairs && isGameActive) {
      setGameCompleted(true);
      setIsGameActive(false);
      
      // Check if this is a new best score
      if (!bestScore || moves < bestScore.moves || (moves === bestScore.moves && time < bestScore.time)) {
        const newBestScore = { moves, time };
        setBestScore(newBestScore);
        localStorage.setItem('memoryGameBestScore', JSON.stringify(newBestScore));
      }
    }
  }, [matchedPairs, moves, time, isGameActive, bestScore, difficulty]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreRating = () => {
    const { pairs } = getDifficultySettings();
    const perfectMoves = pairs + 2;
    const goodMoves = pairs * 2;
    const okMoves = pairs * 2.5;
    
    if (moves <= perfectMoves) return '🏆 Perfect!';
    if (moves <= goodMoves) return '⭐ Excellent!';
    if (moves <= okMoves) return '👍 Good!';
    return '💪 Keep practicing!';
  };

  const { pairs, gridCols } = getDifficultySettings();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Memory Flip Card Game</h1>
        <p className={styles.subtitle}>Challenge your mind and improve your memory!</p>
      </div>

      {/* Difficulty Selection */}
      <div className={styles.difficultySelector}>
        {(['easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            type="button"
            className={`${styles.difficultyButton} ${difficulty === level ? styles.active : ''}`}
            onClick={() => setDifficulty(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)} ({level === 'easy' ? '6' : level === 'medium' ? '8' : '12'} pairs)
          </button>
        ))}
      </div>

      <div className={styles.gameStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Moves:</span>
          <span className={styles.statValue}>{moves}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Time:</span>
          <span className={styles.statValue}>{formatTime(time)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Pairs:</span>
          <span className={styles.statValue}>{matchedPairs}/{pairs}</span>
        </div>
      </div>

      {bestScore && (
        <div className={styles.bestScore}>
          <span>🏅 Best Score: {bestScore.moves} moves in {formatTime(bestScore.time)}</span>
        </div>
      )}

      <div className={`${styles.gameBoard} ${styles[`grid${gridCols}`]}`}>
        {cards.map((card) => (
          <div
  key={card.id}
  className={`${styles.card} ${
    card.isFlipped || card.isMatched ? styles.flipped : ''
  } ${card.isMatched ? styles.matched : ''}`}
  onClick={() => handleCardClick(card)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(card);
    }
  }}
  role="button"
  tabIndex={0}
  aria-label={`Card ${card.id + 1}${card.isFlipped || card.isMatched ? `, showing ${card.value}` : ''}`}
  aria-pressed={card.isFlipped || card.isMatched}
>

            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <span className={styles.cardSymbol}>?</span>
              </div>
              <div className={styles.cardBack}>
                <span className={styles.cardSymbol}>{card.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gameCompleted && (
        <div className={styles.gameCompleted}>
          <div className={styles.completionMessage}>
            <h2>🎉 Congratulations!</h2>
            <p>You completed the {difficulty} level!</p>
            <div className={styles.finalStats}>
              <p><strong>Moves:</strong> {moves}</p>
              <p><strong>Time:</strong> {formatTime(time)}</p>
              <p><strong>Rating:</strong> {getScoreRating()}</p>
            </div>

            <button 
              className={styles.resetButton}
              onClick={initializeGame}
              type="button"
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}

      <div className={styles.gameControls}>
        <button 
          className={styles.resetButton}
          onClick={initializeGame}
          type="button"
        >
          🔄 New Game
        </button>
      </div>

      {/* Enhanced How to Play Section */}
      {/* How to Play Section */}
<div className={styles.rulesContainer}>
  <h3 className={styles.sectionTitle}>How to Play</h3>
  <ul className={styles.rulesList}>
    <li className={styles.ruleItem}>
    Click on any card to flip it and reveal the symbol underneath
    </li>
    <li className={styles.ruleItem}>
      Find and click on another card to try and find a matching symbol
    </li>
    <li className={styles.ruleItem}>
      If the symbols match, the cards will stay flipped. If not, they'll flip back
    </li>
    <li className={styles.ruleItem}>
      Match all pairs to win the game
    </li>
  </ul>
</div>

<div className={styles.rulesContainer}>
  <h3 className={styles.sectionTitle}>Brain Benefits</h3>
  <div className={styles.benefitsSection}>
    <div className={styles.benefitItem}>
      <h4 className={styles.benefitTitle}>🧠 Grey Matter Stimulation</h4>
      <p className={styles.benefitDescription}>Strengthens neural connections in hippocampus (memory center)</p>
    </div>
    <div className={styles.benefitItem}>
      <h4 className={styles.benefitTitle}>⚡ Mental Agility</h4>
      <p className={styles.benefitDescription}>Improves cognitive flexibility and pattern recognition</p>
    </div>
    <div className={styles.benefitItem}>
      <h4 className={styles.benefitTitle}>🎯 Focus Enhancement</h4>
      <p className={styles.benefitDescription}>Builds attention span by resisting short-form content habits</p>
    </div>
    <div className={styles.benefitItem}>
      <h4 className={styles.benefitTitle}>🔄 Information Processing</h4>
      <p className={styles.benefitDescription}>Trains working memory and visual-spatial processing</p>
    </div>
  </div>
</div>

    </div>
  );
};

export default MemoryFlipCardGame;