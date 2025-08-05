import styles from "./footer.module.css"
import Link from "next/link";

export default function Footer() {


    return (
        <footer className={styles["footer-container"]}>

            <div className={styles["newsletter-container"]}>
                <div className={styles["newsletter-left-container"]}>
                    <h3>Join to Receive Updates</h3>
                    <p>Get updates on new game additions straight to your inbox.</p>
                </div>
                <div className={styles["newsletter-right-container"]}>

                    <div className={styles["newsletter-email-container"]}>
                        <form action="" >
                            <input id={"email-input"} type="email" placeholder="Enter Your email" required={true} disabled={true}/>
                            <p>Subscribe</p>
                        </form>
                    </div>
                    <div><p>Your privacy is important. I never share your email.</p></div>

                </div>
            </div>

            <div className={styles["footer"]}>
                <div className={styles["footer-left-container"]}>
                    {/*<h2>Uttarakhand Culture </h2>*/}
                    <h2>OLD SCHOOL GAME</h2>
                    <p>Unlock Your Mind&apos;s Potential</p>
                </div>

                <div className={styles["footer-right-container"]}>
                    <div className={styles["footer-right-link-container"]} >
                        <p>Play Game</p>
                        <Link href={"https://oldschoolgame.vercel.app/game/tic-tac-toe/single-player"}>Tic Tac Toe</Link>
                        <Link href={"/game/sudoku"}>Sudoku</Link> 
                        {/* The link above in local instead it should be relative  */}
                        <Link href={"https://ajaynegi.web.app/contact/"}>Contact us</Link>
                    </div>
                    <div className={styles["footer-right-link-container"]} >
                        <p>Contribution</p>
                        <Link href={"https://github.com/ajaynegi45/Old-School-Game/issues"}>Issues</Link>
                        <Link href={"https://github.com/ajaynegi45/Old-School-Game/blob/main/README.md"}>About us</Link>
                        <Link href={"https://github.com/ajaynegi45/Old-School-Game"}>Contribution</Link>
                        <Link href="/contributors" className={styles.contributor}>Contributors</Link>
                    </div>
                </div>
            </div>

            <div className={styles["copyright-container"]}>
                <p> <span className={styles.copyright}>© </span>2024 Old School Game. All rights reserved.</p>
            </div>
        </footer>
    );
}
