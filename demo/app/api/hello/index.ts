import { Elysia } from "elysia";

export default new Elysia().get("/", () => ({
  message: "Hello from Manic API!",
}));
