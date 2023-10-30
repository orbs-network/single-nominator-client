import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ColumnFlex,
  HoverContainer,
  MOBILE_MEDIA_QUERY,
  RowFlex,
  Typography,
} from "styles";
import styled from "styled-components";
import { Routes } from "config";
import { Button, Page } from "components";

import TransferImg from "assets/images/transfer.svg";
import WithdrawImg from "assets/images/withdraw.svg";
import ChangeValidatorImg from "assets/images/change-validator.svg";
import DeploySingleNominatorImg from "assets/images/deploy-single-nominator.svg";

import TransferDarkImg from "assets/images/transfer-dark.svg";
import WithdrawDarkImg from "assets/images/withdraw-dark.svg";
import ChangeValidatorDarkImg from "assets/images/change-validator-dark.svg";
import DeploySingleNominatorDarkImg from "assets/images/deploy-single-nominator-dark.svg";
import { useThemeContext } from "theme";

interface Route {
  title: string;
  path: string;
  description: string;
  image: string;
  button: string;
}

interface Section {
  title: string;
  routes: Route[];
}

const useSections = () => {
  const { darkMode } = useThemeContext();
  return useMemo(() => {
    return [
      {
        title: "Setup",
        routes: [
          {
            title: "Deploy Single Nominator",
            path: Routes.deploySingleNominator,
            description:
              "Used for the initial setup of a new validator node. Deploys the official single-nominator smart contract to TON masterchain.",
            image: darkMode
              ? DeploySingleNominatorDarkImg
              : DeploySingleNominatorImg,
            button: "Deploy",
          },
          {
            title: "Change Validator",
            path: Routes.changeValidator,
            description:
              "If the private key stored on the validator node is compromised or replaced, or if the validator node is changed, update the contract to a new validator address.",
            image: darkMode ? ChangeValidatorDarkImg : ChangeValidatorImg,
            button: "Change",
          },
        ],
      },
      {
        title: "Operation",
        routes: [
          {
            title: "Deposit",
            path: Routes.deposit,
            description:
              "Deposit new TON coins from your wallet to fund the single-nominator contract. This TON coin will be used for staking in the elector.",
            image: darkMode ? TransferDarkImg : TransferImg,
            button: "Deposit",
          },
          {
            title: "Withdraw",
            path: Routes.withdraw,
            description:
              "After TON coin was unstaked by the validator node and returned to the single-nominator contract, withdraw it back to your wallet.",
            image: darkMode ? WithdrawDarkImg : WithdrawImg,
            button: "Withdraw",
          },
        ],
      },
    ];
  }, [darkMode]);
};

function Navigation() {
  const sections = useSections();
  return (
    <StyledContainer>
      {sections.map((section) => {
        return <SectionComponent key={section.title} section={section} />;
      })}
    </StyledContainer>
  );
}

const SectionComponent = ({ section }: { section: Section }) => {
  return (
    <ColumnFlex $gap={20}>
      <SectionTitle>{section.title}</SectionTitle>
      <SectionRoutes>
        {section.routes.map((route) => {
          return <RouteComponent key={route.path} route={route} />;
        })}
      </SectionRoutes>
    </ColumnFlex>
  );
};

const SectionRoutes = styled(RowFlex)`
  flex-wrap: wrap;
  gap: 20px;
  align-items: stretch;
`;

const RouteComponent = ({ route }: { route: Route }) => {
  const navigate = useNavigate();
  return (
    <StyledNavigation key={route.path}>
      <ColumnFlex $gap={20} style={{height:'100%'}}>
        <RouteLogo src={route.image} />
        <RouteTitle>{route.title}</RouteTitle>
        <RouteDescription>{route.description}</RouteDescription>
        <StyledButton onClick={() => navigate(route.path)}>
          {route.button}
        </StyledButton>
      </ColumnFlex>
    </StyledNavigation>
  );
};

const StyledButton = styled(Button)`
  max-width: 180px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
`;

const RouteTitle = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => (theme.dark ? "white" : "black")};
`;

const SectionTitle = styled(Typography)`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => (theme.dark ? "white" : "black")};
  ${MOBILE_MEDIA_QUERY} {
    font-size: 18px;
  }
`;

const RouteDescription = styled(Typography)`
  font-size: 16px;
  opacity: 0.6;
  font-weight: 300;
  line-height: 22px;
`;

const RouteLogo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

const StyledNavigation = styled(HoverContainer)`
  cursor: pointer;
  width: calc(50% - 10px);
  min-height: 160px;
  height: auto;

  ${MOBILE_MEDIA_QUERY} {
    width: 100%;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;

function HomePage() {
  return (
    <Page>
      <Navigation />
    </Page>
  );
}

export default HomePage;
