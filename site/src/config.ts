// Runs config.js (it sets window.SVFX_CONFIG) and gives the rest of the app a typed view of it.
import "../config.js";

export interface SiteConfig {
  discord?: string;
  price?: string;
  versionUrl?: string;
  users?: string;
  pay?: {
    creatorStore?: string;
    shirt?: string;
    shirtPrice?: string;
  };
}

declare global {
  interface Window {
    SVFX_CONFIG?: SiteConfig;
  }
}

export const CFG: SiteConfig = window.SVFX_CONFIG ?? {};
