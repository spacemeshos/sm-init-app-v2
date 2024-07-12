import * as React from "react";
import styled from "styled-components";
import { Button, TooltipButton } from "./button";
import folder from "../assets/folder.png";
import Tile from "./tile";
import Colors from "../styles/colors";
import { invoke } from "@tauri-apps/api";

const DirWrapper = styled.div`
  height: 370px;
  width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
`;

const SelectDirectory: React.FC = () => {
  const [selectedDir, setSelectedDir] = React.useState<string | null>(null);

  const handleSelectDirectory = async () => {
    try {
      const dir = await invoke<string>("select_directory");
      setSelectedDir(dir);
      console.log("Selected directory:", dir);
    } catch (error) {
      console.error("Failed to select directory:", error);
    }
  };
  
  return (
    <>
      <DirWrapper>
        <Tile
          heading={"Where to Store pos data?"}
          imageSrc={folder}
          imageTop={40}
        />
        <Button
          onClick={handleSelectDirectory}
          label="Choose directory"
          width={320}
          buttonTop={100}
          backgroundColor={Colors.darkerPurple}
          borderColor={Colors.purpleLight}
        />
        <TooltipButton
          modalText={
            <>
              Use a reliable disk with at least 256 Gibibytes, preferring good
              read speed (HDDs suffice).
              <br />
              <br />
              Ensure PoS files remain accessible, as they're checked every 2
              weeks.
              <br />
              <br />
              Consider a dedicated disk or no other activity during proving
              windows for disk longevity.
            </>
          }
          modalTop={1}
          modalLeft={1}
          buttonTop={96}
        />
        {selectedDir && <p>Selected Directory: {selectedDir}</p>}
      </DirWrapper>
    </>
  );
};

export default SelectDirectory;
