[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / Constructable

# Type Alias: Constructable\<P, V\>

> **Constructable**\<`P`, `V`\>: `P` *extends* `never` \| `null` \| `undefined` ? () => `V` : `P` *extends* `any`[] ? (...`args`) => `V` : `P` *extends* `any` ? (`arg`) => `V` : `unknown`

Constructable<Parameters, ReturnType>
- Used for defining signatature of a constructable function: parameters and return type.
- Use tuple types for variadic signatures
  example: `type funcParams = [arg: string, ...options?: any[]];`
            Constructable<funcParams, OtherType>
- Usage:
   type ConstructableFunction = Constructable<null, string>;
   const myFunc : ConstructableFunction = function() : string => {
     return 'string';
   }

## Type Parameters

• **P** = `any`

• **V** = `any`

## Defined in

[src/types.ts:120](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/types.ts#L120)
