export const routes = {
  '/': () => import('./routes/index.tsx'),
  '/build': () => import('./routes/build.tsx'),
};

export const notFoundPage = undefined;
export const errorPage = undefined;
