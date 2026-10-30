import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

if (git("branch", "--show-current") !== "master") {
  console.error("Production must be deployed from master. Merge develop into master first.");
  process.exit(1);
}
if (git("status", "--porcelain")) {
  console.error("Commit or save pending changes before deploying production.");
  process.exit(1);
}

const commit = git("rev-parse", "HEAD");
if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error("Invalid Git commit.");

const build = spawnSync(process.execPath, [fileURLToPath(new URL("./build-static.mjs", import.meta.url))], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: "https://ruletator.pages.dev" }
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const args = ["--yes", "wrangler", "pages", "deploy", "out", "--project-name", "ruletator", "--branch", "master", "--commit-hash", commit, "--commit-dirty=false"];
// Windows needs cmd.exe to invoke npm's .cmd launcher. Every argument is fixed
// except the SHA, validated above; no credentials are passed on the command line.
const deploy = process.platform === "win32"
  ? spawnSync("cmd.exe", ["/d", "/s", "/c", `npx ${args.join(" ")}`], { cwd: root, stdio: "inherit" })
  : spawnSync("npx", args, { cwd: root, stdio: "inherit" });
if (deploy.error) throw deploy.error;
process.exit(deploy.status ?? 1);
