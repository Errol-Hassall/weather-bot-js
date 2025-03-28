import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { formatWeeklyForecast, getSevenDayForecast } from "./handler";
import { getContext } from 'hono/context-storage'
import { GlobalEnv } from "../index";
import { sendOneOffMessage } from "../bot";


const weatherControllers = new Hono()

const sevenDayForecastValidation = z.object({
    location: z.string(),
})

weatherControllers.get("/seven-day-forecast", validator("query", (value, c) => {
    const parsed = sevenDayForecastValidation.safeParse(value);

    if(!parsed.success) {
        return c.text("Invalid", 401)
    }

    return parsed.data
}), async (c) => {
    const bot = getContext<GlobalEnv>().var.bot

    const {location} = c.req.valid('query')

    const forecast = await getSevenDayForecast(location)

    if(typeof forecast === "string") {
        await sendOneOffMessage(bot, forecast)

        return c.json({message: forecast})
    }
    const formatedForecast = formatWeeklyForecast(forecast)

    await sendOneOffMessage(bot, formatedForecast)

    return c.json(forecast)
})

export default weatherControllers