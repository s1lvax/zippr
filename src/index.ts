import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";

//types
import type { Bindings } from "./types/bindings";
import type { Request } from "./types/request";
import { generateString } from "./utils/generateId";

const app = new Hono<{ Bindings: Bindings }>();
//formatting
app.use(prettyJSON());

app.get("/", async (c) => {
  return c.text(
    `Welcome to Zippr! 🚀\n\nShorten your URL using CURL:\n\ncurl -X POST -d '{'url':'https://example.com'}' ${c.req.header(
      "host"
    )}/zip`
  );
});

//redirect
app.get("/:shortUrl", async (c) => {
  const { shortUrl } = c.req.param();

  //fetch the original url from the KV
  const entry = await c.env.KV.get(shortUrl);

  if (entry) {
    //redirect to the original url
    return c.redirect(entry, 301);
  } else {
    return c.json({ error: "URL not found" });
  }
});

//create a new short url
app.post("/zip", async (c) => {
  const request = await c.req.json<Request>();
  const url = request.url;
  let randomHash = generateString();

  //check if the url is already in the KV
  const existingUrl = await c.env.KV.get(randomHash);

  //while it does exist, generate a new shortUrl
  while (existingUrl) {
    randomHash = generateString();
  }

  //store the url in the KV
  try {
    await c.env.KV.put(randomHash, url);
    const fullShortUrl = `${c.req.header("host")}/${randomHash}`;
    return c.json({ url: fullShortUrl });
  } catch (error) {
    return c.json({ error: "An error occurred while storing the URL" });
  }
});

export default app;
