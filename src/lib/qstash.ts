import { Client } from "@upstash/qstash";

export const qstashClient = new Client({
  baseUrl: process.env.QSTASH_BASE_URL!,
  token: process.env.QSTASH_TOKEN!,
})

await qstashClient.publish({
  url: "https://irtazaprinters.com",
})