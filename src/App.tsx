import styled from "styled-components";
import Colors from "./styles/colors";
import AppRoutes from "./shared/Routes";
import { ExternalLinks } from "./shared/Constants";
import { open } from "@tauri-apps/api/shell";

const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: ${Colors.background};
`;

const FooterDivider = styled.div`
  background: linear-gradient(
    90deg,
    ${Colors.purpleDark} 0%,
    ${Colors.purpleLight} 50%,
    ${Colors.purpleDark} 100%
  );
  top: 690px;
  height: 2px;
  width: 1100px;
  margin: 0px 50px;
  position: absolute;
`;

const CustomTitle = styled.h1`
  width: 1200px;
  height: 21px;
  top: 30px;
  position: absolute;
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  text-align: center;
  text-transform: uppercase;
  font-size: 22px;
  font-weight: 100;
  letter-spacing: 5px;
`;

const Footer = styled.div`
  position: fixed;
  width: 1100px;
  height: 30px;
  top: 690px;
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
`;

function App() {
  const navigateToIssue = () => open(ExternalLinks.Report);

  return (
    <AppWrapper>
      <AppRoutes />
      <CustomTitle>PROOF OF SPACE-TIME MANAGER</CustomTitle>
      <FooterDivider />
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
}

export default App;
