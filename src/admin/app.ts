import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    head: {
      favicon: '/favicon.ico',
      title: 'Meraab Admin',
    },
    translations: {
      en: {
        "Auth.form.welcome.title": "Meraab Admin!",
        "Auth.form.welcome.subtitle": "Login to Meraab Admin",
      }
    },
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
