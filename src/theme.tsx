/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { THEME, useTonConnectUI } from "@tonconnect/ui-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const blue = "#0098E9";


const lightTheme: DefaultTheme = {
  dark: false,
  colors: {
    blue,
    body: "#F8F9FB",
    container: "white",
    border: "rgb(224, 224, 224)",
    success: "#00C08B",
  },
  text: {
    color: "rgb(114, 138, 150)",
    title: "black",
  },
};

const darkTheme: DefaultTheme = {
  dark: true,
  colors: {
    blue,
    body: "#222830",
    container: "#222830",
    border: "rgba(255, 255, 255, 0.2)",
    success: "#00C08B",
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    title: "rgba(255, 255, 255, 0.8)",
  },
};

const isDefaultDarkMode = () => {
  console.log(window.matchMedia("(prefers-color-scheme: dark)"));

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return true;
  }
  return false;
};

type SettingsStore = {
  darkMode?: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

const useThemeStore = create(
  persist<SettingsStore>(
    (set) => ({
      darkMode: isDefaultDarkMode(),
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    {
      name: "theme_settings",
    }
  )
);

interface ThemeContext {
  toggleTheme: () => void;
  darkMode?: boolean;
}

const Context = createContext({} as ThemeContext);

const Theme = ({ children }: { children: ReactNode }) => {
  const { darkMode } = useThemeStore();
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);
  const [_, setOptions] = useTonConnectUI();

  useEffect(() => {
    setOptions({
      uiPreferences: {
        theme: darkMode ? THEME.DARK : THEME.LIGHT,
      },
    });
  }, [darkMode, setOptions]);

  const toggleTheme = () => {
    useThemeStore.setState({ darkMode: !darkMode });
  };

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={{ toggleTheme, darkMode}}>
        {children}
      </Context.Provider>
    </ThemeProvider>
  );
};

const useThemeContext = () => {
  return useContext(Context);
};

export { Theme, useThemeContext };
