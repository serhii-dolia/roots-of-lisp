//@ts-ignore
import * as process from "node:process";
//@ts-ignore
import * as readline from "node:readline/promises";
//@ts-ignore
import { stdin as input, stdout as output } from "node:process";
import { rep } from "./lisp.mjs";
const rl = readline.createInterface({ input, output });
process.on("exit", () => {
    rl.stop();
});
const start = async () => {
    while (true) {
        try {
            console.log(rep(await rl.question("input> ")));
        }
        catch (e) {
            console.log(e.message);
            await start();
        }
    }
};
