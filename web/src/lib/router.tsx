import React, { useEffect, useState } from "react";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Sponsor from "@/pages/Sponsor";
import Education from "@/pages/Education";
import Pay from "@/pages/Pay";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Volunteer from "@/pages/Volunteer";
import ImpactChain from "@/pages/ImpactChain";
import Admin from "@/pages/Admin";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import Terms from "@/pages/legal/Terms";

export function navigate(to: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname === to) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function Link({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={to}
      onClick={(e) => {
        // allow normal ctrl+click / new-tab behavior
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        if (to.startsWith("#")) {
          // in-page anchor. If we're not on the home route, navigate there first then set hash.
          if (typeof window !== "undefined") {
            if (window.location.pathname !== "/") {
              navigate("/");
              // set hash after navigation has taken place
              setTimeout(() => {
                window.location.hash = to;
              }, 80);
            } else {
              window.location.hash = to;
            }
          }
        } else {
          navigate(to);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export default function Router() {
  const [path, setPath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Normalize trailing slash
  const p = path.replace(/\/$/, "") || "/";

  // Blog post routing: /blog/:slug
  if (p.startsWith("/blog/")) {
    const slug = p.replace("/blog/", "");
    return <Blog slug={slug} />;
  }

  switch (p) {
    case "/":
      return <Home />;
    case "/dashboard":
      return <Dashboard />;
    case "/impact-chain":
      return <ImpactChain />;
    case "/sponsor":
      return <Sponsor />;
    case "/pay":
      return <Pay />;
    case "/education":
      return <Education />;
    case "/volunteer":
      return <Volunteer />;
    case "/blog":
      return <Blog />;
    case "/admin":
      return <Admin />;
    case "/contact":
      return <Contact />;
    case "/privacy-policy":
      return <PrivacyPolicy />;
    case "/terms":
      return <Terms />;
    default:
      // unknown path -> Home
      return <Home />;
  }
}
