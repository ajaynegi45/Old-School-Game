import styles from "./footer.module.css"
import Link from "next/link";

export default function Footer() {


    return (
        <footer className={styles.footerContainer}>

            <div className={styles.newsletter}>
                    <h3>Subscribe to our Newsletter</h3>
                    <p>Stay updated with the latest classic games & new releases.</p>
                        <form className={styles.newletterForm}>
                            <input  type="email" placeholder="Enter Your email" required />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
               

            <div className={styles["footer"]}>
                <div className={styles["footer-left-container"]}>
                    {/*<h2>Uttarakhand Culture </h2>*/}
                    <h2>OLD SCHOOL GAME</h2>
                    <p>Unlock Your Mind&apos;s Potential</p>
                </div>

                <div className={styles.footerLinks}>
                    <div>
                        <p>Play Game</p>
                        <Link href={"/game/tic-tac-toe/single-player"}>Tic Tac Toe</Link>
                        <Link href={"/game/sudoku"}>Sudoku</Link> 
                        <Link href={"/contact"}>Contact Page</Link>

                    </div>
                    <div>
                        <h4>Contribution</h4>
                        <Link href={"https://github.com/ajaynegi45/Old-School-Game/issues"} target="_blank">Issues</Link>
                        <Link href={"https://github.com/ajaynegi45/Old-School-Game/blob/main/README.md"}>About us</Link>
                        <Link href={"/contributors"}>Contributors</Link>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                <p>©2024 Old School Game. All rights reserved.</p>
            </div>
        </footer>
    );
}
