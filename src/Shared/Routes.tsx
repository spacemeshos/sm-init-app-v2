import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SelectDirectory from '../pages/GuidedCreate/SelectDirectory';
import TailoredSettings from '../pages/GuidedCreate/TailoredSettings';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guided/SelectDirectory" element={<SelectDirectory />} />
      <Route path="/guided/TailoredSettings" element={<TailoredSettings />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
