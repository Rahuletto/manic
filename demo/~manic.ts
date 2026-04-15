import { createManicServer } from "manicjs/server";
import app from "./app/index.html";

const server = await createManicServer({ html: app });

// ~manic-touch: 1776274387062