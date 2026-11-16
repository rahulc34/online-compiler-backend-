import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Online Compiler & IDE | Compiler",
    description:
      "Write, compile, and run code in your browser with Compiler, an online compiler and IDE for developers.",
  },
  "/editor": {
    title: "Code Editor | Compiler",
    description: "Write and run code in Compiler's online code editor.",
  },
  "/login": {
    title: "Sign In | Compiler",
    description: "Sign in to your Compiler account to run code.",
  },
  "/signup": {
    title: "Create an Account | Compiler",
    description: "Create a Compiler account to start running code.",
  },
  "/verify-email": {
    title: "Verify Your Email | Compiler",
    description: "Verify your email address to finish creating your Compiler account.",
  },
  "/forgot-password": {
    title: "Reset Your Password | Compiler",
    description: "Request a password reset for your Compiler account.",
  },
  "/reset-password": {
    title: "Choose a New Password | Compiler",
    description: "Set a new password for your Compiler account.",
  },
};

function setMetaContent(selector: string, content: string) {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  element?.setAttribute("content", content);
}

function updateCanonicalUrl(pathname: string) {
  const existingCanonical =
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (pathname !== "/") {
    existingCanonical?.remove();
    return;
  }

  const siteUrl = import.meta.env.VITE_SITE_URL;
  if (!siteUrl) return;

  const canonical =
    existingCanonical ?? document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = new URL("/", siteUrl).href;

  if (!existingCanonical) document.head.append(canonical);
}

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = routeMetadata[pathname] ?? {
      title: "Page Not Found | Compiler",
      description: "The page you requested could not be found.",
    };

    document.title = metadata.title;
    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[property="og:title"]', metadata.title);
    setMetaContent('meta[property="og:description"]', metadata.description);
    setMetaContent(
      'meta[name="robots"]',
      pathname === "/" ? "index, follow" : "noindex, follow",
    );
    updateCanonicalUrl(pathname);
  }, [pathname]);

  return null;
}

export default RouteMetadata;
