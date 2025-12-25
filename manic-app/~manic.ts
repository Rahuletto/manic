import { createManicServer } from "manicjs/server";
import app from "./app/index.html";

const server = await createManicServer({ html: app });
