import * as React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { invoke } from "@tauri-apps/api/tauri";

import BackgroundImage from "../assets/home.png";
import Logo from "../assets/Full logo - White.png";
import { HoverAccordionMenu } from "../components/accordion";
import { Button } from "../components/button";
import { ExternalLinks } from "../Shared/Constants";
import { Subheader, Title } from "../styles/texts";
import Image from "../components/image";
import { Background } from "../styles/containers";
import { ProfilerResultModal } from "../components/ProfilerResultModal";

const MenuContainer = styled.div`
  position: fixed;
  width: 500px;
  height: 400px;
  right: 50px;
  top: 150px;
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
  const [isRunningProfiler, setIsRunningProfiler] = React.useState(false);
  const [profilerResult, setProfilerResult] = React.useState<any>(null);
  const [showProfilerModal, setShowProfilerModal] = React.useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate to the docs page
  const navigateToReqs = () => navigate("/docs");

  const runProfiler = async () => {
    try {
      setIsRunningProfiler(true);
      const result = await invoke('run_profiler', {
        threads: 4,
        data_size: 1,
        duration: 10
      });
      setProfilerResult(result);
      setShowProfilerModal(true);
    } catch (error) {
      console.error('Profiler error:', error);
      alert(`Failed to run profiler: ${error}`);
    } finally {
      setIsRunningProfiler(false);
    }
  };

  // Button configurations for the "Check" menu
  const CheckButtons = [
    {
      label: "Requirements",
      onClick: () => navigateToReqs(), //TODO
      width: 300,
    },
    {
      label: "Generation speed",
      onClick: () => console.log("Button 1 clicked"), //TODO
      width: 300,
    },
    {
      label: isRunningProfiler ? "Running..." : "Proving Capacity",
      onClick: runProfiler,
      disabled: isRunningProfiler,
      width: 300,
    },
  ];

  return (
    <>
      <Background src={BackgroundImage} />
      <MenuContainer>
        <Image src={Logo} width={40} top={-60} />

        <Title text="Proof of Space" />
        <Subheader text="Initialization App" top={0} />
        <Button
          top={30}
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
      <ProfilerResultModal
        isOpen={showProfilerModal}
        onClose={() => setShowProfilerModal(false)}
        result={profilerResult}
      />
    </>
  );
};

export default Home;
