import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { getSevenDayForecast } from "./handler";

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
    const {location} = c.req.valid('query')

    const forecast = await getSevenDayForecast(location)

    return c.json(forecast)
})

export default weatherControllers