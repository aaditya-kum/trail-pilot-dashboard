import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import styles from "./AppLayout.module.scss";

export const AppLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const handleViewportChange = (event) => setIsMobile(event.matches);

    mobileQuery.addEventListener("change", handleViewportChange);
    return () =>
      mobileQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const contentClasses = `${styles.content} ${sidebarCollapsed ? styles.sidebarCollapsed : ""}`;
  const contentWrapperClasses = `${styles.contentWrapper} ${isMobile ? styles.mobileContent : ""}`;

  return (
    <div className={styles.layout}>
      {!isMobile && <Sidebar onCollapsedChange={setSidebarCollapsed} />}
      <main className={contentClasses}>
        <div className={contentWrapperClasses}>{children || <Outlet />}</div>
      </main>
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
