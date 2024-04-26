import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Step1 from '../pages/GuidedCreate/Step1';
import React from 'react';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guided/step1" element={<Step1 />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
