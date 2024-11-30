import * as React from "react";
import styled from "styled-components";
import { HoverAccordionMenu } from "../components/accordion";
import BackgroundImage from "../assets/lines.png";
import Add from "../assets/plus.png";
import Check from "../assets/check.png";
import { ExternalLinks } from "../Shared/Constants";
import { useNavigate } from "react-router-dom";

const Image = styled.img`
  position: absolute;
  margin-bottom: 10px;
  right: 0px;
  top: 0px;
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

  // Button configurations for the "Create" menu
  const CreateButtons = [
    {
      label: "Guided Setup",
      onClick: () => navigate("/generate"),
      width: 240,
    },
    {
      label: "Advanced Setup",
      onClick: () => navigate("advanced/Directory"),
      width: 240,
    },
    {
      label: "Split In Subsets",
      onClick: () => console.log("Button 2 clicked"),
      width: 240,
    },
  ];
  return (
    <>
      <MenuContainer>
        <HoverAccordionMenu
          $isHovered={hoveredMenu === "check"}
          onMouseEnter={() => setHoveredMenu("check")}
          onMouseLeave={() => setHoveredMenu(null)}
          imageSrc={Check}
          title="check"
          buttons={CheckButtons}
        />
        <HoverAccordionMenu
          $isHovered={hoveredMenu === "generate"}
          onMouseEnter={() => setHoveredMenu("generate")}
          onMouseLeave={() => setHoveredMenu(null)}
          imageSrc={Add}
          title="Generate"
          buttons={CreateButtons}
        />
      </MenuContainer>
      <Image src={BackgroundImage} />
    </>
  );
};

export default Home;
