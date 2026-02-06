#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import plugin from "bun-plugin-tailwind";
import { h } from "preact";
import { render as renderToString } from "preact-render-to-string";
import { App } from "./src/App";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
	console.log(`
🏗️  Bun Build Script

Usage: bun run build.ts [options]

Common Options:
  --outdir <path>          Output directory (default: "dist")
  --minify                 Enable minification (or --minify.whitespace, --minify.syntax, etc)
  --sourcemap <type>      Sourcemap type: none|linked|inline|external
  --target <target>        Build target: browser|bun|node
  --format <format>        Output format: esm|cjs|iife
  --splitting              Enable code splitting
  --packages <type>        Package handling: bundle|external
  --public-path <path>     Public path for assets
  --env <mode>             Environment handling: inline|disable|prefix*
  --conditions <list>      Package.json export conditions (comma separated)
  --external <list>        External packages (comma separated)
  --banner <text>          Add banner text to output
  --footer <text>          Add footer text to output
  --define <obj>           Define global constants (e.g. --define.VERSION=1.0.0)
  --help, -h               Show this help message

Example:
  bun run build.ts --outdir=dist --minify --sourcemap=linked --external=react,react-dom
`);
	process.exit(0);
}

type BuildConfig = Partial<Bun.BuildConfig> & Record<string, unknown>;

const toCamelCase = (str: string): string =>
	str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

const parseValue = (value: string): boolean | number | string | string[] => {
	if (value === "true") return true;
	if (value === "false") return false;

	if (/^\d+$/.test(value)) return parseInt(value, 10);
	if (/^\d*\.\d+$/.test(value)) return parseFloat(value);

	if (value.includes(",")) return value.split(",").map((v) => v.trim());

	return value;
};

function parseArgs(): BuildConfig {
	const config: BuildConfig = {};
	const args = process.argv.slice(2);

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === undefined) continue;
		if (!arg.startsWith("--")) continue;

		if (arg.startsWith("--no-")) {
			const key = toCamelCase(arg.slice(5));
			config[key] = false;
			continue;
		}

		if (
			!arg.includes("=") &&
			(i === args.length - 1 || args[i + 1]?.startsWith("--"))
		) {
			const key = toCamelCase(arg.slice(2));
			config[key] = true;
			continue;
		}

		let key: string;
		let value: string;

		if (arg.includes("=")) {
			[key, value] = arg.slice(2).split("=", 2) as [string, string];
		} else {
			key = arg.slice(2);
			value = args[++i] ?? "";
		}

		key = toCamelCase(key);

		if (key.includes(".")) {
			const [parentKey, childKey] = key.split(".") as [string, string];
			const nested = (config[parentKey] || {}) as BuildConfig;
			nested[childKey] = parseValue(value);
			config[parentKey] = nested;
		} else {
			config[key] = parseValue(value);
		}
	}

	return config;
}

const formatFileSize = (bytes: number): string => {
	const units = ["B", "KB", "MB", "GB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
};

console.log("\n🚀 Starting build process...\n");

const cliConfig = parseArgs();
const outdir = cliConfig.outdir || path.join(process.cwd(), "dist");

if (existsSync(outdir)) {
	console.log(`🗑️ Cleaning previous build at ${outdir}`);
	await rm(outdir, { recursive: true, force: true });
}

const start = performance.now();

const entrypoints = [...new Bun.Glob("**.html").scanSync("src")]
	.filter((a) => !a.includes("og-image"))
	.map((a) => path.resolve("src", a))
	.filter((dir) => !dir.includes("node_modules"));
console.log(
	`📄 Found ${entrypoints.length} HTML ${entrypoints.length === 1 ? "file" : "files"} to process\n`,
);

const result = await Bun.build({
	entrypoints,
	outdir,
	plugins: [plugin],
	minify: true,
	target: "browser",
	sourcemap: "linked",
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
	...cliConfig,
});

const end = performance.now();

const outputTable = result.outputs.map((output) => ({
	File: path.relative(process.cwd(), output.path),
	Type: output.kind,
	Size: formatFileSize(output.size),
}));

console.table(outputTable);
const buildTime = (end - start).toFixed(2);

console.log(`\n✅ Build completed in ${buildTime}ms\n`);

// --- Post-build: Pre-render ---
const indexPath = path.join(outdir as string, "index.html");
const html = await readFile(indexPath, "utf-8");
const appHtml = renderToString(h(App, null));
const wasmOutput = result.outputs.find((o) => o.path.endsWith(".wasm"));
if (wasmOutput) {
	const wasmBytes = await readFile(wasmOutput.path);
	const gzipped = Bun.gzipSync(wasmBytes);
	await Bun.write(`${wasmOutput.path}.gz`, gzipped);
	await rm(wasmOutput.path);
	console.log(
		`🗜️  Compressed WASM: ${formatFileSize(wasmBytes.length)} → ${formatFileSize(gzipped.length)}`,
	);
}
const wasmGzName = wasmOutput ? `${path.basename(wasmOutput.path)}.gz` : null;
const withPreload = wasmGzName
	? html.replace(
			"<head>\n",
			`<head>\n    <link rel="preload" as="fetch" crossorigin href="./${wasmGzName}" />\n`,
		)
	: html;
const withManifest = withPreload.replace(
	"</head>",
	'    <link rel="manifest" href="./manifest.json" />\n  </head>',
);
const preRendered = withManifest.replace(
	'<div id="root"></div>',
	`<div id="root">${appHtml}</div>`,
);
await Bun.write(indexPath, preRendered);
console.log("🖨️  Pre-rendered App into index.html");

// --- Post-build: Static files ---
const siteUrl = "https://hotaritobu.github.io/your-python/";

await Bun.write(
	path.join(outdir as string, "robots.txt"),
	`User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
);

await Bun.write(
	path.join(outdir as string, "sitemap.xml"),
	`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
  </url>
</urlset>
`,
);

const meta = (name: string) =>
	html.match(
		new RegExp(
			`<meta\\s[^>]*(?:name|property)="${name}"[^>]*content="([^"]*)"`,
		),
	)?.[1] ??
	html.match(
		new RegExp(
			`<meta\\s[^>]*content="([^"]*)"[^>]*(?:name|property)="${name}"`,
		),
	)?.[1];
const title = html
	.match(/<title>([^<]*)</)?.[1]
	?.split(/\s*[-–|]\s*/)[0]
	?.trim();
const iconOutput = result.outputs.find((o) => /logo.*\.svg$/.test(o.path));

await Bun.write(
	path.join(outdir as string, "manifest.json"),
	JSON.stringify(
		{
			name: title,
			short_name: title,
			description: meta("description"),
			start_url: "./",
			display: "standalone",
			background_color: "#f9fafb",
			theme_color: meta("theme-color"),
			icons: iconOutput
				? [
						{
							src: `./${path.basename(iconOutput.path)}`,
							sizes: "any",
							type: "image/svg+xml",
						},
					]
				: [],
		},
		null,
		2,
	),
);

await Bun.write(
	path.join(outdir as string, "og-image.png"),
	await readFile(path.join("src", "og-image.png")),
);

console.log(
	"📦 Generated robots.txt, sitemap.xml, manifest.json, og-image.png\n",
);
