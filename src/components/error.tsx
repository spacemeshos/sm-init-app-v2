import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import errorIcon from "../assets/disruption.png";

const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.darkerPurple};
  z-index: 1000;
  width: 800px;
  height: 500px;
`;

const Header = styled.h1`
  color: ${Colors.white};
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 26px;
  margin-top: 60px;
  font-weight: 200;
  text-transform: uppercase;
  letter-spacing: 5px;
`;

const Subheader = styled.h2`
  color: ${Colors.purpleLight};
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 18px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 23px;
  padding: 00px 75px 0px;
`;

const Text = styled.div`
  color: ${Colors.white};
  padding: 15px 75px;
  text-align: justify;
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-size: 16px;
  font-weight: 100;
  line-height: 25px;
  white-space: pre-wrap;
`;

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 210px;
  position: absolute;
  left: 20px;
  top: 5%;
  left: 5%;
  opacity: 0.1;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${Colors.purpleLight};
  cursor: pointer;
  font-size: 28px;
`;

type Props = {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
};

const ErrorModal = ({ onClose, isOpen }: Props) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>Oops!</Header>
        <Subheader>Something Went Wrong</Subheader>
        <Text>Error Code: [Error_Code_Placeholder]</Text>
        <BgImage src={errorIcon} />
        <Text>
          {
            <>
              [just a placeholder] Check Your Configuration: Ensure all required
              fields are filled out correctly. Verify the paths to your storage
              directories are accessible and have sufficient space.
              <br />
              Review System Requirements: Confirm your system meets the minimum
              hardware and software requirements for Spacemesh.
              <br />
              Restart the Application: Close and reopen the application to reset
              any temporary issues.
              <br />
              Consult the Documentation: Refer to the Spacemesh setup guide for
              detailed instructions and troubleshooting tips.
              <br />
            </>
          }
        </Text>
      </Wrapper>
    </Backdrop>
  );
};

export default ErrorModal;
