import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../components/shared/Navbar";
import Footer from "../../../components/shared/Footer";

import { useAuth } from "../../auth/hooks/useAuth";
import {
  AUTH_RETURN_PATH_KEY,
  getSafeReturnPath,
} from "../../auth/utils/auth-navigation";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Languages from "../components/Languages";
import CTA from "../components/CTA";

function Home() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !user) return;

    const pendingReturnPath = sessionStorage.getItem(AUTH_RETURN_PATH_KEY);

    if (!pendingReturnPath) return;

    sessionStorage.removeItem(AUTH_RETURN_PATH_KEY);
    navigate(getSafeReturnPath(pendingReturnPath), { replace: true });
  }, [isLoading, user, navigate]);

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <Navbar />

      <main>
        <Hero />
        <Languages />
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
