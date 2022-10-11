import Layout from "components/layout";
import DashboardPage from "pages/dashboard";
import ExplorerPage from "pages/explorer";
import LaunchpadPage from "pages/launchpad";
import OurTokenPage from "pages/ourtoken";
import ProfilePage from "pages/profile";
import SwapPage from "pages/swap";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={""} element={<OurTokenPage />} />
          <Route path={"profile"} element={<ProfilePage />} />
          <Route path={"invest"} element={<DashboardPage />} />
          <Route path={"explorer"} element={<ExplorerPage />} />
          <Route path={"launchpad"} element={<LaunchpadPage />} />
          <Route path={"swap"} element={<SwapPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
