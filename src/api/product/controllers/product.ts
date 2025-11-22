/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({

    //----------------------------------------------------------------------
    // FIND MANY → GET /api/products
    //----------------------------------------------------------------------
    async find(ctx) {
      const shouldPopulate = ctx.query?.populate === "*";

      const result = await super.find(ctx);

      const data = Array.isArray(result?.data) ? result.data : [];
      const meta = result?.meta ?? {};

      const cleaned = await Promise.all(
        data.map((item: any) => transformItem(item, shouldPopulate))
      );

      return { data: cleaned, meta };
    },

    //----------------------------------------------------------------------
    // FIND ONE → GET /api/products/:id
    //----------------------------------------------------------------------
    async findOne(ctx) {
      const shouldPopulate = ctx.query?.populate === "*";

      const entity = await strapi.entityService.findOne(
        "api::product.product",
        ctx.params.id,
        {
          populate: shouldPopulate ? ctx.query?.populate : [],
        }
      );

      if (!entity) return { data: null };

      return {
        data: await transformItem(entity, shouldPopulate),
      };
    },

  })
);

//----------------------------------------------------------------------
// Helper to clean output + generate signed URLs
//----------------------------------------------------------------------
async function transformItem(product: any, includeRelations: boolean) {
  if (!product) return null;

  const uploadProvider = strapi.plugin("upload").provider;
  let signedImages: any[] = [];

  if (product.images && Array.isArray(product.images)) {
    signedImages = await Promise.all(product.images.map(async (img: any) => {
      const signedUrl = await uploadProvider.getSignedUrl(img);
      return {
        id: img.id,
        name: img.name,
        mime: img.mime,
        size: img.size,
        url: signedUrl.url,
      }
    }));
  }

  const base: any = {
    id: product.id,
    documentId: product.documentId,
    name: product.name,
    title: product.title,
    subTitle: product.subTitle,
    description: product.description,
    images: signedImages,
    code: product.code,
    price: product.price,
    tag: product.tag,
  };

  //--------------------------------------------------------------------
  // RELATION (ONLY product_category) WHEN populate=*
  //--------------------------------------------------------------------
  if (includeRelations && product.product_category) {
    base.product_category = {
      id: product.product_category.id,
      type: product.product_category.type,
    };
  }

  return base;
}
