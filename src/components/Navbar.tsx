import React, { lazy, Suspense } from "react";
import styled from "styled-components";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Layout, RowFlex } from "styles";
import { useNavigate } from "react-router-dom";
import { Routes } from "config";
import { useThemeContext } from "theme";

const BsFillSunFill = lazy(() =>
  import("react-icons/bs").then((module) => ({ default: module.BsFillSunFill }))
);
const BsFillMoonFill = lazy(() =>
  import("react-icons/bs").then((module) => ({
    default: module.BsFillMoonFill,
  }))
);

const ThemeToggle = () => {
  const { toggleTheme, darkMode } = useThemeContext();
  return (
    <Toggle onClick={toggleTheme}>
      <Suspense>{darkMode ? <BsFillSunFill /> : <BsFillMoonFill />}</Suspense>
    </Toggle>
  );
};

const Toggle = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  svg {
    fill: ${({ theme }) => theme.text.color};
    width: 20px;
    height: 20px;
  }
`;

export function Navbar() {
  const navigate = useNavigate();
  return (
    <Nav>
      <NavContent>
        <p onClick={() => navigate(Routes.root)}>Logo</p>
        <RowFlex>
          <TonConnectButton />
          <ThemeToggle />
        </RowFlex>
      </NavContent>
    </Nav>
  );
}

const NavContent = styled(Layout)`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
`;

const Nav = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => (theme.dark ? "transparent" : "white")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
