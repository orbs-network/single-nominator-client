import App from "App";
import { Routes } from "config";
import {
  ChangeValidatorPage,
  DeploySingleNominatorPage,
  HomePage,
  TransferPage,
  WithdrawPage,
} from "pages";
import { createBrowserRouter } from "react-router-dom";


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
