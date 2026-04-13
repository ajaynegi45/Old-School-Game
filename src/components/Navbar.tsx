import React from 'react';
import Link from "next/link";
import styles from "@/components/navbar.module.css";

const Navbar = () => {
    return (
        <>
            <div className={styles["navbar-container"]}>
                <nav className={styles["navbar"]}>
                    <Link href="/" className={styles["heading"]}>
                        <h2 className={styles["title"]}>OLD SCHOOL GAME</h2>
                    </Link>
                    <Link href="https://github.com/ajaynegi45/Old-School-Game" className={styles.link}>Github</Link>
                </nav>
            </div>
            <div className={styles["fade-navbar-effect"]}></div>
            <div className={styles["empty-navbar"]}></div>
        </>
    );
};

export default Navbar;