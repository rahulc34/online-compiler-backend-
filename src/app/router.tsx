import { BrowserRouter, Routes, Route } from "react-router-dom";

import RouteMetadata from "./RouteMetadata";
import Home from "../features/home/pages/Home";
import Editor from "../features/editor/editor/Editor";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

export function AppRoutes() {
  return (
    <>
      <RouteMetadata />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;
