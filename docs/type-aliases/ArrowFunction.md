[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / ArrowFunction

# Type Alias: ArrowFunction

> **ArrowFunction**: [`Callable`](Callable.md)\<`null`, `any`\> \| [`Callable`](Callable.md)\<`any`, `any`\> \| [`Callable`](Callable.md)\<`any`[], `any`\>

Convience types, combination of arrow/constructor and (a)sync.
All other type use Callable or Constructable directly.

ArrowFunction: 
 - Synchronous arrow functions
AsyncArrowFunction:
 - Asynchronous arrow functions
ConstructorFunction:
 - Same as sync ArrowFunction except must be constructed ie: `function() {}` or `class {}`
AsyncConstructorFunction: 
 - Same as sync ConstructorFunction except Promise<R> as return type.
 - Either `function() : Promise<R> {}` or the class constructor or method returns a promise.

## Defined in

[src/types.ts:141](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/types.ts#L141)
