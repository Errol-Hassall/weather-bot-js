import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { getSevenDayForecast } from "../weather";

export const createBot = () => {
    const bot = new Telegraf(process.env.BOT_TOKEN!)

    constructBotCommands(bot)

    return bot
}

const constructBotCommands = ( bot: Telegraf<Context<Update>>) => {
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
}