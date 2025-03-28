import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { formatWeeklyForecast, getSevenDayForecast, type SevenDayForecastResponse } from "../weather";

export const createBot = () => {
    const bot = new Telegraf(process.env.BOT_TOKEN!)

    constructBotCommands(bot)

    return bot
}

const constructBotCommands = ( bot: Telegraf<Context<Update>>) => {
    bot.command('forecast', async (ctx) => {
        const location = ctx.payload

        if(!location) {
            return await ctx.sendMessage("No location provided")
        }

        const response = await getSevenDayForecast(location)

        if(typeof response === "string") {
            return await ctx.sendMessage("There was an error getting the weather report")
        }

        const message = formatWeeklyForecast(response)

        return await ctx.sendMessage(message)
    })
}