import React from 'react';
import Link from "next/link";
import PWAInstall from './PWAInstall';
import styles from "@/components/navbar.module.css";

const Navbar = () => {
    return (
        <>
            <div className={styles["navbar-container"]}>
                <nav className={styles["navbar"]}>
                    <Link href="/" className={styles["heading"]}>
                        <h3 className={styles["title"]}>OLD SCHOOL GAME</h3>
                    </Link>
                    <div className={styles["nav-actions"]}>
                        <PWAInstall className={styles["pwa-install"]} />
                        <Link href="https://github.com/ajaynegi45/Old-School-Game" className={styles.link}>Github</Link>
                    </div>
                </nav>
            </div>
            <div className={styles["fade-navbar-effect"]}></div>
            <div className={styles["empty-navbar"]}></div>
        </>
    );
};

export default Navbar;