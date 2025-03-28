import { Hono } from 'hono'
import { createBot } from "./bot";
import weatherControllers from "./weather/controller";
import { contextStorage } from 'hono/context-storage'

const bot = createBot()

export type GlobalEnv = {
  Variables: {
    bot: typeof bot,
  }
}

bot.launch()

const app = new Hono<GlobalEnv>()

app.use(contextStorage())

app.get('/healthy', (c) => {
  return c.text('healthy')
})

app.use(async (ctx, next) => {
  ctx.set("bot", bot)

  await next()
})

app.route("/weather", weatherControllers)


export default app
