import { serve } from "$std/http/server.ts";
import { Hono } from "hono/mod.ts";
import { logger } from "hono/middleware.ts";

const db = await Deno.openKv();
const app = new Hono();

app.use("*", logger());

app.get("/", (c) => {
	return c.text("API deployed using Deno Deploy; Services powered by Deno KV.");
})

app.get("/views", async (c) => {
	// Increment views
	await db.atomic().sum(["views"], 1n).commit();

	// Get views
	const res = await db.get<number>(["views"]);
	const views = res.value!;

	return c.text(`${views}`);
});

serve(app.fetch);
