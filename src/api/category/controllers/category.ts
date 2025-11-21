/**
 * category controller
**/

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::category.category', ({ strapi }) => ({

  //----------------------------------------------------------------------
  // FIND MANY ( /api/categories )
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
  // FIND ONE ( /api/categories/:id )
  //----------------------------------------------------------------------
  async findOne(ctx) {
    const shouldPopulate = ctx.query?.populate === "*";

    const entity = await strapi.entityService.findOne(
      "api::category.category",
      ctx.params.id,
      {
        populate: shouldPopulate ? ["product_categories"] : [],
      }
    );

    if (!entity) {
      return { data: null };
    }

    return { data: transformItem(entity, shouldPopulate) };
  },

}));

//----------------------------------------------------------------------
// Helper: transformItem
//----------------------------------------------------------------------
function transformItem(item: any, includeProductCategories: boolean) {
  if (!item) return null;

  const base: any = {
    id: item.id,
    name: item.name,
  };

  if (
    includeProductCategories &&
    Array.isArray(item.product_categories)
  ) {
    base.product_categories = item.product_categories.map((pc: any) => ({
      id: pc?.id ?? null,
      type: pc?.type ?? null,
    }));
  }

  return base;
}
