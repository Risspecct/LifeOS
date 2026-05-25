import { useState, useEffect } from "react";

export const useSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem("lifeos_sidebar_collapsed") === "true");

  useEffect(() => {
    const handleEvent = (e) => setIsCollapsed(e.detail);
    window.addEventListener("sidebarStateChange", handleEvent);
    return () => window.removeEventListener("sidebarStateChange", handleEvent);
  }, []);

  return isCollapsed;
};
