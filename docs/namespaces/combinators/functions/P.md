[**@caffedpkg/microcore**](../../../README.md)

***

[@caffedpkg/microcore](../../../globals.md) / [combinators](../README.md) / P

# Function: P()

> **P**\<`T`, `U`\>(`f`): (`g`) => (`x`) => (`y`) => `any`

Function:

Name: psi
Description: Psi/P combinator

## Type Parameters

• **T** = `any`

• **U** = `any`

## Parameters

### f

[`ArrowFunction`](../../../type-aliases/ArrowFunction.md)

## Returns

`Function`

### Parameters

#### g

[`ArrowFunction`](../../../type-aliases/ArrowFunction.md)

### Returns

`Function`

#### Parameters

##### x

`T`

#### Returns

`Function`

##### Parameters

###### y

`U`

##### Returns

`any`

## Defined in

[src/combinators/combinators.ts:143](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/combinators/combinators.ts#L143)
