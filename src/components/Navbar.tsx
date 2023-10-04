import React from 'react'
import styled from 'styled-components'
import { TonConnectButton } from "@tonconnect/ui-react";
import { Layout } from 'styles';
import { useNavigate } from 'react-router-dom';
import { Routes } from 'config';

export function Navbar() {
  const navigate = useNavigate()
  return (
    <Nav>
      <NavContent>
        <p onClick={() => navigate(Routes.root)}>Logo</p>
        <TonConnectButton />
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
    background-color: #fff;
`