/**
 * product-category controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product-category.product-category', ({ strapi }) => ({

  //----------------------------------------------------------------------
  // FIND MANY ( /api/product-categories )
  //----------------------------------------------------------------------
  async find(ctx) {
    const shouldPopulate = ctx.query?.populate === '*';

    const result = await super.find(ctx);

    const data = Array.isArray(result?.data) ? result.data : [];
    const meta = result?.meta ?? {};

    const cleaned = data.map((item: any) =>
      transformItem(item, shouldPopulate)
    );

    return { data: cleaned, meta };
  },

  //----------------------------------------------------------------------
  // FIND ONE ( /api/product-categories/:id )
  //----------------------------------------------------------------------
  async findOne(ctx) {
    const shouldPopulate = ctx.query?.populate === "*";

    const entity = await strapi.entityService.findOne(
      "api::product-category.product-category",
      ctx.params.id,
      {
        populate: shouldPopulate ? ["category", "products"] : [],
      }
    );

    if (!entity) { return { data: null } };

    return { data: transformItem(entity, shouldPopulate) };
  },

}));

//----------------------------------------------------------------------
// Helper: transformItem
//----------------------------------------------------------------------
function transformItem(item: any, includeRelations: boolean) {
  if (!item) return null;

  const base: any = {
    id: item.id,
    type: item.type,
  };

  // Example relation: product-category → category
  if (includeRelations) {
    if (item.category) {
        base.category = {
            id: item.category?.id ?? null,
            name: item.category?.name ?? null,
        };
    }

    if (item.products?.length) {
        base.products = item.products?.map((product) => {
            return {
                id: product.id,
                documentId: product.documentId,
                name: product.name,
                code: product.code,
                imageUrl: product.image_url,
                price: product.price,
                description: product.description,
                tag: product.tag
            };
        });
    };
  }

  return base;
}
