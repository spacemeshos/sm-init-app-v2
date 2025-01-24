/**
 * @fileoverview Error modal component for displaying application errors
 * Provides a consistent error display interface with troubleshooting guidance.
 * Currently using placeholder content - to be updated with actual error handling.
 */

import React from "react";
import styled from "styled-components";

import Colors from "../styles/colors";
import { BodyText, Header, Subheader } from "../styles/texts";

import { CloseButton } from "./button";

/**
 * Full-screen backdrop for error modal
 * Centers error content and handles click-outside
 */
const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

/**
 * Error modal container
 * Fixed positioning with consistent size and styling
 */
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

/**
 * Props for ErrorModal component
 */
type Props = {
  /** Callback when modal should close */
  onClose: () => void;
  /** Whether error modal is visible */
  isOpen: boolean;
  /** Optional additional content */
  children?: React.ReactNode;
};

/**
 * Error Modal Component
 * 
 * Features:
 * - Consistent error presentation
 * - Troubleshooting guidance
 * - Close button
 * - Click-outside handling
 * 
 * TODO:
 * - Replace placeholder content with actual error details
 * - Add error code handling
 * - Implement specific troubleshooting steps based on error type
 * - Add error reporting functionality
 * 
 * @param {Props} props - Component properties
 */
const ErrorModal = ({ onClose, isOpen }: Props) => {
  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <CloseButton onClick={onClose} top={2} left={97} />

        {/* Error header */}
        <Header>Oops!</Header>
        <Subheader>Something Went Wrong</Subheader>

        {/* Error details - currently placeholder */}
        <BodyText>Error Code: [Error_Code_Placeholder]</BodyText>

        {/* Troubleshooting guidance */}
        <BodyText>
          {
            <>
              {/* Configuration check */}
              [just a placeholder] Check Your Configuration: Ensure all required
              fields are filled out correctly. Verify the paths to your storage
              directories are accessible and have sufficient space.
              <br />
              {/* System requirements */}
              Review System Requirements: Confirm your system meets the minimum
              hardware and software requirements for Spacemesh.
              <br />
              {/* Application restart */}
              Restart the Application: Close and reopen the application to reset
              any temporary issues.
              <br />
              {/* Documentation reference */}
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
