import { Hono } from 'hono'
import { Telegraf } from "telegraf";
import { getSevenDayForecast } from "./weather";

console.log(process.env.BOT_TOKEN)

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
    await ctx.sendMessage("No location provided")
  }

  const response = await getSevenDayForecast(location)

  await ctx.sendMessage(response)
})

bot.launch()

export default app
