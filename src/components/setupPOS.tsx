import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Tile from "./tile";
import { Button, CancelButton, SaveButton, TooltipButton } from "./button";
import CustomNumberInput from "./input";
import { ErrorMessage, Subheader } from "./texts";
import size from "../assets/duplicate.png";
import cpu from "../assets/cpu.png";
import gpu from "../assets/graphics-card.png";
import Frame from "./frames";
import rocket from "../assets/rocket.png";
import folder from "../assets/folder.png";
import { invoke } from "@tauri-apps/api";
import { useSettings } from "../state/SettingsContext";
import { FindProviders } from "../utils/parseResponse";
import { shortenPath } from "../utils/pathUtils";

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
  height: 100%;
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
*/
const SelectDirectory: React.FC = () => {
  const { setSettings } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [selectedDir, setSelectedDir] = useState<string | null>(null);

  const handleSelectDirectory = async () => {
    try {
      const dir = await invoke<string>("select_directory");
      setSettings((settings) => ({
        ...settings,
        selectedDir: dir,
      }));
      setSelectedDir(dir);
      console.log("Selected directory:", dir);
      setError(null); // Clear any previous errors
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Failed to select directory:", errorMessage);
      setError(errorMessage); // Set the error message
    }
  };

  return (
    <>
      <TileWrapper>
        <Tile
          heading={"Where to Store pos data?"}
          imageSrc={folder}
          imageTop={40}
          errmsg={error ?? undefined}
        />
        <Button
          onClick={handleSelectDirectory}
          label={
            selectedDir
              ? `Selected: ${shortenPath(selectedDir, 15)}`
              : "Choose directory"
          } // Use the shortened path
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
              Ensure PoS files remain accessible, as they&apos;re checked every
              2 weeks.
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
const DEFAULT_CORES = 8;
const DEFAULT_NONCES = 288;

const SetupProving: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [isCpuInputVisible, setIsCpuInputVisible] = useState(true);
  const [isNoncesInputVisible, setIsNoncesInputVisible] = useState(true);
  const [maxCores, setMaxCores] = useState<number>(0);

  const handleSaveCPU = () => {
    setIsCpuInputVisible(false);
  };

  const handleSaveNonces = () => {
    setIsNoncesInputVisible(false);
  };

  const handleCancelCPU = () => {
    setSettings((prev) => ({ ...prev, numCores: DEFAULT_CORES }));
    setIsCpuInputVisible(true);
  };

  const handleCancelNonces = () => {
    setSettings((prev) => ({ ...prev, numNonces: DEFAULT_NONCES }));
    setIsNoncesInputVisible(true);
  };

  useEffect(() => {
    const fetchCpuCores = async () => {
      try {
        const cores = await invoke<number>("get_cpu_cores");
        setMaxCores(cores);
        const defaultCores = Math.floor((3 / 4) * cores);
        setSettings((prev) => ({ ...prev, numCores: defaultCores }));
      } catch (error) {
        console.error("Error fetching CPU cores:", error);
      }
    };

    fetchCpuCores();
  }, [setSettings]);


  const InputSection: React.FC<{
    heading: string;
    footer: string;
    isVisible: boolean;
    value: number;
    min: number;
    max: number;
    step: number;
    handleSave: () => void;
    handleCancel: () => void;
    onChange: (val: number) => void;
  }> = ({
    heading,
    footer,
    isVisible,
    value,
    min,
    max,
    step,
    handleSave,
    handleCancel,
    onChange,
  }) => (
    <TileWrapper>
      <Tile heading={heading} footer={footer} />
      {isVisible ? (
        <>
          <CustomNumberInput
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
          />
          <SaveButton buttonLeft={55} onClick={handleSave} />
          <CancelButton buttonLeft={45} onClick={handleCancel} />
        </>
      ) : (
        <>
          <SelectedValue>{value}</SelectedValue>
          <CancelButton buttonLeft={50} onClick={handleCancel} />
        </>
      )}
    </TileWrapper>
  );

  return (
    <BottomContainer>
      <BgImage src={cpu} />
      <InputSection
        heading="Select number of CPU cores"
        footer="more CPU cores -> faster proof generation"
        isVisible={isCpuInputVisible}
        value={settings.numCores ? settings.numCores : DEFAULT_CORES}
        min={1}
        max={maxCores}
        step={1}
        handleSave={handleSaveCPU}
        handleCancel={handleCancelCPU}
        onChange={(val) => setSettings((prev) => ({ ...prev, numCores: val }))}
      />
      <InputSection
        heading="Select number of Nonces"
        footer="more nonces -> more likely proof generated on the first try"
        isVisible={isNoncesInputVisible}
        value={settings.numNonces ? settings.numNonces : DEFAULT_NONCES}
        min={16}
        max={9999}
        step={16}
        handleSave={handleSaveNonces}
        handleCancel={handleCancelNonces}
        onChange={(val) => setSettings((prev) => ({ ...prev, numNonces: val }))}
      />
    </BottomContainer>
  );
};

/* --------- Provider - GPU ---------
_____________________________________________________________________________________________
Usage of ./postcli:
-provider  uint  compute provider id (required)

By default the fastest marked as 0 and is chosen automatically 
*/
type Props = {
  isOpen: boolean;
};

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
          subheader={shortenPath(settings.selectedDir ?? "", 20)}
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
