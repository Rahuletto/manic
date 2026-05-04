export const routes = {
  "/": () => import("./routes/index.tsx"),
  "/chats": () => import("./routes/chats/index.tsx"),
  "/chats/:id": () => import("./routes/chats/[id].tsx"),
};

export const notFoundPage = undefined;
export const errorPage = undefined;
