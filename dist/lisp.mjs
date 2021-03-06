import * as fs from "node:fs";
import { read_str, read_str_bulk } from "./reader.mjs";
import { FUNC, LIST, SYMBOL, } from "./types.mjs";
import { bool, func, F_SYMBOL, is_empty, list, symbol, T_SYMBOL, } from "./helper.mjs";
import { Env } from "./env.mjs";
import { pr_str } from "./printer.mjs";
const car = (_) => _.value[0];
const cdr = (_) => list(_.value.slice(1));
// list starts with Symbol lambda
const create_lambda = (_, env) => {
    const [params, expr] = _.value.slice(1);
    return func((..._) => EVAL(expr, new Env(env, params.value, _)));
};
const READ = (_) => read_str(_);
const EVAL = (_, env) => {
    switch (_.type) {
        case LIST: {
            if (is_empty(_)) {
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
                    const f = func((..._) => EVAL(body, new Env(env, args.value, _)));
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
                        firstElement = create_lambda(firstElement, env);
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
            return bool(is_empty(_));
        default:
            return T_SYMBOL;
    }
}));
REPL_ENV.set("eq", func(({ type: type1, value: value1 }, { type: type2, value: value2 }) => {
    if (type1 !== type2) {
        return F_SYMBOL;
    }
    return type1 === LIST
        ? bool(is_empty(value1) && is_empty(value2))
        : bool(value1 === value2);
}));
REPL_ENV.set("car", func(car));
REPL_ENV.set("cdr", func(cdr));
REPL_ENV.set("caar", func(((_) => car(car(_)))));
REPL_ENV.set("cadr", func(((_) => car(cdr(_)))));
REPL_ENV.set("cdar", func(((_) => cdr(car(_)))));
REPL_ENV.set("caddr", func(((_) => car(cdr(cdr(_))))));
REPL_ENV.set("caddar", func(((_) => car(cdr(cdr(car(_)))))));
REPL_ENV.set("cadar", func(((_) => car(cdr(car(_))))));
REPL_ENV.set("cons", func(((arg1, arg2) => list([arg1, ...arg2.value]))));
REPL_ENV.set("load-file", func(((arg) => {
    const elements = read_str_bulk(fs.readFileSync(arg.value, { encoding: "utf-8" }));
    elements.map((e) => EVAL(e, REPL_ENV));
    return symbol("done");
})));
const PRINT = (_) => pr_str(_);
export const rep = (_) => PRINT(EVAL(READ(_), REPL_ENV));
