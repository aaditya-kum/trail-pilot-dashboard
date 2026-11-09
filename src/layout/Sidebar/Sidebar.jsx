import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { SidebarNavItem } from "./SidebarNavItem";
import { SIDEBAR_NAV_ITEMS, SIDEBAR_FOOTER_ITEMS } from "./constants";
import styles from "./Sidebar.module.scss";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";

/**
 * Sidebar - Main navigation sidebar component
 * - Expanded: 286px, shows logo + text + collapse button
 * - Collapsed: 68px, shows logo only (click to expand)
 */
export const Sidebar = ({ onCollapsedChange }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // Optimistic click tracking — provides instant visual feedback while
  // React Router v7's startTransition defers the actual location update
  const [clickedPath, setClickedPath] = useState(null);

  // Clear optimistic state once React Router's location catches up
  useEffect(() => {
    if (clickedPath && location.pathname.startsWith(clickedPath)) {
      setClickedPath(null);
    }
  }, [location.pathname, clickedPath]);

  const isCollapsed = !isOpen;

  useEffect(() => {
    onCollapsedChange?.(isCollapsed);
  }, [isCollapsed, onCollapsedChange]);

  const handleToggleCollapse = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  const handleLogoClick = useCallback(() => {
    if (isCollapsed) setIsOpen(true);
  }, [isCollapsed]);

  const handleNavItemClick = useCallback((path) => {
    if (path) setClickedPath(path);
  }, []);

  const sidebarClasses = [styles.sidebar, isCollapsed && styles.collapsed]
    .filter(Boolean)
    .join(" ");

  const headerClasses = [styles.header, isCollapsed && styles.collapsed]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={sidebarClasses}>
      {/* Header */}
      <header className={headerClasses}>
        {/* Logo Container - Always visible, clickable when collapsed */}
        <div
          className={styles.logoContainer}
          onClick={handleLogoClick}
          role={isCollapsed ? "button" : undefined}
          tabIndex={isCollapsed ? 0 : undefined}
          aria-label={isCollapsed ? "Expand sidebar" : undefined}
        >
          <img
            className={styles.logoIcon}
            src="/favicon.svg"
            alt=""
            aria-hidden="true"
          />
          {!isCollapsed && (
            <div className={styles.logoText}>TrailPilot</div>
          )}
        </div>

        {/* Collapse Button - Only in expanded desktop state */}
        {!isCollapsed && (
          <button
            className={styles.collapseButton}
            onClick={handleToggleCollapse}
            aria-label="Collapse sidebar"
            title="Close sidebar"
          >
            <MdOutlineKeyboardDoubleArrowLeft size={20} />
          </button>
        )}
      </header>

      {/* Content */}
      <div
        className={`${styles.content} ${isCollapsed ? styles.collapsed : ""}`}
      >
        {/* Main Navigation */}
        <nav
          className={`${styles.navSection} ${
            isCollapsed ? styles.collapsed : ""
          }`}
        >
          {SIDEBAR_NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.id}
              label={item.label}
              path={item.path}
              icon={item.icon}
              isCollapsed={isCollapsed}
              disabled={item.disabled}
              badge={item.badge}
              clickedPath={clickedPath}
              onClick={handleNavItemClick}
            />
          ))}
        </nav>

        {/* Footer Navigation */}
        <div
          className={`${styles.footerSection} ${
            isCollapsed ? styles.collapsed : ""
          }`}
        >
          {SIDEBAR_FOOTER_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.id}
              label={item.label}
              path={item.path}
              icon={item.icon}
              isCollapsed={isCollapsed}
              disabled={item.disabled}
              badge={item.badge}
              clickedPath={clickedPath}
              onClick={handleNavItemClick}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
