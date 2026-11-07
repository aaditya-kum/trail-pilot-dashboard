import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import styles from "./AppLayout.module.scss";

export const AppLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const contentClasses = `${styles.content} ${sidebarCollapsed ? styles.sidebarCollapsed : ""}`;

  return (
    <div className={styles.layout}>
      <Sidebar onCollapsedChange={setSidebarCollapsed} />
      <main className={contentClasses}>
        <div className={styles.contentWrapper}>{children || <Outlet />}</div>
      </main>
    </div>
  );
};

export default AppLayout;
