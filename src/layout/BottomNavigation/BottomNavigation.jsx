import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_NAV_ITEMS } from "../Sidebar/constants";
import styles from "./BottomNavigation.module.scss";

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className={styles.bottomNavigation} aria-label="Primary navigation">
      {SIDEBAR_NAV_ITEMS.map((item) => {
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");
        const Icon = item.icon;

        return (
          <Link
            key={item.id}
            to={item.path}
            className={`${styles.item} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className={styles.icon} aria-hidden="true">
              {Icon ? <Icon /> : null}
            </span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
