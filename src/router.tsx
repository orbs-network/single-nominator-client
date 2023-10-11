/* eslint-disable react-refresh/only-export-components */
import App from "App";
import { Skeleton } from "components";
import { Routes } from "config";
import HomePage from "pages/home";
import { lazy, Suspense, useEffect, useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import { styled } from "styled-components";
import { ColumnFlex } from "styles";

const ChangeValidatorPage = lazy(() =>
  import("pages/change-validator").then((module) => module)
);
const DeploySingleNominatorPage = lazy(() =>
  import("pages/deploy-single-nominator").then((module) => module)
);
const WithdrawPage = lazy(() =>
  import("pages/withdraw").then((module) => module)
);

const TransferPage = lazy(() =>
  import("pages/transfer").then((module) => module)
);

const PageSuspense = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
};

const PageLoader = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 300);
  }, []);

  if (!show) return null;
  return (
    <ColumnFlex>
      <StyledTitleSkeleton />
      <StyledContentSkeleton />
    </ColumnFlex>
  );
};

const StyledTitleSkeleton = styled(Skeleton)`
  width: 100%;
  max-width: 300px;
  height: 30px;
  margin-bottom: 10px;
`;

const StyledContentSkeleton = styled(Skeleton)`
  width: 100%;
  height: 200px;
`;

export const router = createBrowserRouter([
  {
    path: Routes.root,
    element: <App />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: Routes.transfer,
        element: (
          <PageSuspense>
            <TransferPage />
          </PageSuspense>
        ),
      },
      {
        path: Routes.withdraw,
        element: (
          <PageSuspense>
            <WithdrawPage />
          </PageSuspense>
        ),
      },
      {
        path: Routes.changeValidator,
        element: (
          <PageSuspense>
            <ChangeValidatorPage />
          </PageSuspense>
        ),
      },
      {
        path: Routes.deploySingleNominator,
        element: (
          <PageSuspense>
            <DeploySingleNominatorPage />
          </PageSuspense>
        ),
      },
    ],
  },
]);
