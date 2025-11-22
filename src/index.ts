import type { Core } from "@strapi/strapi";

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const uploadPlugin = strapi.plugin("upload");

    if (!uploadPlugin) {
      return;
    }

    const imageService = uploadPlugin.service("image-manipulation");

    if (!imageService) {
      return;
    }

    imageService.generateThumbnail = async () => {
      return null;
    };
  },
};
