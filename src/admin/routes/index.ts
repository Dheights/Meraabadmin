// src/admin/routes/index.ts
export default [
    {
      path: '/',
      exact: true,
      // Strapi expects a loader that returns a module-like object { default: Component }
      // We return a function that will be used by the admin router to mount the component.
      component: async () => {
        const mod = await import('../pages/Dashboard');
        const component = (mod && (mod as any).default) ? (mod as any).default : (mod as any);
        return { default: component };
      },
    },
  ];
  