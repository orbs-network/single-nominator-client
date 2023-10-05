import { ReactElement } from "react";
import { BsCheckLg } from "react-icons/bs";

import styled from "styled-components";
import { Container, Typography } from "styles";

interface ISteps {
  title: string;
  component: ReactElement;
}

interface Props {
  currentStep: number;
  steps: ISteps[];
  header?: React.ReactNode;
}

export function Stepper({ steps, currentStep, header }: Props) {
  const Component = steps[currentStep].component;

  return (
    <StyledContainer>
      <Menu>
        {header}
        <Steps>
          <Line />
          {steps.map((step, index) => {
            if (!step.title) return null;
            const finished = currentStep > index
            const isCurrent = currentStep === index;
            return (
              <Step key={index}>
                <Indicator $done={finished}>
                  {finished && <BsCheckLg style={{ color: "white" }} />}
                  {isCurrent && <Dot />}
                </Indicator>
                <Typography>{step.title}</Typography>
              </Step>
            );
          })}
        </Steps>
      </Menu>

      <StepComponent>{Component}</StepComponent>
    </StyledContainer>
  );
}


const Menu = styled(Container)`
  width: 250px;
  padding: 20px 10px 20px 20px;
`;

const StepComponent = styled.div`
  flex: 1;
`;

const Line = styled.figure`
  width: 1px;
  height: calc(100% - 20px);
  left: 17px;
  top: 0px;
  position: absolute;
  margin: 0;
  background: ${({ theme }) => theme.colors.blue};
`;

const Dot = styled.div`
  width: 20%;
  height: 20%;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
   background: ${({ theme }) => theme.colors.blue};
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: flex-start;
  position: relative;
`;

const Indicator = styled.div<{ $done: boolean }>`
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.blue};
  background: ${({ $done, theme }) => ($done ? theme.colors.blue : theme.colors.container)};
  display: flex;

  align-items: center;
  justify-content: center;
`;

const Step = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  position: relative;
  width: auto;
  flex: 1;
  align-items: center;
 
   & p {
    font-size: 14px;
    line-height: 20px;
    flex:1;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
`;
