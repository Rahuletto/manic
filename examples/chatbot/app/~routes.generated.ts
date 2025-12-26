export const routes = {
  "/": () => import("./routes/index.tsx"),
  "/chat": () => import("./routes/chat.tsx"),
};
