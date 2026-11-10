import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";

const pages = ["index", "detail", "favorite"];

const cleanUrls: Plugin = {
	name: "clean-urls",
	configureServer(server) {
		server.middlewares.use((req, _res, next) => {
			const page = req.url?.split("?")[0]?.slice(1);
			if (page && pages.includes(page)) req.url = `/${page}.html`;
			next();
		});
	},
};

export default defineConfig({
	root: "src",
	plugins: [cleanUrls],
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		rollupOptions: {
			input: Object.fromEntries(pages.map((page) => [page, resolve(import.meta.dirname, `src/${page}.html`)])),
		},
	},
});
