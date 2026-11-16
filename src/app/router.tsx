import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../features/home/pages/Home";
import Editor from "../features/editor/editor/Editor";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
