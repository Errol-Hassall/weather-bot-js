import { Hono } from 'hono'
import { createBot } from "./bot";
import weatherControllers from "./weather/controller";

const app = new Hono()

app.get('/healthy', (c) => {
  return c.text('healthy')
})

app.route("/weather", weatherControllers)

createBot().launch()

export default app
