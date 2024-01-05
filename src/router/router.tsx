import { Route, Routes } from "react-router-dom";
import AdventureGenerator from "../pages/AdventureGenerator";
import Info from "../pages/Info";
import AiHelper from "../pages/AiHelper";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<AdventureGenerator />} />
      <Route path="/AiHelper" element={<AiHelper />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
}

export default Router;
