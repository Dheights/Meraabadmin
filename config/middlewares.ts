export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::public',
  {
    name: 'strapi::favicon',
    config: {
      path: './public/uploads/favicon.png'
    },
  },
];
