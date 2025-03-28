import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { formatWeeklyForecast, getSevenDayForecast, type SevenDayForecastResponse } from "../weather";

const CHANNEL_ID = process.env.CHANNEL_ID!;
const BOT_TOKEN = process.env.BOT_TOKEN!;

export const createBot = () => {
    const bot = new Telegraf(BOT_TOKEN)

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
            return await ctx.sendMessage(response)
        }

        const message = formatWeeklyForecast(response)

        return await ctx.sendMessage(message)
    })
}

export const sendOneOffMessage = async (bot: Telegraf<Context<Update>>, message: string) => {
    await bot.telegram.sendMessage(CHANNEL_ID, message)
}