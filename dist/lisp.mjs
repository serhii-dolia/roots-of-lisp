//@ts-ignore
import * as readline from "node:readline/promises";
//@ts-ignore
import { stdin as input, stdout as output } from "node:process";
//@ts-ignore
import * as fs from "node:fs";
import { read_str, read_str_bulk } from "./reader.mjs";
import { FUNC, func, F_SYMBOL, list, LIST, symbol, SYMBOL, T_SYMBOL, } from "./types.mjs";
import { bool } from "./helper.mjs";
import { Env } from "./env.mjs";
import { pr_str } from "./printer.mjs";
export const rl = readline.createInterface({ input, output });
const car = (_) => {
    switch (_.type) {
        case LIST:
            return _.value[0];
    }
};
const cdr = (_) => {
    switch (_.type) {
        case LIST:
            return list(_.value.slice(1));
    }
};
// list starts with Symbol lambda
const create_lambda = (_, env) => {
    const [params, expr] = _.value.slice(1);
    return func((..._) => {
        return EVAL(expr, new Env(env, params.value, _));
    });
};
const READ = (_) => {
    return read_str(_);
};
//(eval. '((label x (lambda (y) y) 'w)) '())
const EVAL = (_, env) => {
    switch (_.type) {
        case LIST: {
            if (_.value.length === 0) {
                return _;
            }
            const { value } = _.value[0];
            switch (value) {
                case "quote":
                    return _.value[1];
                case "cond":
                    const pairs = _.value.slice(1);
                    for (const pair of pairs) {
                        const res = EVAL(pair.value[0], env);
                        if (res.type === SYMBOL && res.value === T_SYMBOL.value) {
                            return EVAL(pair.value[1], env);
                        }
                    }
                    return F_SYMBOL;
                case "lambda": {
                    return create_lambda(_, env);
                }
                case "label": {
                    const [, varName, varValue] = _.value;
                    const evaluatedValue = EVAL(varValue, env);
                    env.set(varName.value, evaluatedValue);
                    return evaluatedValue;
                }
                case "defun": {
                    const [, funName, args, body] = _.value;
                    const f = func((..._) => {
                        return EVAL(body, new Env(env, args.value, _));
                    });
                    env.set(funName.value, f);
                    return f;
                }
                default:
                    const evaluatedList = list(_.value.map((v) => EVAL(v, env)));
                    let firstElement = evaluatedList.value[0];
                    if (firstElement.type !== FUNC) {
                        if (firstElement.type !== LIST) {
                            throw new Error("expected function or list with lambda");
                        }
                        if (firstElement.value[0].value !== "lambda") {
                            throw new Error("not a function. expected list with lambda");
                        }
                        else {
                            firstElement = create_lambda(firstElement, env);
                        }
                    }
                    return firstElement.value(...evaluatedList.value.slice(1));
            }
        }
        case SYMBOL:
            return env.get(_.value);
        default:
            return _;
    }
};
const REPL_ENV = new Env(null);
REPL_ENV.set("atom", func((_) => {
    switch (_.type) {
        case LIST:
            if (_.value.length === 0) {
                return T_SYMBOL;
            }
            return F_SYMBOL;
        default:
            return T_SYMBOL;
    }
}));
REPL_ENV.set("eq", func((arg1, arg2) => {
    if (arg1.type !== arg2.type) {
        return F_SYMBOL;
    }
    if (arg1.type === LIST) {
        return bool(arg1.value.length === 0 && arg2.value.length === 0);
    }
    else {
        return bool(arg1.value === arg2.value);
    }
}));
REPL_ENV.set("car", func(((_) => {
    return car(_);
})));
REPL_ENV.set("cdr", func(((_) => {
    return cdr(_);
})));
REPL_ENV.set("caar", func(((_) => {
    return car(car(_));
})));
REPL_ENV.set("cadr", func(((_) => {
    return car(cdr(_));
})));
REPL_ENV.set("caddr", func(((_) => {
    return car(cdr(cdr(_)));
})));
REPL_ENV.set("caddar", func(((_) => {
    return car(cdr(cdr(car(_))));
})));
REPL_ENV.set("cadar", func(((_) => {
    return car(cdr(car(_)));
})));
REPL_ENV.set("cons", func(((arg1, arg2) => {
    return list([arg1, ...arg2.value]);
})));
REPL_ENV.set("load-file", func(((arg) => {
    const file = fs.readFileSync(arg.value, { encoding: "utf-8" });
    const elements = read_str_bulk(file);
    for (const el of elements) {
        EVAL(el, REPL_ENV);
    }
    return symbol("done");
})));
const PRINT = (_) => {
    return pr_str(_);
};
const rep = (_) => {
    return PRINT(EVAL(READ(_), REPL_ENV));
};
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
start();
