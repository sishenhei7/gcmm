#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};

// package.json
var package_exports = {};
__export(package_exports, {
  author: () => author,
  bin: () => bin,
  default: () => package_default,
  dependencies: () => dependencies,
  devDependencies: () => devDependencies,
  engines: () => engines,
  husky: () => husky,
  license: () => license,
  "lint-staged": () => lint_staged,
  name: () => name,
  repository: () => repository,
  scripts: () => scripts,
  type: () => type,
  version: () => version
});
var name, version, type, bin, scripts, lint_staged, husky, engines, repository, author, license, devDependencies, dependencies, package_default;
var init_package = __esm({
  "package.json"() {
    name = "gcmm";
    version = "1.0.0";
    type = "module";
    bin = "dist/cli.js";
    scripts = {
      dev: "tsup ./src/cli.ts --watch src --format esm",
      build: "tsup ./src/cli.ts --clean --format esm",
      test: 'echo "Error: no test specified" && exit 1',
      lint: "eslint '*/**/*.{js,ts,tsx}' --fix",
      changelog: "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
    };
    lint_staged = {
      "*.{js,ts,tsx}": [
        "prettier --write",
        "eslint --fix"
      ]
    };
    husky = {
      hooks: {
        "pre-commit": "lint-staged",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
      }
    };
    engines = {
      node: "^12.20.0 || ^14.13.1 || >=16.0.0"
    };
    repository = "git@github.com:sishenhei7/gcmm.git";
    author = "yangzhou <zhou.yang@klook.com>";
    license = "MIT";
    devDependencies = {
      "@commitlint/cli": "^13.1.0",
      "@commitlint/config-conventional": "^13.1.0",
      "@types/clui": "^0.3.1",
      "@types/configstore": "^5.0.1",
      "@types/figlet": "^1.5.4",
      "@types/node": "^16.6.2",
      "@typescript-eslint/eslint-plugin": "^4.29.2",
      "@typescript-eslint/parser": "^4.29.2",
      "conventional-changelog-cli": "^2.1.1",
      eslint: "^7.32.0",
      "eslint-config-prettier": "^8.3.0",
      "eslint-plugin-prettier": "^3.4.0",
      husky: "^7.0.1",
      "lint-staged": "^11.1.2",
      nodemon: "^2.0.12",
      prettier: "^2.3.2",
      typescript: "^4.3.5"
    };
    dependencies = {
      chalk: "^4.1.2",
      commander: "^8.1.0",
      configstore: "^6.0.0",
      figlet: "^1.5.2",
      leven: "^4.0.0",
      tsup: "^4.14.0"
    };
    package_default = {
      name,
      version,
      type,
      bin,
      scripts,
      "lint-staged": lint_staged,
      husky,
      engines,
      repository,
      author,
      license,
      devDependencies,
      dependencies
    };
  }
});

// src/cli.ts
import chalk2 from "chalk";
import { Command } from "commander";

// src/actions.ts
import { execSync } from "child_process";
import configstore from "configstore";
var store = new configstore("gcmm");
function actionAdd(alias, name2, email) {
  store.set(alias, JSON.stringify({ name: name2, email }));
  log(["", `Add ${alias}: ${name2} ${email} success!`, ""]);
}
async function actionLs() {
  const infos = [""];
  const allConfigs = store.all;
  const allAliases = Object.keys(allConfigs);
  const maxAliasLen = Math.max(...allAliases.map((alias) => alias.length));
  const allNames = Object.values(allConfigs).map((str) => JSON.parse(str).name);
  const maxNameLen = Math.max(...allNames.map((name2) => name2.length));
  const currentName = execSync("git config user.name", { encoding: "utf-8" }).toString().trim();
  const currentEmail = execSync("git config user.email", { encoding: "utf-8" }).toString().trim();
  allAliases.forEach((alias) => {
    const { name: name2, email } = JSON.parse(allConfigs[alias]);
    const prefix = currentName === name2 && currentEmail === email ? "*" : " ";
    const aliasInfo = `${alias}: ${drawBlank(alias, maxAliasLen)}`;
    const nameInfo = `${name2} ${drawLine(name2, maxNameLen)}`;
    infos.push(`${prefix} ${aliasInfo} ${nameInfo} ${email}`);
  });
  infos.push("");
  log(infos);
}
function actionUse(alias, { global = false }) {
  if (store.has(alias)) {
    const { name: name2, email } = JSON.parse(store.get(alias));
    const prefix = global ? " --global" : "";
    execSync(`git config ${prefix} user.name ${name2}`);
    execSync(`git config ${prefix} user.email ${email}`);
    log(["", `Git config has been set to ${name2} ${email}${global ? " globally" : ""}`, ""]);
  }
}
function actionRemove(alias) {
  if (store.has(alias)) {
    store.delete(alias);
    log(["", `Delete ${alias} success!`, ""]);
  }
}
function log(infos) {
  infos.forEach((info) => console.log(info));
}
function drawBlank(key, maxLen) {
  const len = maxLen - key.length + 1;
  return Array(len).join(" ");
}
function drawLine(key, maxLen) {
  const len = maxLen - key.length + 3;
  return Array(len).join("-");
}

// src/utils.ts
import chalk from "chalk";
import figlet from "figlet";
import leven from "leven";
function suggestCommands(commands, unknownCommand) {
  let suggestion = "";
  const availableCommands = commands.map((cmd) => cmd.name());
  availableCommands.forEach((cmd) => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || "", unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}

// src/cli.ts
var program = new Command();
program.version(`gcmm ${(init_package(), package_exports).version}`).usage("<command> [options]");
program.command("add <alias> <name> <email>").description("Add one custom git registry").action(actionAdd);
program.command("ls").description("List all the git registries").action(actionLs);
program.command("use <alias>").description("Change registry to registry").option("-g, --global", "Whether the command is global").action(actionUse);
program.command("remove <alias>").description("Remove one custom registry").action(actionRemove);
program.arguments("<command>").action((cmd) => {
  program.outputHelp();
  console.log(`  ` + chalk2.red(`Unknown command ${chalk2.yellow(cmd)}.`));
  console.log();
  suggestCommands(program.commands, cmd);
});
program.on("--help", () => {
  console.log();
  console.log(`  Run ${chalk2.cyan(`gcmm <command> --help`)} for detailed usage of given command.`);
  console.log();
});
program.commands.forEach((c) => c.on("--help", () => console.log()));
program.parse(process.argv);
