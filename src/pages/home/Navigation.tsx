import React from "react";
import { useNavigate } from "react-router-dom";
import { HoverContainer } from "styles";
import styled from "styled-components";
import { Routes } from "config";

const navigation = [
  {
    title: "Transfer",
    path: Routes.transfer,
    description: "Action 1 description",
    image: "https://picsum.photos/200/300",
  },
  {
    title: "Withdraw",
    path: Routes.withdraw,
    description: "Action 1 description",
    image: "https://picsum.photos/200/300",
  },
  {
    title: "Change Validator",
    path: Routes.changeValidator,
    description: "Action 1 description",
    image: "https://picsum.photos/200/300",
  },
  {
    title: "Deploy Single Nominator",
    path: Routes.deploySingleNominator,
    description: "Action 1 description",
    image: "https://picsum.photos/200/300",
  },
];

function Navigation() {
  const navigate = useNavigate();
  return (
    <StyledContainer >
      {navigation.map((navigation) => {
        return (
          <StyledNavigation key={navigation.path} onClick={() => navigate(navigation.path)}>
            <h1>{navigation.title}</h1>
            <p>{navigation.description}</p>
            {/* <img src={action.image} alt={action.title} /> */}
          </StyledNavigation>
        );
      })}
    </StyledContainer>
  );
}

const StyledNavigation = styled(HoverContainer)`
  cursor: pointer;
  width:calc(50% - 10px);
  min-height: 160px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export default Navigation;
