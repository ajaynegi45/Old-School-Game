import React from 'react';
import Link from "next/link";
import styles from "@/components/navbar.module.css";

const Navbar = () => {
    return (
        <>
            <div className={styles.navbarContainer}>
                <nav className={styles.navbar}>
                    <Link href="/" className={styles.logo}>
                        OLD SCHOOL GAME
                    </Link>
                    <Link href="https://github.com/ajaynegi45/Old-School-Game" target="_blank" className={styles.githubButton}>Github</Link>
                </nav>
            </div>
        </>
    );
};

export default Navbar;