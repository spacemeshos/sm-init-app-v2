import React from "react";
import styled from "styled-components";

import errorIcon from "../assets/disruption.png";
import Colors from "../styles/colors";
import { BodyText, Header, Subheader } from "../styles/texts";

import { CloseButton } from "./button";

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
  background-color: ${Colors.greenDark};
  z-index: 1000;
  width: 800px;
  height: 500px;
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
        <CloseButton onClick={onClose} top={2} left={97} />
        <Header>Oops!</Header>
        <Subheader>Something Went Wrong</Subheader>
        <BodyText>Error Code: [Error_Code_Placeholder]</BodyText>
        <BgImage src={errorIcon} />
        <BodyText>
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
        </BodyText>
      </Wrapper>
    </Backdrop>
  );
};

export default ErrorModal;
