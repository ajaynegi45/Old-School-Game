import styles from "./contributorCard.module.css";

interface Props {
  contributor: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export default function ContributorCard({ contributor }: Props) {
  return (
    <div className={styles.card}>
      <img src={contributor.avatar_url} alt={contributor.login} className={styles.avatar} />
      <h3 className={styles.name}>{contributor.login}</h3>
     
      <a href={contributor.html_url} className={styles.link} target="_blank" rel="noopener noreferrer">
        View Profile
      </a>
    </div>
  );
}


