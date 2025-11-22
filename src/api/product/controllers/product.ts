/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({

    //----------------------------------------------------------------------
    // FIND MANY  →  GET /api/products
    //----------------------------------------------------------------------
    async find(ctx) {
      const shouldPopulate = ctx.query?.populate === "*";

      const result = await super.find(ctx);

      const data = Array.isArray(result?.data) ? result.data : [];
      const meta = result?.meta ?? {};

      const cleaned = data.map((item: any) =>
        transformItem(item, shouldPopulate)
      );

      return { data: cleaned, meta };
    },

    //----------------------------------------------------------------------
    // FIND ONE  →  GET /api/products/:id
    //----------------------------------------------------------------------
    async findOne(ctx) {
      const shouldPopulate = ctx.query?.populate === "*";

      const entity = await strapi.entityService.findOne(
        "api::product.product",
        ctx.params.id,
        {
          populate: shouldPopulate ? ["product_category"] : [],
        }
      );

      if (!entity) return { data: null };

      return {
        data: transformItem(entity, shouldPopulate),
      };
    },

  })
);

//----------------------------------------------------------------------
// Helper to clean output
//----------------------------------------------------------------------
function transformItem(product: any, includeRelations: boolean) {
  if (!product) return null;

  const base: any = {
    id: product.id,
    documentId: product.documentId,
    name: product.name,
    title: product.title,
    subTitle: product.subTitle,
    description: product.description,
    code: product.code,
    imageUrl: product.image_url,
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
