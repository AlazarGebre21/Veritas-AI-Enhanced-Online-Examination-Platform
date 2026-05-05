import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";

/**
 * Google Fonts available for enterprise customization.
 * Maps font label → Google Fonts family name.
 */
const GOOGLE_FONT_MAP = {
  Inter: "Inter",
  Roboto: "Roboto",
  Outfit: "Outfit",
  Poppins: "Poppins",
  "Open Sans": "Open+Sans",
  Lato: "Lato",
  Montserrat: "Montserrat",
  "Source Sans 3": "Source+Sans+3",
  Nunito: "Nunito",
  Raleway: "Raleway",
};

/**
 * BrandingProvider — reads the current enterprise's branding fields
 * (primaryColor, secondaryColor) and settings (bgColor, sidebarColor,
 * textColor, fontFamily) and injects them as CSS custom properties on
 * document.documentElement so the entire UI re-themes automatically.
 *
 * Only renders for EnterpriseAdmin / EnterpriseStaff roles.
 * Falls back to the design-system defaults when no branding is set.
 */
export default function BrandingProvider({ children }) {
  const { data: enterprise } = useQuery({
    queryKey: ["enterprises", "me"],
    queryFn: enterpriseApi.getMe,
    staleTime: 5 * 60 * 1000,
  });

  // Inject CSS custom properties for colors
  useEffect(() => {
    const root = document.documentElement;

    if (enterprise?.primaryColor) {
      root.style.setProperty("--color-brand-primary", enterprise.primaryColor);
    }
    if (enterprise?.secondaryColor) {
      root.style.setProperty("--color-brand-secondary", enterprise.secondaryColor);
    }

    // Settings-based customizations
    const settings = enterprise?.settings;
    if (settings?.bgColor) {
      root.style.setProperty("--color-brand-bg", settings.bgColor);
      root.style.setProperty("--color-warm-white", settings.bgColor);
    }
    if (settings?.sidebarColor) {
      root.style.setProperty("--color-brand-sidebar", settings.sidebarColor);
    }
    if (settings?.textColor) {
      root.style.setProperty("--color-brand-text", settings.textColor);
      // Also override the design-system text token so all text-notion-black
      // usages automatically pick up the brand text color
      root.style.setProperty("--color-notion-black", settings.textColor);
    }

    // Cleanup: reset to defaults when unmounting (e.g., logging out)
    return () => {
      root.style.removeProperty("--color-brand-primary");
      root.style.removeProperty("--color-brand-secondary");
      root.style.removeProperty("--color-brand-bg");
      root.style.removeProperty("--color-brand-sidebar");
      root.style.removeProperty("--color-brand-text");
      root.style.removeProperty("--color-notion-black");
      root.style.removeProperty("--color-warm-white");
      root.style.removeProperty("--font-brand");
    };
  }, [
    enterprise?.primaryColor,
    enterprise?.secondaryColor,
    enterprise?.settings,
    enterprise?.settings?.bgColor,
    enterprise?.settings?.sidebarColor,
    enterprise?.settings?.textColor,
  ]);

  // Dynamically load Google Fonts and set font-brand CSS var
  useEffect(() => {
    const fontFamily = enterprise?.settings?.fontFamily;
    if (!fontFamily || fontFamily === "Default") return;

    const googleName = GOOGLE_FONT_MAP[fontFamily];
    if (!googleName) return;

    const root = document.documentElement;
    const linkId = "brand-google-font";

    // Only inject the <link> if not already present
    let linkEl = document.getElementById(linkId);
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.id = linkId;
      linkEl.rel = "stylesheet";
      document.head.appendChild(linkEl);
    }
    linkEl.href = `https://fonts.googleapis.com/css2?family=${googleName}:wght@400;500;600;700&display=swap`;

    root.style.setProperty(
      "--font-brand",
      `"${fontFamily}", -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif`
    );

    return () => {
      root.style.removeProperty("--font-brand");
      const el = document.getElementById(linkId);
      if (el) el.remove();
    };
  }, [enterprise?.settings?.fontFamily]);

  return children;
}
