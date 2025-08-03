"use client";
import { useEffect, useState } from "react";
import ContributorCard from "@/components/ContributorCard";
import styles from "./page.module.css";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/openml-stack/SentiLog-AI/contributors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setContributors(data);
        } else {
          console.error("Unexpected API response:", data);
          setContributors([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contributors:", err);
        setContributors([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.message}>Loading contributors...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Project Contributors</h1>
      <p className={styles.description}>
        Thanks to everyone who has contributed to making this project better!
      </p>

      {contributors.length === 0 ? (
        <p className={styles.message}>No contributors found or API limit reached.</p>
      ) : (
        <div className={styles.grid}>
          {contributors.map((c) => (
            <ContributorCard key={c.id} contributor={c} />
          ))}
        </div>
      )}

      <hr className={styles.section} />
      <h2>Want to Contribute?</h2>
      <p>
        Check out our{" "}
        <a
          href="https://github.com/ajaynegi45/Old-School-Game/blob/main/contributing.md"
          className={styles.link}
        >
          Contributing Guidelines
        </a>
      </p>
    </div>
  );
}
