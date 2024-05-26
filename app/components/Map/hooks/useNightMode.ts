import React from 'react';

export default function useNightMode() {
  const [isNightMode, setIsNightMode] = React.useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const darkModePref = window.matchMedia('(prefers-color-scheme: dark)');
    return darkModePref.matches;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const darkModePref = window.matchMedia('(prefers-color-scheme: dark)');

    function listener() {
      setIsNightMode(darkModePref.matches);
    }

    darkModePref.addEventListener('change', listener);

    return () => {
      darkModePref.removeEventListener('change', listener);
    };
  }, []);

  return isNightMode;
}
