/**
 * @module combinators
 * Functional Combinator lib
 * based off of https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45
 * Future versions will include practical examples where applicable.
 * NOTE: Not complete and a WIP
 * @todo Complete, streamline and integrate into other modules
 * Description: Common functional combinators
 */
import {
  ArrowFunction,
} from "../types";

/** 
 * Function:
 * @public
 * Name: noop
 * Description: Noop/N "null" or 0 combinator. Used for needing a function placeholder
 * @returns undefined
 */
export function noop(..._: any[]) {};
export const N = noop;

/**
 * Function:
 * @public
 * Name: identity
 * Description: Identity/I combinator
 * @param x: T
 * @returns x: T
 */
export const identity = <T = any>(x?: T) => x;
export const I = identity;

/**
 * Function:
 * @public
 * Name: constant
 * Description: Constant/K combinator
 * @param x: T
 * @returns () => x: T
 */
export const constant = <T = any>(x: T) => (..._: any[]) => x;
export const K = constant;

/**
 * Function:
 * @public
 * Name: apply
 * Description: Apply/A combinator
 * @param 
 * @returns
 */
export const apply = <T = any>(f: ArrowFunction) => (x: T) => f(x);
export const A = apply;

/**
 * Function:
 * @public
 * Name: thrush
 * Description: Thrush/T combinator
 * @param 
 * @returns
 */
export const thrush = <T = any>(x: T) => (f: ArrowFunction) => f(x);
export const T = thrush;

/**
 * Function:
 * @public
 * Name: duplication
 * Description: Duplication/W combinator
 * @param 
 * @returns
 */
export const duplication = <T = any>(f: ArrowFunction) => (x: T) => f(x)(x);
export const W = duplication;

/**
 * Function:
 * @public
 * Name: flip
 * Description: flip/C combinator
 * @param 
 * @returns
 */
export const flip = <T = any, U = any>(f: ArrowFunction) => (y: U) => (x: T) => f(x)(y);
export const C = flip;

/**
 * Function:
 * @public
 * Name: compose
 * Description: Compose/B combinator
 * @param 
 * @returns
 */
export const compose = <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => f(g(x));
export const B = compose;

/**
 * Function:
 * @public
 * Name: substitution
 * Description: Substitution/S combinator
 * @param 
 * @returns
 */
export const substitution = <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => f(x)(g(x));
export const S = substitution;

/**
 * Function:
 * @public
 * Name: chain
 * Description: chain/S_ combinator
 * @param 
 * @returns
 */
export const chain = <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => f(g(x))(x);
export const S_ = chain;

/**
 * Function:
 * @public
 * Name: converge
 * Description: converge/S2 combinator
 * @param 
 * @returns
 */
export const converge = <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (h: ArrowFunction) => (x: T) => f(g(x))(h(x));
export const S2 = converge;

/**
 * Function:
 * @public
 * Name: psi
 * Description: Psi/P combinator
 * @param 
 * @returns
 */
export const psi = <T = any, U = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => (y: U) => f(g(x))(g(y));
export const P = psi;

/**
 * Function:
 * @public
 * Name: FixPoint
 * Description: FixPoint/Y combinator
 * @param 
 * @returns
 */
export const fixPoint = <T = any>(f: ArrowFunction) => ((g: ArrowFunction) => g(g))((g : ArrowFunction) => f((x: T) => g(g)(x)));
export const Y = fixPoint;
