import Image from "next/image";
import Link from "next/link";
import TicTacToeImage from "/public/tic-tac-toe.svg";
import styles from "./page.module.css";

export default function AboutUs() {
    return (
        <header className={styles.headerContainer}>
            <div id={styles.bgGrid}>
                <div id={styles.blurGrid}></div>
            </div>

            <div className={styles.heroSection}>
                <h1 className={styles.title}>Old School Game</h1>
                <h2 className={styles.title}>Boost Your Brain with Classic Fun!</h2>

                <div className={styles.divContainer}>
                    <h2>✍️ What is OldSchoolGame?</h2>
                    <p>Old School Game is a curated collection of timeless, logic-based games designed to enhance cognitive abilities, improve memory, and sharpen problem-solving skills — all while having fun!</p>
                    <p>Whether you're reliving childhood nostalgia or seeking a mental workout, these games offer a perfect blend of entertainment and brain training.</p>

                    <h2>🎯 Goals and Vision</h2>
                    <ul>
                        <li>Create a library of classic brain-training games</li>
                        <li>Promote mental fitness through engaging gameplay</li>
                        <li>Encourage open-source contributions for educational and cognitive benefits</li>
                    </ul>

                    <h2>🚀 Future Plans</h2>
                    <p>Adding more games coming soon that focus on logic, memory, attention, and problem-solving!</p>

                    <h2>❤️ Why Cognitive Games Matter</h2>
                    <p>Cognitive games are much more than simple entertainment—they are powerful tools for enhancing mental abilities and supporting lifelong learning. By engaging with challenges that stimulate memory, attention, logic, and problem-solving skills, players can improve their cognitive functions in a fun and interactive way. </p>
                    <p>These games help keep the mind sharp, foster creativity, and build resilience to stress. Whether for children, adults, or seniors, cognitive games contribute to overall well-being, making learning enjoyable and supporting healthy brain development at every age.</p>

                    <h2>🔓 Why it’s Open Source</h2>
                    <p>Making Old-School-Game open source is a commitment to collaboration, transparency, and shared growth. By opening the code to everyone, we invite developers, educators, and enthusiasts to contribute, improve, and customize cognitive games for diverse audiences. </p>
                    <p>Open source fosters innovation through collective problem-solving and makes it possible for anyone to learn from, build upon, or adapt the project for their own needs. This approach empowers a global community to advance game-based learning, ensuring the tools remain accessible, up-to-date, and impactful. Together, we can create richer experiences and bring the benefits of cognitive games to more people.</p>
                </div>

            </div>
        </header>
    )
}