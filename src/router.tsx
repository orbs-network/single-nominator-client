/* eslint-disable react-refresh/only-export-components */
import App from "App";
import { Routes } from "config";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";


const ChangeValidatorPage = lazy(() => import("pages/change-validator").then((module) => module));
const DeploySingleNominatorPage = lazy(() => import("pages/deploy-single-nominator").then((module) => module));
const WithdrawPage = lazy(() => import("pages/withdraw").then((module) => module));
const HomePage = lazy(() => import("pages/home").then((module) => module));
const TransferPage = lazy(() =>
  import("pages/transfer").then((module) => module)
);
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
        element: <TransferPage />,
      },
      {
        path: Routes.withdraw,
        element: <WithdrawPage />,
      },
      {
        path: Routes.changeValidator,
        element: <ChangeValidatorPage />,
      },
      {
        path: Routes.deploySingleNominator,
        element: <DeploySingleNominatorPage />,
      }
    ],
  },
]);
