import { Router } from "./deps.ts";

import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";

const router = new Router();

router.get("/planets", ctx => {
  ctx.response.body = planets.getAllPlanets();
});

router.get("/launches", ctx => {
  ctx.response.body = launches.getAll();
});

router.get("/launches/:id", ctx => {
  if (ctx.params?.id) {
    const launchInfo = launches.getOne(Number(ctx.params.id));
    if (launchInfo) {
      ctx.response.body = launchInfo;
    } else {
      ctx.throw(400, "Launch Flight Number Does not Exist")
    }
  }
});

router.delete("/launches/:id", ctx => {
  if (ctx.params?.id) {
    const result = launches.removeOne(Number(ctx.params.id));
    ctx.response.body = { success: result };
  }
});

router.post("/launches", async ctx => {
  const body = await ctx.request.body();

  launches.addOne(body.value);

  ctx.response.body = { success: true };
  ctx.response.status = 201;
});

export default router;
