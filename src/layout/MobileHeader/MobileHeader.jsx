import styles from "./MobileHeader.module.scss";

export const MobileHeader = () => (
  <header className={styles.header}>
    <img className={styles.logo} src="/favicon.svg" alt="" aria-hidden="true" />
    <span className={styles.brand}>TrailPilot</span>
  </header>
);

export default MobileHeader;
