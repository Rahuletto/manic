export const routes = {
  '/': () => import('./routes/index.tsx'),
  '/chat': () => import('./routes/chat.tsx'),
};

export const notFoundPage = undefined;
export const errorPage = undefined;
