import test from "node:test";
import assert from 'node:assert/strict';
import { rep } from "./dist/lisp.mjs"

const t = "t";
const f = "()";

const cases = [
  ["(quote a)", "a"],
  ["'a", "a"],
  ["(quote (a b c))", "(a b c)"],

  ["(atom 'a)", t],
  ["(atom '(a b c))", f],
  ["(atom '())", t],
  ["(atom (atom 'a))", t],
  ["(atom '(atom 'a))", f],

  ["(eq 'a 'a)", t],
  ["(eq 'a 'b)", f],
  ["(eq '() '())", t],

  ["(car '(a b c))", "a"],

  ["(cdr '(a b c))", "(b c)"],

  ["(cons 'a '(b c))", "(a b c)"],
  ["(cons 'a (cons 'b (cons 'c '())))", "(a b c)"],
  ["(car (cons 'a '(b c)))", "a"],
  ["(cdr (cons 'a '(b c)))", "(b c)"],

  ["(cond ((eq 'a 'b) 'first) ((atom 'a) 'second))", "second"],

  ["((lambda (x) (cons x '(b))) 'a)", "(a b)"],
  ["((lambda (x y) (cons x (cdr y))) 'z '(a b c))", "(z b c)"],

  ["((lambda (f) (f '(b c))) '(lambda (x) (cons 'a x)))", "(a b c)"],

  ["(label subst (lambda (x y z) (cond ((atom z) (cond ((eq z y) x) ('t z))) ('t (cons (subst x y (car z)) (subst x y (cdr z)))))))", "#<function>"],
  ["(subst 'm 'b '(a b (a b c) d))", "(a m (a m c) d)"],

  ["(defun subst (x y z) (cond ((atom z) (cond ((eq z y) x) ('t z))) ('t (cons (subst x y (car z)) (subst x y (cdr z))))))", "#<function>"],
  ["(subst 'm 'b '(a b (a b c) d))", "(a m (a m c) d)"],

  ["(cadr '((a b) (c d) e))", "(c d)"],
  ["(caddr '((a b) (c d) e))", "e"],
  ["(cdar '((a b) (c d) e))", "(b)"],

  ["(load-file 'eval.lisp)", "done"],

  ["(null. 'a)", f],
  ["(null. '())", t],

  ["(and. (atom 'a) (eq 'a 'a))", t],
  ["(and. (atom 'a) (eq 'a 'b))", f],

  ["(not. (eq 'a 'a))", f],
  ["(not. (eq 'a 'b))", t],

  ["(append. '(a b) '(c d))", "(a b c d)"],
  ["(append. '() '(c d))", "(c d)"],

  ["(pair. '(x y z) '(a b c))", "((x a) (y b) (z c))"],

  ["(assoc. 'x '((x a) (y b)))", "a"],
  ["(assoc. 'x '((x new) (y b)))", "new"],

  //EVAL
  ["(eval. 'x '((x a) (y b)))", "a"],
  ["(eval. '(eq 'a 'a) '())", t],
  ["(eval. '(cons x '(b c)) '((x a) (y b)))", "(a b c)"],
  ["(eval. '(cond ((atom x) 'atom) ('t 'list)) '((x '(a b))))", "list"],
  ["(eval. '(f '(b c)) '((f (lambda (x) (cons 'a x)))))", "(a b c)"],
  ["(eval. '((label firstatom (lambda (x) (cond ((atom x) x) ('t (firstatom (car x)))))) y) '((y ((a b) (c d)))))", "a"],
  ["(eval. '((lambda (x y) (cons x (cdr y))) 'a '(b c d)) '())", "(a c d)"]

]
test('cases', (t) => {
  for (const [arg, res] of cases) {
      assert.strictEqual(rep(arg), res)
  }
});
