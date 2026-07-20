import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * lockDark: when true (used for the admin/login area), the site is forced
 * into dark mode no matter what the visitor previously toggled on the
 * public pages. The public toggle state itself is preserved untouched so
 * it's restored the moment they leave the admin area.
 */
export function ThemeProvider({ children, lockDark = false }) {
  const [dark, setDark] = useState(false); // professional white theme is the default look

  useEffect(() => {
    document.body.classList.toggle('light', !dark && !lockDark);
  }, [dark, lockDark]);

  return (
    <ThemeContext.Provider value={{ dark: lockDark ? true : dark, toggleTheme: () => setDark(p => !p) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);