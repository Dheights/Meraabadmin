import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::homepage.homepage",
  ({ strapi }) => ({

    async find(ctx) {
      const entity = await strapi.entityService.findOne(
        "api::homepage.homepage",
        1,
        {
          populate: {
            heroBanner: {
              populate: {
                image: true,
                product: {
                  populate: ["images", "product_category", "artisanProfileImage"],
                },
                category: { populate: ["product_categories"] },
              },
            },
            productCategories: { populate: ["category", "image"] },
            newDrops: { populate: ["category", "image"] },
            productCategoryCollection: {
              populate: ["category", "image", "product"],
            },
            visitStore: {
              populate: ["category", "image", "product"],
            },
          },
        }
      );

      const cleaned = await transformHomepage(entity, strapi);

      return { data: cleaned, meta: {} };
    },

  })
);


// ======================================================================
// TRANSFORMER — SIGNS ALL MEDIA URLS + SANITIZES OUTPUT
// ======================================================================
async function transformHomepage(data: any, strapi: any) {
  const uploadProvider = strapi.plugin("upload").provider;

  // ----------------------------------------------------
  // Sanitize + sign ONE MEDIA object
  // ----------------------------------------------------
  const signOne = async (img: any) => {
    if (!img?.url) return img;

    const signed = await uploadProvider.getSignedUrl(img);

    return {
      id: img.id,
      name: img.name,
      mime: img.mime,
      size: img.size,
      url: signed.url,
    };
  };

  // ----------------------------------------------------
  // Sanitize + sign MULTIPLE media (array)
  // ----------------------------------------------------
  const signMany = async (images: any[]) => {
    if (!Array.isArray(images)) return images;
    return Promise.all(images.map((img) => signOne(img)));
  };

  // ------------------------------------------------------------------
  // HERO BANNER
  // ------------------------------------------------------------------
  if (Array.isArray(data.heroBanner)) {
    for (const block of data.heroBanner) {

      // block.image (Single)
      if (block.image) block.image = await signOne(block.image);

      // product.images (Multiple)
      if (block.product?.images) {
        block.product.images = await signMany(block.product.images);
      }

      // product.artisanProfileImage (Single)
      if (block.product?.artisanProfileImage) {
        block.product.artisanProfileImage = await signOne(
          block.product.artisanProfileImage
        );
      }
    }
  }

  // ------------------------------------------------------------------
  // PRODUCT CATEGORIES
  // image = Multiple Media
  // ------------------------------------------------------------------
  if (Array.isArray(data.productCategories)) {
    for (const item of data.productCategories) {
      if (item.image) item.image = await signMany(item.image);
    }
  }

  // ------------------------------------------------------------------
  // NEW DROPS
  // image = Single Media
  // ------------------------------------------------------------------
  if (Array.isArray(data.newDrops)) {
    for (const item of data.newDrops) {
      if (item.image) item.image = await signOne(item.image);
    }
  }

  // ------------------------------------------------------------------
  // PRODUCT CATEGORY COLLECTION
  // image = Single Media
  // product.images = Multiple
  // product.artisanProfileImage = Single
  // ------------------------------------------------------------------
  if (Array.isArray(data.productCategoryCollection)) {
    for (const block of data.productCategoryCollection) {

      if (block.image) block.image = await signOne(block.image);

      if (block.product?.images) {
        block.product.images = await signMany(block.product.images);
      }

      if (block.product?.artisanProfileImage) {
        block.product.artisanProfileImage = await signOne(
          block.product.artisanProfileImage
        );
      }
    }
  }

  // ------------------------------------------------------------------
  // VISIT STORE
  // Same structure as above
  // ------------------------------------------------------------------
  if (Array.isArray(data.visitStore)) {
    for (const block of data.visitStore) {

      if (block.image) block.image = await signOne(block.image);

      if (block.product?.images) {
        block.product.images = await signMany(block.product.images);
      }

      if (block.product?.artisanProfileImage) {
        block.product.artisanProfileImage = await signOne(
          block.product.artisanProfileImage
        );
      }
    }
  }

  return data;
}
