import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Tile from "./tile";
import { Button, CancelButton, SaveButton, TooltipButton } from "./button";
import CustomNumberInput from "./input";
import { FindProviders } from "../services/parseResponse";
import { ErrorMessage, Subheader } from "./texts";
import size from "../assets/duplicate.png";
import cpu from "../assets/cpu.png";
import gpu from "../assets/graphics-card.png";
import Frame from "./frames";
import rocket from "../assets/rocket.png";
import folder from "../assets/folder.png";
import { invoke } from "@tauri-apps/api";
import { useSettings } from "../state/SettingsContext";

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 250px;
  position: absolute;
  left: 20px;
  top: -200px;
  opacity: 0.02;
`;

const BottomContainer = styled.div`
  height: 400px;
  width: 1200px;
  position: absolute;
  top: 270px;
  left: 0px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
`;

const ContainerSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  left: 75px;
  top: 300px;
  width: 675px;
  height: 320px;
  position: absolute;
`;

const ContainerStart = styled.div`
  left: 800px;
  top: 300px;
  width: 300px;
  height: 300px;
  position: absolute;
`;

const TileWrapper = styled.div<{
  width?: number;
}>`
  height: 370px;
  width: ${({ width }) => width || 450}px;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: row;
`;

const SelectedValue = styled.h1`
  color: ${Colors.greenLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-weight: 300;
  font-size: 50px;
  position: relative;
`;

/*  --------- SELECT DIRECTORY ---------
_____________________________________________________________________________________________
Usage of ./postcli:

*/
const SelectDirectory: React.FC = () => {
  const { settings, setSettings } = useSettings();

  const handleSelectDirectory = async () => {
    try {
      const dir = await invoke<string>("select_directory");
      setSettings((prevSettings) => ({
        ...prevSettings,
        selectedDir: dir,
      }));
      console.log("Selected directory:", dir);
    } catch (error) {
      console.error("Failed to select directory:", error);
    }
  };

  return (
    <>
      <TileWrapper>
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
      </TileWrapper>
    </>
  );
};

/*  --------- POS SIZE ---------
_____________________________________________________________________________________________
Usage of ./postcli:
-maxFileSize  uint  max file size (default 4294967296)
-numUnits  uint  number of units (required)
*/

const SetupSize: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [isPOSInputVisible, setIsPOSInputVisible] = useState(true);
  const [isFileInputVisible, setIsFileInputVisible] = useState(true);

  const handleSaveDataSize = () => {
    setIsPOSInputVisible(false);
  };

  const handleSaveFileSize = () => {
    setIsFileInputVisible(false);
  };

  const handleCancelDataSize = () => {
    setSettings((prev) => ({ ...prev, numUnits: 4 })); // Reset to default value
    setIsPOSInputVisible(true);
  };

  const handleCancelFileSize = () => {
    setSettings((prev) => ({ ...prev, maxFileSize: 4096 })); // Reset to default value
    setIsFileInputVisible(true);
  };

  return (
    <BottomContainer>
      <BgImage src={size} />
      <TileWrapper>
        <Tile
          heading="Select POS data size"
          subheader="Gibibytes"
          footer="more data -> more rewards, but longer generation and proving"
        />
        {isPOSInputVisible ? (
          <>
            <CustomNumberInput
              min={256}
              max={99999999999999}
              step={64}
              value={settings.numUnits ? settings.numUnits * 64 : 256}
              onChange={(val) =>
                setSettings((prev) => ({ ...prev, numUnits: val / 64 }))
              }
            />
            <SaveButton buttonLeft={55} onClick={handleSaveDataSize} />
            <CancelButton buttonLeft={45} onClick={handleCancelDataSize} />
          </>
        ) : (
          <>
            <SelectedValue>{(settings.numUnits ?? 256) * 64}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelDataSize} />
          </>
        )}
      </TileWrapper>
      <TileWrapper>
        <Tile
          heading="Select file size"
          subheader="Mebibytes"
          footer="POS will be stored across [XXX] files"
        />
        {isFileInputVisible ? (
          <>
            <CustomNumberInput
              min={10}
              max={9999999}
              step={1}
              value={settings.maxFileSize}
              onChange={(val) =>
                setSettings((prev) => ({ ...prev, maxFileSize: val }))
              }
            />
            <SaveButton buttonLeft={55} onClick={handleSaveFileSize} />
            <CancelButton buttonLeft={45} onClick={handleCancelFileSize} />
          </>
        ) : (
          <>
            <SelectedValue>{settings.maxFileSize}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelFileSize} />
          </>
        )}
      </TileWrapper>
    </BottomContainer>
  );
};

/* --------- Proving - CPU & Nonces ---------
_____________________________________________________________________________________________ 
Setting up the proving opts
CPU cores should default to the 3/4 of the User's CPU
Nonces number should be 288 or higher to assure finding the proof on the first read

These values are not used in the postcli command
they should be saved in the config file to simplify smeshing setup

*/
const SetupProving: React.FC = () => {
  const [cpuValue, setCpuValue] = useState(8); //placeholder
  const [noncesValue, setNoncesValue] = useState(288);
  const [isCpuInputVisible, setIsCpuInputVisible] = useState(true);
  const [isNoncesInputVisible, setIsNoncesInputVisible] = useState(true);

  const handleCancelCpu = () => {
    setCpuValue(8); // Reset to default value
    setIsCpuInputVisible(true);
  };

  const handleSaveCpu = () => {
    setIsCpuInputVisible(false);
  };

  const handleCancelNonces = () => {
    setNoncesValue(288); // Reset to default value
    setIsNoncesInputVisible(true);
  };

  const handleSaveNonces = () => {
    setIsNoncesInputVisible(false);
  };

  return (
    <BottomContainer>
      <BgImage src={cpu} />
      <TileWrapper>
        <Tile
          heading="Select number of CPU cores"
          footer="more CPU cores -> faster proof generation"
        />
        {isCpuInputVisible ? (
          <>
            <CustomNumberInput
              min={1}
              max={16}
              step={1}
              value={cpuValue}
              onChange={(val) => setCpuValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveCpu} />
            <CancelButton buttonLeft={45} onClick={handleCancelCpu} />
          </>
        ) : (
          <>
            <SelectedValue>{cpuValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelCpu} />
          </>
        )}
      </TileWrapper>
      <TileWrapper>
        <Tile
          heading="Select number of Nonces"
          footer="more nonces -> more likely proof generated on the first try"
        />
        {isNoncesInputVisible ? (
          <>
            <CustomNumberInput
              min={16}
              max={9999}
              step={16}
              value={noncesValue}
              onChange={(val) => setNoncesValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveNonces} />
            <CancelButton buttonLeft={45} onClick={handleCancelNonces} />
          </>
        ) : (
          <>
            <SelectedValue>{noncesValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelNonces} />
          </>
        )}
      </TileWrapper>
    </BottomContainer>
  );
};

type Props = {
  isOpen: boolean;
};

/* --------- Provider - GPU ---------
_____________________________________________________________________________________________
Usage of ./postcli:
-provider  uint  compute provider id (required)

By default the fastest marked as 0 and is chosen automatically 
*/

const SetupGPU: React.FC<Props> = ({ isOpen }) => {
  const { run, response, loading, error } = FindProviders();

  useEffect(() => {
    if (isOpen) {
      run(["-printProviders"]);
    }
  }, [isOpen]);

  function createTile(processor: {
    ID: number;
    Model: string;
    DeviceType: string;
  }) {
    const isFastest = processor.ID === 0;
    const icon = processor.DeviceType === "GPU" ? gpu : cpu;

    return (
      <TileWrapper width={350} key={processor.ID}>
        <Tile
          heading={processor.Model}
          subheader={processor.DeviceType}
          footer={isFastest ? "The Fastest" : ""}
          imageSrc={icon}
          //implement onCLick: select the clicked provider - save it's ID to pass to the binary as a -provider flag
        />
      </TileWrapper>
    );
  }

  return (
    <BottomContainer>
      <BgImage src={gpu} />
      {loading && <Subheader text="Loading..." left={0} />}
      {error ? (
        <ErrorMessage text="Error:"> {error}</ErrorMessage>
      ) : response && response.length > 0 ? (
        response.map(createTile)
      ) : (
        <Subheader text={"No processors detected"} />
      )}
    </BottomContainer>
  );
};

/* --------- Summary ---------
_____________________________________________________________________________________________
Show summary and compose command

Usage of ./postcli:
-commitmentAtxId   string  commitment atx id, in hex (required)
-datadir  string  filesystem datadir path (default "/Users/monikasmolarek/post/data")
-id   string  miner's id (public key), in hex (will be auto-generated if not provided)
-maxFileSize  uint  max file size (default 4294967296)
-numUnits   uint  number of units (required)
-printConfig  print the used config and options
-printNumFiles  print the total number of files that would be initialized
-printProviders  print the list of compute providers
-provider  uint  compute provider id (required)
*/

const SetupSummary: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { settings } = useSettings();
  return (
    <>
      <ContainerSummary>
        <BgImage src={rocket} />
        <Frame
          height={25}
          heading="POS DATA"
          subheader={`${(settings.numUnits ?? 256) * 64} Gibibytes, ${
            settings.maxFileSize
          } MiB file size`} //TODO convert dynamically GiB TiB PiB etc
        />
        <Frame
          height={25}
          heading="POS Directory"
          subheader={settings.selectedDir}
        />
        <Frame
          height={25}
          heading="POS Generation"
          subheader={`Provider ID: ${settings.provider}`}
        />
        <Frame
          height={25}
          heading="POST Proving"
          subheader={`${settings.numCores} cores, ${settings.numNonces} nonces`}
        />
      </ContainerSummary>
      <ContainerStart>
        <Button
          label="Start Data generation"
          borderColor={Colors.purpleLight}
          backgroundColor={Colors.darkerPurple}
          buttonTop={160}
          buttonLeft={25}
          height={80}
          onClick={onStart}
        />
      </ContainerStart>
    </>
  );
};

export { SelectDirectory, SetupSize, SetupProving, SetupGPU, SetupSummary };
