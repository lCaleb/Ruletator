import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const build = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
  stdio: "inherit",
  env: { ...process.env, RULETATOR_STATIC_EXPORT: "true" }
});

if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

// Cloudflare applies these response headers when serving the exported files.
writeFileSync("out/_headers", "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n");
console.log("Static site ready in out/ for Cloudflare Pages.");
