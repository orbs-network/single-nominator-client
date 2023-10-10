import { Navbar} from "components";
import { Layout } from "styles";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

function App() {
  return (
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
  );
}

export default App;


// const RouteLoader = () => {
//   return <StyledSkeleton />;
// }

// const StyledSkeleton = styled(Skeleton)`
//   width: 100%;
//   height: 300px;
// `

const StyledApp = styled(Layout)`
  padding-top: 100px;
  padding-bottom: 70px;
`;
