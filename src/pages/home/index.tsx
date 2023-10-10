import React from 'react'
import { useNavigate } from "react-router-dom";
import { ColumnFlex, HoverContainer, MOBILE_MEDIA_QUERY, Typography } from "styles";
import styled from "styled-components";
import { Routes } from "config";
import { Button, Page } from 'components';

import TransferImg from 'assets/images/transfer.svg'
import WithdrawImg from 'assets/images/withdraw.svg'
import ChangeValidatorImg from 'assets/images/change-validator.svg'
import DeploySingleNominatorImg from 'assets/images/deploy-single-nominator.svg'

const navigation = [
  {
    title: "Change Validator",
    path: Routes.changeValidator,
    description:
      "Sed maximus mollis est, in imperdiet lectus accumsan ut. Mauris sit amet.",
    image: ChangeValidatorImg,
    button: "Change",
  },
  {
    title: "Withdraw",
    path: Routes.withdraw,
    description:
      "Sed maximus mollis est, in imperdiet lectus accumsan ut. Mauris sit amet.",
    image: WithdrawImg,
    button: "Withdraw",
  },

  {
    title: "Deploy Single Nominator",
    path: Routes.deploySingleNominator,
    description:
      "Sed maximus mollis est, in imperdiet lectus accumsan ut. Mauris sit amet.",
    image: DeploySingleNominatorImg,
    button: 'Deploy'
  },

  {
    title: "Transfer",
    path: Routes.transfer,
    description:
      "Sed maximus mollis est, in imperdiet lectus accumsan ut. Mauris sit amet.",
    image: TransferImg,
    button: "Transfer",
  },
];

function Navigation() {
  const navigate = useNavigate();
  return (
    <StyledContainer>
      {navigation.map((navigation) => {
        return (
          <StyledNavigation key={navigation.path}>
            <ColumnFlex $gap={20}> 
              <Logo src={navigation.image} />
              <Title>{navigation.title}</Title>
              <Description>{navigation.description}</Description>
              <StyledButton onClick={() => navigate(navigation.path)}>
                {navigation.button}
              </StyledButton>
            </ColumnFlex>
          </StyledNavigation>
        );
      })}
    </StyledContainer>
  );
}



const StyledButton = styled(Button)`
  max-width: 180px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`

const Title = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.dark ? 'white': 'black'};
`

const Description = styled(Typography)`
font-size: 16px;
opacity: 0.6;
font-weight: 300;
line-height: 22px;
`

const Logo = styled.img`
  width:50px;
  height:50px;
  object-fit: contain;
`

const StyledNavigation = styled(HoverContainer)`
  cursor: pointer;
  width: calc(50% - 10px);
  min-height: 160px;

  ${MOBILE_MEDIA_QUERY} {
    width: 100%;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;



 function HomePage() {
  return (
    <Page>
      <Navigation />
    </Page>
  );
}



export default HomePage