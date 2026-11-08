import {
  FiBarChart2,
  FiGrid,
  FiPackage,
  FiSettings,
  FiUser,
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
];

export const SIDEBAR_FOOTER_ITEMS = [
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: FiSettings,
    disabled: true,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    icon: FiUser,
    disabled: true,
  },
];

// EXACT Figma dimensions
export const SIDEBAR_WIDTH = {
  EXPANDED: 286, // EXACT Figma measurement
  COLLAPSED: 68, // EXACT Figma measurement
};
