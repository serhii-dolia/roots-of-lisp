# Roots of Lisp

This is the implementation of original Lisp from 1960 as described in Paul Graham's
[article](http://www.paulgraham.com/rootsoflisp.html)

It's done in Typescript.

While it's not the original Lisp per se, it is very close to the description in McCarthy paper.
What was added by Graham: `defun` (convenient syntactic sugar from Common Lisp) and using of empty list (`'()`) instead of symbol `f` for falsy values.
What makes it special is how with the limited set of types (symbol, list, function) and limited set of operations (quote, cond, lambda, label, eq, atom, car, cdr, cons ) one can build a language that is powerful enough to support writing its own interpreter.

You can find this interpreter in the `eval.lisp` file.

The source code is in the `src` folder:

- `lisp.mts` is where the interpreter and read-eval-print function are defined
- `printer.mts` is responsible for printing the lisp types to the terminal
- `reader.mts` is responsible for parsing the input and converting it to the lisp tyes
- `env.mts` the class object of which stores the current state of the interpreter (defined functions and variables). It's also used for creating the lexical scopes for functions
- `index.mts` is where we run the input prompt in a loop, making it a REPL

Knowledge how to do it was obtained while going through the [Make a Lisp](https://github.com/kanaka/mal) repository.

# How to use

## Building

If you just want to run the project, you don't need to build it. The dist folder is already included there.

In order to build the project, you need [Yarn V3](https://yarnpkg.com/getting-started/install).

in order to build the project, you can run `yarn build` or `yarn build:dev` for watch mode.

## Running

This project uses EcmaScript Modules (ESM). They are supported by the latest LTS Node versions.
In order to run the project, you can use the commands:

`yarn start`
or
`npm start`

or simply
`node dist/index.mjs`

You will see the promt `input> `

## Testing

This project uses the Node.js test runner from version 18.
Build the project and run `yarn test` or simply `node --test` or even `node eval.test.mjs`.

## What you can do with it

Original Lisp is a pretty poor language. It has only symbols, lists and functions.

You can try to check the equality of 2 symbols like this:

`(eq 'a 'a)`

The prompt should return you `t` which stands for true.

`(eq 'a 'b)` will return you `()`, empty list which stands for false.

You can find more information in the [original article](http://www.paulgraham.com/rootsoflisp.html)

## Why it's cool

This repository also has a file `eval.lisp`, copied from Paul Graham's website.

If you run in the prompt `(load-file 'eval.lisp)`, you will then be able to use the functions described in that file.

The most important function is `eval.`, which is the Lisp interpreter written in itself.

You can then run, for example, `(eval. '(eq 'a 'a) '())` and get the same result: `t`.

What it means: you run a Lisp interpreter that interprets the `eval.` function that can interpret any Lisp expression.
