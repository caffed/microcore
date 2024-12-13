[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / Callable

# Type Alias: Callable\<P, V\>

> **Callable**\<`P`, `V`\>: `P` *extends* `never` \| `null` \| `undefined` ? () => `V` : `P` *extends* `any`[] ? (...`args`) => `V` : `P` *extends* `any` ? (`arg`) => `V` \| (`arg`?) => `V` : `unknown`

Callable<Parameters, ReturnType>
- Used for defining signatature of function: parameters and return type.
- Use tuple types for variadic signatures
  example: `type funcParams = [arg: string, ...options?: any[]];`
            Callable<funcParams, OtherType>
- Usage:
   type CallableFunction = Callable<null, string>;
   const myFunc : CallableFunction = () : string => {
     return 'string';
   }

## Type Parameters

• **P** = `any`

• **V** = `any`

## Defined in

[src/types.ts:101](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/types.ts#L101)
