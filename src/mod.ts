import { log, Application, send } from "./deps.ts";

import api from './api.ts';

const app = new Application();

const PORT = 8000;

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
});

app.addEventListener("error", event => {
  log.error(event.error)
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.body = "Internal Server Error";
    throw err;
  }
});

app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get("X-Response-Time")
  log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.use(async ctx => {
  let filePath = ctx.request.url.pathname;  
  const fileWhitelist = [
    "/index.html",
    "/404.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/stylesheets/reset.css",
    "/images/favicon.png",
    "/images/lost-rocket.svg",
    "/media/space.mp4"
  ];
  if (filePath === '/') {
    filePath = "/index.html";
  }

  if (!fileWhitelist.includes(filePath)) {
    filePath = "/404.html";
  }
  
  if (fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/public`
    });
  }
})

if (import.meta.main) {
  log.info(`Starting server on port ${PORT}...`);
  await app.listen({
    port: PORT,
  });
};