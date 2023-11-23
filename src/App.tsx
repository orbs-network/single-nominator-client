import { Navbar } from "components";
import { Layout } from "styles";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { ConfigProvider, theme } from "antd";
import { blue, useThemeContext } from "theme";

function App() {
  const { darkMode } = useThemeContext();
  return (
    <ConfigProvider
      
      theme={{
       token: {
        colorPrimary: blue,
       },
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        
      }}
    >
      <StyledApp>
        <Navbar />
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
        <Toaster
          toastOptions={{
            className: "toast",
          }}
        />
      </StyledApp>
    </ConfigProvider>
  );
}

export default App;

const StyledApp = styled(Layout)`
  padding-top: 100px;
  padding-bottom: 0px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
