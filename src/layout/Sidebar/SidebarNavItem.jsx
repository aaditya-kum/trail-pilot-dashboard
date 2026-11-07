import { Link, useLocation } from "react-router-dom";
import styles from "./SidebarNavItem.module.scss";

export const SidebarNavItem = ({
  label,
  path,
  icon,
  isCollapsed,
  onClick,
  disabled = false,
  badge = null,
  clickedPath = null,
}) => {
  const location = useLocation();

  const routerActive =
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(path + "/");

  const isActive = clickedPath ? clickedPath === path : routerActive;

  // Use filled icon variant when active AND collapsed
  const handleClick = (e) => {
    // Prevent navigation if disabled
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(path);
    }
  };

  const itemClasses = [
    styles.navItem,
    isActive && styles.active,
    isCollapsed && styles.collapsed,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  // Build tooltip text for collapsed state
  const getBadgeTooltipSuffix = () => {
    if (!badge) return "";
    switch (badge.variant) {
      case "coming-soon":
        return " - COMING SOON";
      case "locked":
        return " - LOCKED";
      case "beta":
        return " (Early Access)";
      case "new":
        return " (New)";
      case "pro":
        return " (Pro)";
      default:
        return "";
    }
  };

  const tooltipText = isCollapsed ? `${label}${getBadgeTooltipSuffix()}` : "";

  const navItem = (
    <Link
      to={disabled ? "#" : path}
      className={itemClasses}
      onClick={handleClick}
      aria-disabled={disabled}
    >
      <div className={styles.icon}>
        <span aria-hidden="true">{icon}</span>
      </div>

      {/* Only render label and badge if NOT collapsed */}
      {!isCollapsed && (
        <>
          <span className={styles.label}>{label}</span>
          {badge && <span className={styles.badge}>{badge.variant}</span>}
        </>
      )}
    </Link>
  );

  return isCollapsed ? (
    <span title={tooltipText} style={{ width: "100%" }}>
      {navItem}
    </span>
  ) : (
    navItem
  );
};

export default SidebarNavItem;
