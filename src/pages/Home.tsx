import * as React from "react";
import styled from "styled-components";
import { HoverAccordionMenu } from "../components/accordion";
import { ExternalLinks } from "../shared/Constants";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/dev-summary.png";
import Add from "../assets/plus.png";
import Check from "../assets/check.png";

const Image = styled.img`
  width: auto;
  height: 550px;
  position: absolute;
  margin-bottom: 10px;
  right: 0px;
  top: 0px;
`;

const MenuContainer = styled.div`
  position: absolute;
  width: 400px;
  height: 300px;
  left: 100px;
  top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
  align-items: center;
  `;

const Home: React.FC = () => {
  // State to track which menu is hovered
  const [hoveredMenu, setHoveredMenu] = React.useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate to the prerequisites page
  const navigateToReqs = () => window.open(ExternalLinks.Requirements);

  // Button configurations for the "Create" menu
  const CreateButtons = [
    {
      label: "Guided Setup",
      onClick: () => navigate("/guided/SelectDirectory"),
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
  // Button configurations for the "Check" menu
  const CheckButtons = [
    {
      label: "Requirements",
      onClick: () => navigateToReqs,
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
        <HoverAccordionMenu
          $isHovered={hoveredMenu === "check"}
          onMouseEnter={() => setHoveredMenu("check")}
          onMouseLeave={() => setHoveredMenu(null)}
          imageSrc={Check}
          title="check"
          buttons={CheckButtons}
          buttonsBorderColor="transparent"
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
