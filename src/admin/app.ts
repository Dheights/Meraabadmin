// import type { StrapiApp } from '@strapi/strapi/admin';
import { overrideAdminTitle } from './extensions/header';

export default {
  config: {
    // Translation overrides (login page text)
    translations: {
      en: {
        "Auth.form.welcome.title": "Meraab Admin!",
        "Auth.form.welcome.subtitle": "Login to Meraab Admin",
      }
    },

    // Hide marketplace & tutorials
    tutorials: process.env.NODE_ENV === "production" ? false : true,

    notifications: {
      // Hide marketplace updates
      releases: process.env.NODE_ENV === "production" ? false : true
    },
  },

  bootstrap() {
    // Force override admin title everywhere
    overrideAdminTitle();
  },
};
