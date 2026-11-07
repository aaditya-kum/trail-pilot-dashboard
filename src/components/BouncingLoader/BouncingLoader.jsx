import styles from "./BouncingLoader.module.scss";

const BouncingLoader = ({
  minHeight = "500px",
  size = "medium",
  color = "#2c4dd7",
}) => {
  const dotSize = size === "small" ? "10px" : "12px";

  return (
    <div className={styles.loaderContainer} style={{ minHeight }}>
      <div className={styles.bouncingLoader}>
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className={styles.dot}
            style={{
              backgroundColor: color,
              width: dotSize,
              height: dotSize,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BouncingLoader;
