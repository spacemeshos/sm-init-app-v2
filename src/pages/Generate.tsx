import * as React from "react";
import styled from "styled-components";
import BackgroundImage from "../assets/lines.png";
import { useState } from "react";
import Colors from "../styles/colors";
import { Subheader, Title } from "../styles/texts";


const Image = styled.img`
  height: 100vh;
  z-index: -1;
`; //image to be updated with smth high-res

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
`;

const SetupContainer = styled.div`
  width: 960px;
  height: 480px;
  position: absolute;
  bottom: 100px;
  border: 0.5px solid rgba(255, 255, 255, 0.05);
  background-color: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
`;

type ContainerProps = {
  children?: React.ReactNode;
};

const MenuContainer = styled.div`
  position: absolute;
  width: 250px;
  height: 480px;
  right: 0px;
  border: 0.5px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.02);
`;

const ButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  justify-content: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 10px;
  left: 0px;
  width: 80%;
  height: 60px
`;


const StyledButton = styled.button`
  width: 200px;
  height: 60px;
  font-size: 16px;
  color: ${Colors.grayLight};
  cursor: pointer;
  border: 0.5px solid rgba(255, 255, 255, 0.05);
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: background-color 0.2s ease;
  font-family: "Source Code Pro Extralight", sans-serif;
  color: ${Colors.white};
  font-size: 14px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 20px;
  &:hover {
    background-color: rgba(255, 255, 255, 0);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const SelectDirectory: React.FC = () => <div>Select Directory Component</div>;
const SetupGPU: React.FC = () => <div>Setup GPU Component</div>;
const SetupProving: React.FC = () => <div>Setup Proving Component</div>;
const SetupSize: React.FC = () => <div>Setup Size Component</div>;
const SelectIdentity: React.FC = () => <div>Select Identity Component</div>;

const Generate: React.FC<ContainerProps> = () => {
  const [selectedComponent, setSelectedComponent] =
    useState<React.ReactNode>(null);

  // Button configuration
  const buttons = [
    {
      label: "Pick Directory",
      onClick: () => setSelectedComponent(<SelectDirectory />),
    },
    {
      label: "Select Processor",
      onClick: () => setSelectedComponent(<SetupGPU />),
    },
    {
      label: "Set up Proving",
      onClick: () => setSelectedComponent(<SetupProving />),
    },
    {
      label: "Set up POS Size",
      onClick: () => setSelectedComponent(<SetupSize />),
    },
    {
      label: "Select Identity",
      onClick: () => setSelectedComponent(<SelectIdentity />),
    },
  ];

  return (
    <>
      <Image src={BackgroundImage} />
      <BottomContainer>
        <SetupContainer>
          <MenuContainer>
            {/* Button Column */}
            <ButtonColumn>
              {buttons.map((button, index) => (
                <StyledButton key={index} onClick={button.onClick}>
                  {button.label}
                </StyledButton>
              ))}
            </ButtonColumn>
          </MenuContainer>
          {/* Rendered Component */}
          <TextWrapper>
            {" "}
            <Title text="Summary of your Settings" />
            <Subheader text={"Check twice, adjust if needed, and blast off!"} />
          </TextWrapper>

          <div style={{ marginTop: "20px", width: "100%" }}>
            {selectedComponent || <div>Please select an option above</div>}
          </div>
        </SetupContainer>
      </BottomContainer>
    </>
  );
};

export default Generate;
