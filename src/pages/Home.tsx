import * as React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import BackgroundImage from "../assets/lines.png";
import { HoverAccordionMenu } from "../components/accordion";
import { Button } from "../components/button";
import { ExternalLinks } from "../Shared/Constants";

const Image = styled.img`
  position: absolute;
  margin-bottom: 10px;
  width: 100vw;
`;

const MenuContainer = styled.div`
  position: absolute;
  width: 400px;
  height: 200px;
  right: 20%;
  top: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
  align-items: center;
  z-index: 1;
`;

const Home: React.FC = () => {
  // State to track which menu is hovered
  const [hoveredMenu, setHoveredMenu] = React.useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate to the prerequisites page
  const navigateToReqs = () => window.open(ExternalLinks.Requirements);

  // Button configurations for the "Check" menu
  const CheckButtons = [
    {
      label: "Requirements",
      onClick: () => navigateToReqs(),
      width: 300,
    },
    {
      label: "Generation speed",
      onClick: () => console.log("Button 1 clicked"),
      width: 300,
    },
    {
      label: "Proving Capacity",
      onClick: () => console.log("Button 2 clicked"),
      width: 300,
    },
  ];

  return (
    <>
      <MenuContainer>
        <Button
          onClick={() => navigate("/generate")}
          width={250}
          label="Generate"
        />
        <HoverAccordionMenu
          $isHovered={hoveredMenu === "check"}
          onMouseEnter={() => setHoveredMenu("check")}
          onMouseLeave={() => setHoveredMenu(null)}
          title="check"
          buttons={CheckButtons}
        />
      </MenuContainer>
      <Image src={BackgroundImage} />
    </>
  );
};

export default Home;
