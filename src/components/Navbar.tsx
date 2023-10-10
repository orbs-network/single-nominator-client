import React, { lazy, Suspense } from "react";
import styled from "styled-components";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Layout, MOBILE_MEDIA_QUERY, RowFlex } from "styles";
import { Link } from "react-router-dom";
import { useThemeContext } from "theme";
import LogoImg from "assets/images/logo.svg";

const BsGithub = lazy(() =>
  import("react-icons/bs").then((module) => ({ default: module.BsGithub }))
);




const BiSun = lazy(() =>
  import("react-icons/bi").then((module) => ({ default: module.BiSun }))
);


const BiMoon = lazy(() =>
  import("react-icons/bi").then((module) => ({
    default: module.BiMoon,
  }))
);

const ThemeToggle = () => {
  const { toggleTheme, darkMode } = useThemeContext();
  return (
    <Toggle onClick={toggleTheme}>
      <Suspense>{darkMode ? <BiSun /> : <BiMoon />}</Suspense>
    </Toggle>
  );
};

const Toggle = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  svg {
    transition: transform 0.2s;
    fill: ${({ theme }) => theme.text.color};
    width: 26px;
    height: 26px;
  }
  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
`;

const GithubLink = () => {
  return (
    <Suspense>
      <Github href="/" target="_blank">
        <BsGithub />
        <p>GitHub</p>
      </Github>
    </Suspense>
  );
};

export function Navbar() {
  return (
    <Nav>
      <NavContent>
        <Logo to="/">
          <img src={LogoImg} />
          <p>TON.Validator</p>
        </Logo>
        <RowFlex>
          <TonConnectButton />
          <ThemeToggle />
          <GithubLink />
        </RowFlex>
      </NavContent>
    </Nav>
  );
}

const Github = styled.a`
  text-decoration: none;
  color: ${({ theme }) => (theme.dark ? "white" : "black")};
  display: flex;
  align-items: center;
  gap: 7px;
  & svg {
    width: 24px;
    height: 24px;
  }
  & p {
    font-size: 18px;
    font-weight: 700;
  }
  ${MOBILE_MEDIA_QUERY} {
    p {
      display: none;
    }
  }
`;

const Logo = styled(Link)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  & p {
    font-size: 18px;
    color: ${({ theme }) => (theme.dark ? "white" : "black")};
    font-weight: 700;
  }
  & img {
    width: 100%;
    height: 100%;
  }
  ${MOBILE_MEDIA_QUERY} {
    width: 38px;
    height: 38px;
    p {
      display: none;
    }
  }
`;

const NavContent = styled(Layout)`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  height: 67px;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => (theme.dark ? "transparent" : "white")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
`;
