# Roots of Lisp

This is the implementation of original Lisp from 1960 as described in Paul Graham's 
[article](http://www.paulgraham.com/rootsoflisp.html)

# How to use

## Building

If you just want to run the project, you don't need to build it. The dist folder is already included there.

In order to build the project, you need [Yarn V3](https://yarnpkg.com/getting-started/install).
The dependencies are already included in the .yarn folder.

in order to build the project, you can run `yarn build` or `yarn build:dev` for watch mode.

## Running

This project uses EcmaScript Modules (ESM). They are supported by the latest LTS Node versions.
In order to run the project, you can use the npm script:

`yarn start`
or
`npm start`

or simply
`node dist/lisp.mjs`

You will see the promt `input> `

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
