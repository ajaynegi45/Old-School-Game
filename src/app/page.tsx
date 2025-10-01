"use client";

import Image from "next/image";
//import Link from "next/link";
import TicTacToeCardImage from "../../public/TicTacToaImageCard.png";
import CollageImage from "../../public/CollageImage.png";
import SudokuImage from "../../public/Sudoku.png";
import Eclipse from "../../public/Ellipse.png";
import styles from "./page.module.css";

// import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
// import io from 'socket.io-client'; // Import Socket.io client library
// Connect to the Socket.io server using the URL from environment variables or default to localhost
// const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

// const games=[
//     {title: "Tic-Tac-Toe", description: "The classic 3*3 grid. Perfect for a quick, brain-boosting challenge.", link:"/game/tic-tac-toe", image: TicTacToeImage},
//     {title: "Chess", description: "A game of strategy and tactics. Master the pieces and conquer the board. ", link:"/game/chess", image: ChessCardImage},
//     {title: "Checkers", description: "Simple rules, complex strategy. Outmaneuver your opponent to win,", link:"/game/checkers", image: ChessCardImage},
// ]
export default function Home() {

    const handleCardClick=(path:string)=>{
        console.log(`Navigating to: ${path}`);
    };
    // const router = useRouter();
    // const handleCreateGame = () => {
    //     socket.emit('createGame'); // Emit create game event to the server
    //     socket.on('gameCreated', ({ gameNumber }) => { // get 'gameCreated' code from the server
    //         // Automatically redirect to the game page once the game is created
    //         router.push(`/game/tic-tac-toe/${gameNumber}/X`);
    //     });
    // };


    return (
        <div className={styles.PageContainer}>
            {/*1. Hero Section */}
            <header className={styles.heroSection}>
                <h1>Remember the Old Days
                     with Classic Games</h1>
                <p>Step back in time where classic meets modern-day 
                 <br/>  
                    brain training </p>
                <a href="/game" className={styles.downloadButton}>
                    Explore Games
                </a>

            {/*1. Image Collage Section */}
            <div className={styles.heroImageContainer}>
                {/*Replace with actual collage image */}
                <Image src={CollageImage} alt="Classic Games Collage" className="responsiveImage" />
                <div className={styles.heroImageContainer1}>
                <Image src={Eclipse} alt="Eclipse" layout="responsive" width={929} height={88} style={{width: '100%', height: '100%', display: 'block'}} />
                </div>
            </div>
            </header>
            <div className={styles.contentBackground}>
            {/*Trending Games Section */}
            <section className="trendingSection">
                <h2 className={styles.sectionHeading}>Trending Games</h2>
                {/*Tic-Tac-Toe Card*/}
                <div className={`${styles.trendingCard} ${styles.cardLeft}`}
                onClick={()=>handleCardClick("/game/tic-tac-toe")}
                role="link"
                tabIndex={0} >
                <div className={styles.trendingImageContainer}>
                    <Image src={TicTacToeCardImage} alt="Tic-Tac-Toe Game" width={545} height={558}/>
                </div>
                <div className={styles.trendingContent}>
                    <h3>Tic-Tac-Toe Reimagined</h3>
                    <p>Challenge yourself, test your skills, and relive the nostalgia. Put your knowledge of analytical thinking to test with this classic game.</p>
                    {/*Play Now and How it works button*/}
                    <div className={styles.cardButtons}>
                    <a href="/game/tic-tac-toe" className={styles.playNowButton}>Play Now</a>
                    <a href="/how-it-works" className={styles.howItWorksButton}>How it works</a>
                    </div>
                </div>
                </div>
                {/* Sudoku Game Card*/}
                 <div className={`${styles.trendingCard} ${styles.cardRight}`}
                 onClick={()=>handleCardClick("/game/sudoku")}
                role="link"
                tabIndex={0} >
                <div className={styles.trendingImageContainer}>
                    <Image src={SudokuImage} alt="Sudoku Game" width={527} height={445}/>
                </div>
                <div className={styles.trendingContent}>
                    <h3>Sudoku Games</h3>
                    <p>Challenge your friends, test your skills, and relive the nostalgia.</p>
                    {/*Play Now and How it works button*/}
                    <div className={styles.cardButtons}>
                    <a href="/game/sudoku" className={styles.playNowButton}>Play Now</a>
                    <a href="/how-it-works" className={styles.howItWorksButton}>How it works</a>
                    </div>
                </div>
                </div>
                
            </section>

            {/* Games Grid Section */}
            {/* <section className={styles.gamesSection}>
                <h2>Our Games</h2>
                <div className={styles.gamesGrid}>
                    {games.map((game,index)=>(
                        <Link href={game.link} key={index} className={styles.gameCard}> */}
                            {/* Replace with actual game card image */}
                            {/* <Image src={game.image} alt={`${game.title} Card`} width={150} height={150}/>
                            <h3>{game.title}</h3>
                            <p>{game.description}</p>
                        </Link>
                    ))}
                </div>
            </section> */}

            {/* FAQ Section */}
            <section className={styles.faqSection}>
                
                    <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
                    <p>Subsribe to our newletter for new game releases and mind-bending challenges.</p>
                <div className={styles.faqItem}>
                   <h3 className={styles.faqQuestion}>Who can play The Old School Game?</h3>
                    <p className={styles.faqAnswer}>The Old School Game can be played by everyone, irrespective of your age, as long as you have games or looking to relax your brain.</p>
                </div>
                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>How many players are allowed in a game?</h3>
                    <p className={styles.faqAnswer}></p>
                </div>
                     
                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>Who can play The Old School Game?</h3>
                     <p className={styles.faqAnswer}></p>
                </div>
                     
                <div className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>Who can play The Old School Game?</h3>
                    <p className={styles.faqAnswer}></p>
                </div>
                    
                
            </section>
            </div>
        </div>
    );
}


// "dev": "concurrently \"next dev\" \"npm run websocket:dev\"",