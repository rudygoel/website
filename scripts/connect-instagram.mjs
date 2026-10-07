#!/usr/bin/env node
/**
 * One-time setup for the /portfolio Instagram grid (and the dashboard's IG stats).
 *
 * Asks for your Meta App ID, App Secret and a short-lived user token from the
 * Graph API Explorer, then:
 *   1. swaps the token for a long-lived one,
 *   2. finds the Facebook Page linked to @rudygoel_ and takes its Page token
 *      (a Page token made from a long-lived token does not expire),
 *   3. saves IG_TOKEN and IG_USER_ID to the Vercel project(s).
 * Secrets are typed hidden and never printed.
 *
 * Run from the repo root:  node scripts/connect-instagram.mjs
 */
import { execFileSync } from "node:child_process";
import readline from "node:readline";

const GRAPH = "https://graph.facebook.com/v23.0";
const HANDLE = "rudygoel_";
const SCOPE = "rudygoels-projects";
const PROJECTS = [
  { name: "website", cwd: new URL("..", import.meta.url).pathname },
  { name: "rudy-dashboard", cwd: `${process.env.HOME}/code/rudy-dashboard`, optional: true },
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });
let muted = false;
rl._writeToOutput = (s) => {
  if (!muted || s.includes("\n") || s.includes("\r")) rl.output.write(muted ? "\n" : s);
  else rl.output.write("*".repeat(s.length));
};

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    rl.output.write(question);
    muted = hidden;
    rl.question("", (answer) => {
      muted = false;
      resolve(answer.trim());
    });
  });
}

async function graph(path, params) {
  const res = await fetch(`${GRAPH}/${path}?${new URLSearchParams(params)}`);
  const body = await res.json();
  if (body.error) throw new Error(`Meta said: ${body.error.message}`);
  return body;
}

function setEnv(project, name, value) {
  const base = ["--cwd", project.cwd, "--scope", SCOPE];
  try {
    execFileSync("vercel", ["env", "rm", name, "production", "--yes", ...base], { stdio: "ignore" });
  } catch {
    // didn't exist yet
  }
  execFileSync("vercel", ["env", "add", name, "production", ...base], { input: value, stdio: ["pipe", "ignore", "inherit"] });
}

async function main() {
  console.log("\nConnect @" + HANDLE + " to rudygoel.com\n");
  const appId = await ask("App ID: ");
  const appSecret = await ask("App Secret (hidden): ", true);
  const shortToken = await ask("Graph API Explorer token (hidden): ", true);
  if (!appId || !appSecret || !shortToken) throw new Error("All three are needed.");

  console.log("\n1/3 Swapping for a long-lived token...");
  const long = await graph("oauth/access_token", {
    grant_type: "fb_exchange_token",
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortToken,
  });

  console.log("2/3 Finding the Page linked to @" + HANDLE + "...");
  const pages = await graph("me/accounts", {
    fields: "name,access_token,instagram_business_account{id,username}",
    limit: "100",
    access_token: long.access_token,
  });
  const linked = pages.data.filter((p) => p.instagram_business_account);
  const match = linked.find((p) => p.instagram_business_account.username?.toLowerCase() === HANDLE) ?? null;
  if (!match) {
    console.log("\nPages this token can see:");
    for (const p of pages.data) console.log(`  - ${p.name}: ${p.instagram_business_account ? "@" + p.instagram_business_account.username : "no Instagram linked"}`);
    throw new Error(
      `No Page is linked to @${HANDLE}. Check it's a Professional account linked to a Facebook Page, and that you ticked that Page when approving the token.`
    );
  }
  const igUserId = match.instagram_business_account.id;

  const check = await graph(igUserId, { fields: "username,followers_count,media_count", access_token: match.access_token });
  const debug = await graph("debug_token", { input_token: match.access_token, access_token: `${appId}|${appSecret}` });
  const expires = debug.data.expires_at ? new Date(debug.data.expires_at * 1000).toDateString() : "never";
  console.log(`   Page "${match.name}" -> @${check.username}, ${check.followers_count} followers, ${check.media_count} posts. Token expires: ${expires}`);

  console.log("3/3 Saving IG_TOKEN and IG_USER_ID to Vercel...");
  for (const project of PROJECTS) {
    if (project.optional) {
      const yes = await ask(`   Also save to the ${project.name} project (dashboard IG stats)? [Y/n] `);
      if (yes.toLowerCase().startsWith("n")) continue;
    }
    setEnv(project, "IG_TOKEN", match.access_token);
    setEnv(project, "IG_USER_ID", igUserId);
    console.log(`   saved to ${project.name}`);
  }
  console.log("\nDone. Tell Claude, and it will redeploy and check the live grid.\n");
  rl.close();
}

main().catch((err) => {
  console.error(`\n${err.message}\n`);
  rl.close();
  process.exit(1);
});
