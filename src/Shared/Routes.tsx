import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SelectDirectory from "../pages/GuidedCreate/SelectDirectory";
import TailoredSettings from "../pages/GuidedCreate/TailoredSettings";
import Summary from "../pages/GuidedCreate/Summary";
import DirectorySelectionModal from "../components/dir_select_modal";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guided/SelectDirectory" element={<SelectDirectory />} />
      <Route path="/guided/TailoredSettings" element={<TailoredSettings />} />
      <Route path="/guided/Summary" element={<Summary />} />
      <Route
        path="/guided/src/components/dir_select_modal.tsx"
        element={
          <DirectorySelectionModal
            isOpen={false}
            onSelect={function (directory: string): void {
              throw new Error("Function not implemented.");
            }}
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
