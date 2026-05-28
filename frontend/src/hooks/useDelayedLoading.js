import { useState, useEffect } from "react";

/**
 * Hook to delay the loading state rendering.
 * Prevents UI flicker by only returning true if the loading state persists beyond a threshold.
 * 
 * @param {boolean} loading - The original loading state
 * @param {number} delayMs - Delay before showing loading state in milliseconds
 * @returns {boolean} - The delayed loading state
 */
export const useDelayedLoading = (loading, delayMs = 200) => {
  const [delayedLoading, setDelayedLoading] = useState(false);

  useEffect(() => {
    let timeout;
    
    if (loading) {
      timeout = setTimeout(() => {
        setDelayedLoading(true);
      }, delayMs);
    } else {
      setDelayedLoading(false);
    }

    return () => clearTimeout(timeout);
  }, [loading, delayMs]);

  return delayedLoading;
};
