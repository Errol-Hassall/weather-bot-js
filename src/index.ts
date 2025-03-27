import { Hono } from 'hono'
import { createBot } from "./bot";

const app = new Hono()

app.get('/healthy', (c) => {
  return c.text('healthy')
})

createBot().launch()

export default app
