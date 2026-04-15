import { createManicServer } from "manicjs/server";
import app from "./app/index.html";

const _server = await createManicServer({ html: app });

// ~manic-touch: 1776275887608