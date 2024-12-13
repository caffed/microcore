[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / TaggedFunctionStrings

# Type Alias: TaggedFunctionStrings

> **TaggedFunctionStrings**: `Readonly`\<`string`[]\> \| `TemplateStringsArray`

Tagged template literal function parsing types. eg: const result = myTagFunction`template ${variable}`
Usage:
  const myTagFunction = () : Tagfunction => {
    return (strings: TemplateStringsArray, ...values: InlineBlocks) => {
      // your custom tagged function code here
      // the ./common/strings/interpolate function was written as a convience text parser for tagged function parameters.
      return interpolate(strings, values);
    }
  }

## Defined in

[src/types.ts:86](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/types.ts#L86)
