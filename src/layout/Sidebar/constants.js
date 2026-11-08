import {
  FiBarChart2,
  FiGrid,
  FiPackage,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";

export const SIDEBAR_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/", icon: FiGrid },
  {
    id: "leads",
    label: "Leads",
    path: "/leads",
    icon: FiBarChart2,
  },
  { id: "packages", label: "Packages", path: "/packages", icon: FiPackage },
  { id: "team", label: "Team", path: "/team", icon: FiUsers },
];

export const SIDEBAR_FOOTER_ITEMS = [
  { id: "settings", label: "Settings", path: "/settings", icon: FiSettings },
  { id: "profile", label: "Profile", path: "/profile", icon: FiUser },
];

// EXACT Figma dimensions
export const SIDEBAR_WIDTH = {
  EXPANDED: 286, // EXACT Figma measurement
  COLLAPSED: 68, // EXACT Figma measurement
};
