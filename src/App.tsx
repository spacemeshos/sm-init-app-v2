import styled from "styled-components";
import Colors from "./styles/colors";
import AppRoutes from "./Shared/Routes";

const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  align-content: center;
  justify-content: space-evenly;
  display: flex;
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
  position: relative;
`;

function App() {
  return (
    <AppWrapper>
      <AppRoutes />
      <FooterDivider />
    </AppWrapper>
  );
}

export default App;
