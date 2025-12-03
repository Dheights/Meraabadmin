import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::homepage.homepage', ({ strapi }) => ({
    async find(ctx) {
        const data = await strapi.entityService.findOne(
            'api::homepage.homepage',
            1,
            {
                populate: {
                    heroBanner: {
                        populate: {
                            image: true,
                            product: {
                                populate: ["images", "product_category", "artisanProfileImage"],
                            },
                            category: {
                                populate: ["product_categories"],
                            },
                        }
                    },
                    productCategories: { populate: ["category", "image"] },
                    newDrops: { populate: ["category", "image"] },
                    productCategoryCollection: { populate: ["category", "image", "product"] },
                    visitStore: { populate: "*" },
                }
            }
        );

        return { data, meta: {} };
    },
}));
