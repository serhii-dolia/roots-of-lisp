//@ts-ignore
import process from "node:process";
//@ts-ignore
import * as readline from "node:readline/promises";
//@ts-ignore
import { stdin as input, stdout as output } from "node:process";
import { rep } from "./lisp.mjs";

const rl = readline.createInterface({ input, output });
process.on("exit", () => {
  rl.close();
});

const start = async () => {
  while (true) {
    try {
      console.log(rep(await rl.question("input> ")));
    } catch (e: any) {
      console.log(e.message);
      await start();
    }
  }
};

start();
