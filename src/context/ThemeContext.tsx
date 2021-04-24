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
  }, []);

  function toggleDarkMode() {
    localStorage.setItem('theme', JSON.stringify(!isDarkMode));
    setIsDarkMode(!isDarkMode);
  }
  return (
    <ThemeCtx.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
      }}>
      <div className={`${isDarkMode ? 'nightly' : ''}`}>{children}</div>
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeCtx);
};
