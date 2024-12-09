import React from "react";
import styled from "styled-components";
import Colors from "./styles/colors";
import AppRoutes from "./Shared/Routes";
import { ExternalLinks } from "./Shared/Constants";
import { open } from "@tauri-apps/api/shell";
import GlobalStyles from "./styles/globalStyles";
import { ConsoleProvider } from "./state/ConsoleContext";
import ConsoleView from "./components/ConsoleView";
import ConsoleTest from "./components/ConsoleTest";

const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: ${Colors.greenDark};
`;

const ConsoleWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50px;
  right: 50px;
  z-index: 1000;
  background-color: ${Colors.black}80;
  padding: 10px;
  border-radius: 8px;
  pointer-events: auto;
`;

const TestWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const Footer = styled.div`
  position: fixed;
  width: 1100px;
  height: 30px;
  bottom: 10px;
  left: 50px;
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-content: center;
  align-items: center;
  font-family: "Source Code Pro Extralight", sans-serif;
  color: ${Colors.grayLight};
  font-size: 12px;
  font-weight: 100;
  letter-spacing: 1px;
  z-index: 1001;
`;

// Wrapper component to use hooks
const AppContent: React.FC = () => {
  const navigateToIssue = () => open(ExternalLinks.Report);

  return (
    <AppWrapper>
      <GlobalStyles />
      <TestWrapper>
        <ConsoleTest />
      </TestWrapper>
      <AppRoutes />
      <ConsoleWrapper>
        <ConsoleView />
      </ConsoleWrapper>
      <Footer>
        <a
          onClick={navigateToIssue}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
        >
          report an issue
        </a>
      </Footer>
    </AppWrapper>
  );
};

function App() {
  return (
    <ConsoleProvider>
      <AppContent />
    </ConsoleProvider>
  );
}

export default App;
