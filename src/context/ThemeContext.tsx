import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type ThemeCtxData = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeCtx = createContext({} as ThemeCtxData);

type ThemeContextProviderProps = {
  children: ReactNode;
};

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const locally = JSON.parse(localStorage.getItem('theme'));
    if (locally) {
      setIsDarkMode(locally);
    }
    if (typeof window !== 'undefined') {
      if (locally) {
        document.body.classList.add('nightly');
      }
    }
  }, []);

  function toggleDarkMode() {
    localStorage.setItem('theme', JSON.stringify(!isDarkMode));
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('nightly');
    } else {
      document.body.classList.remove('nightly');
    }
  }
  return (
    <ThemeCtx.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
      }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeCtx);
};
