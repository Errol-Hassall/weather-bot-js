import { Hono } from 'hono'
import { Telegraf } from "telegraf";
import { getSevenDayForecast } from "./weather";

const bot = new Telegraf(process.env.BOT_TOKEN!)

const app = new Hono()

app.get('/healthy', (c) => {
  return c.text('healthy')
})

bot.command('help', async (ctx) => {
  await ctx.sendMessage("Help im a fucking bot")
})

bot.command('forecast', async (ctx) => {
  const location = ctx.payload

  if(!location) {
    return await ctx.sendMessage("No location provided")
  }

  const response = await getSevenDayForecast(location)

  return await ctx.sendMessage(response)
})

bot.launch()

export default app
