/**
 * @module utils
 * Description: a collection of support functions for this package and elsewhere
 */

import {
  AnyObject,
  Callable,
  Json,
  ObjectKey,
  InlineBlocks,
  TaggedFunctionStrings,
} from '../types';


/**
 * Name: arrayContentsRegex
 * Description: Regex for getting contents within brackets [content] => 'content'
 */
export const arrayContentsRegex = /(?<=\[\s*).*?(?=\s*\])/gs;

/**
 * Name: blockCommentRegEx
 * Description: Regex that removes block comments
 * @public
 */
export const blockCommentRegEx = /\/\*([^)]{0,})\*\//gm;

/**
 * Name: clamp
 * Desciption: Simple number clamp
 * @public
 * @param value 
 * @param min 
 * @param max 
 * @returns number
 */
export const clamp = (
  val: number | bigint,
  min: number | bigint,
  max: number | bigint
): number | bigint => {
  return val <= min ?
    min :
      val >= max ?
      max :
        val;
};

/**
 * Name: colorCodes
 * Description: ANSI color code wrapper
 * @public
 * @param color {string}
 * @returns {string}
 */
export const colorCode = (color: string): string => `\u001b[${color}m`;

/**
 * Name: colorCodes
 * Description: ANSI color code set
 * @public
 * @typedef {Object}
 */
export const colorCodes: Record<string, string> = {
  black: colorCode('30'),
  blue: colorCode('34'),
  cyan: colorCode('36'),
  magenta: colorCode('35'),
  green: colorCode('32'),
  white: colorCode('37'),
  yellow: colorCode('33'),
  red: colorCode('31'),
  reset: colorCode('0'),
};

/**
 * Name: colorEscapeCodes
 * Description: ANSI color code set
 * @public
 * @typedef {Object}
 */
export const colorEscapeCodes: Record<string, string> = {
  debug: colorCodes.green,
  info: colorCodes.white,
  warn: colorCodes.yellow,
  error: colorCodes.magenta,
  fatal: colorCodes.red,
  stop: colorCodes.reset,
};

/**
 * Name: createNamespacedRecord
 * Description: flattens object 2 levels deep into one level with namespaced keys
 * @public
 * @param obj AnyObject to flatten
 * @param delimeter string for joining
 * @returns AnyObject
 */
export const createNamespacedRecord = (obj: AnyObject, delimeter = '/'): AnyObject => {
  return Reflect
    .ownKeys(obj)
    .reduce((acc: AnyObject, namespace: string | symbol) => {
      let actions: AnyObject = {}; 
      if (typeof obj[namespace] === 'object') {
        actions = Reflect
          .ownKeys(obj[namespace])
          .reduce((acc2: AnyObject, action: string | symbol) => {
            acc2[`${namespace.toString()}${delimeter}${action.toString()}`] = obj[namespace][action];
            return acc2
          }, {});
      } else {
        actions = {
          [namespace]: obj[namespace],
        };
      }
      return {
        ...acc,
        ...actions,
      };
    }, {});
};

/**
 * Name: createProxy
 * Description: Typed proxy constructor
 * @public
 * @param handler
 * @returns (target) => ProxyHandler
 */
export const createProxy = <
  T extends AnyObject = AnyObject
>(handler: ProxyHandler<T>) => {
  return (target: T): ProxyHandler<T> => {
    return new Proxy<T>(target, handler);
  };
};

/**
 * Name: defaultTimeStampFormatter
 * Description: SQLite format YYYY-MM-DDTHH:MM:SS.SSS https://www.sqlite.org/lang_datefunc.html
 * @private
 * @returns string
 */
const defaultTimeStampFormatter = (date: Date): string => {
  return date.toJSON();
};

/**
 * Name: TimeStamp
 * Description: Timestamp return typedef
 * @private
 * @typedef {Object}
 * @property {Date} raw
 * @property {string} formatted
 */
type TimeStamp = {
  raw: Date,
  formatted: string,
};
export const createTimeStamp = (
  formatter: Callable<Date, string> = defaultTimeStampFormatter,
) => {
  return (): TimeStamp => {
    const date = new Date();
    return {
      raw: date,
      formatted: formatter(date),
    }
  };
};

/**
 * Name: enumToArray
 * Description: Converts a TypeScript enum into an array
 * @public
 * @param val Enum
 * @returns Array<string | number>
 */
export const enumToArray = (val: any): Array<string | number> => {
  return <any>Object
    .values(val)
    .reduce((acc: any[], current) => {
      return acc.concat(current.toString()); 
    }, []);
};

/**
 * Name: fakeUuid
 * Description: Creates a UUID formatted random string.
 *  - Not universally registered through a UUID service, hence 'fake'.
 * @public
 * @returns string in UUID format
 */
export const fakeUuid = (): string => {
  return `${randomHexString(8)}-${randomHexString(4)}-${randomHexString(4)}-${randomHexString(4)}-${randomHexString(12)}`;
};

/**
 * Name: filterUndefinedFromObject
 * Description: Filters any unused properties from objects
 * @public
 * @param obj AnyObject
 * @returns AnyObject
 */
export const filterUndefinedFromObject = (obj: AnyObject): AnyObject => {
  return Reflect
    .ownKeys(obj)
    .reduce((acc: AnyObject, curr: string) => {
      if (typeof obj[curr] !== 'undefined') {
        acc[curr] = obj[curr];
      }
      return acc;
    }, {});
};

/**
 * Name: hexToUtf
 * Description: Convers a hex string into a UTF16 string
 * @public
 * @param str Hex string
 * @returns UTF16 string
 */
export const hexToUtf = (str: string): string => {
  if (
    str.length < 2 ||
    str.length % 2 !== 0 ||
    str.match(/[0-9a-fA-F]/g).length !== str.length
  ) {
    throw new Error('Hexidecimal is 0-9 and a-f characters and even length only.')
  }
  const split = str.match(/[\s\S]{1,2}/g) || [];
  return Array.from(split)
    .reduce((previous: string, current: string) => {
      return previous.concat(String.fromCharCode(parseInt(current, 16)));
    }, '');
};

/**
 * Name: interpolate
 * Description: Tagged string function parser and baseline tagged function creator
 * @public
 * @param strings Tagged Function Strings
 * @param values Tagged Function Values
 * @param props Component props
 * @returns parsed string
 */
export const interpolate = (
  strings: TaggedFunctionStrings,
  values: InlineBlocks,
  props: AnyObject = {},
): string => {
  return strings.reduce((prev: string, curr: string, idx: number) => {
    const value = values[idx];
    let evaluated = '';
    if (typeof value === 'function') {
      evaluated = value(props) ?? '';
    } else if (typeof value === 'string') {
      evaluated = value;
    }
    return prev.concat(curr, evaluated);
  }, '');
};

/**
 * Name: isNode
 * Desciption: Checks for node/deno vs browser. Not the most deterministic.
 * @public
 * @return boolean
 */
export const isNode = () => typeof process === 'object' && typeof process.versions?.node === 'string';

/**
 * Name: jsonObjectCopy
 * Description: Typed JSON cloning
 * @public
 * @param value JSOM compatible object
 * @returns Record<K, O>
 */
export const jsonObjectCopy = <
  T extends object,
  K extends keyof T,
  O extends Json = Json
>(value: T): Record<K, O> => {
  return JSON.parse(JSON.stringify(value));
};

/**
 * Name: lineCommentRegEx
 * Description: Regex that removes line comments
 * @public
 */
export const lineCommentRegEx = /\/\/.*/gm;

/**
 * Name: objectToSearchParams
 * Description: converts 2 level deep object to key=val string
 * @public
 * @param obj AnyObect 
 * @returns string
 */
export const objectToSearchParams = (obj: AnyObject) => {
  return Object.keys(jsonObjectCopy(obj))
    .reduce((acc: string[], curr: string) => {
      if (typeof obj[curr] !== 'string') {
        return acc.concat(
          Object.keys(obj[curr])
            .reduce((prevInner: string[], currInner: string) => {
              return prevInner.concat(`${curr}.${currInner}=${obj[curr][currInner]}`);
            }, [])
            .join('&')
        );
      }
      return acc.concat(`${curr}=${obj[curr]}`);
    }, [])
    .join('&');
};

/**
 * Name: randomHexString
 * Description: Creates a random string that is base 16 (only 0-9a-fA-F) characters
 * @public
 * @param length 
 * @returns 
 */
export const randomHexString = (length: number): string => {
  if (length % 2 !== 0) {
    throw new Error('Length must be even: ' + length);
  }
  return randomString(length, { filterRegex: /[g-zG-Z]/g });
};

/**
 * Name: randomInteger
 * Description: Random integer function that uses `Math.random().toString()`
 *   and converts it from a string to a number;
 * @public
 * @param digit digit count
 * @param options bigint, prefix, and sign options
 * @returns number | bigint
 */
type randomIntegerOptions = {
  bigint?: boolean;
  prefix?: string;
  sign?: '+' | '-';
};
export const randomInteger = (digit = 4, options: randomIntegerOptions = {}): bigint | number => {
  const {
    bigint = false,
    prefix = '',
    sign = '+',
  } = options;

  if (!bigint && (1 > digit || digit > 15)) {
    throw new Error(`Non-BigInt integer digit count must be with the range of 1 to 15.`);
  }
  
  const intDigit = Math.floor(digit);
  const integer = Math
    .random()
    .toString()
    .slice(2, 2 + intDigit);
  
  if (integer.length !== intDigit) {
    return randomInteger(Number(intDigit) - integer.length, {
      bigint,
      prefix: prefix.concat(integer),
      sign,
    });
  }

  const numString = sign + prefix.concat(integer);
  return bigint ? BigInt(numString) : Number(numString);
};

/**
 * Name: randomString
 * Description: Random String generator
 * @public
 * @param length Number: length of the final string
 * @param options prefix and filter options
 * @returns string
 */
type randomStringOptions = {
  prefix?: string;
  filterRegex?: RegExp;
};
export const randomString = (length = 20, { prefix = '', filterRegex }: randomStringOptions = {}): string => {
  let str = Math.random()
    .toString(36)
    .slice(2, 2 + length);
  str = filterRegex ? str.replace(filterRegex, ''): str;
  if (str.length !== length) {
    return randomString(length - str.length, { prefix: prefix.concat(str), filterRegex });
  }
  return prefix.concat(str);
};

/**
 * Name: removeComments
 * Description: remove line and block comments from strings
 * @param str String to parse
 * @returns string that has been filtered
 */
export const removeComments = (str: string): string => {
  return str
    .replace(blockCommentRegEx, '')
    .replace(lineCommentRegEx, '');
};

/**
 * Name: removeWhitespace
 * Description: Normalizes whitespsace in a string
 * @public
 * @param str string
 * @returns string
 */
export const removeWhitespace = (str: string): string => {
  return str
    // reduce contiguous spaces to maximum of one
    .replace(/\s{1,}/gm, ' ')
    // remove line breaks
    .replace(/\n/gm, '')
    .trim()
  ;
};

/**
 * Name: searchParamsToObject
 * Description: converts URLSearchParams to a 2 level deep object
 * @public
 * @param searchParams 
 * @returns Record<any, any>
 */
export const searchParamsToObject = (searchParams: URLSearchParams) => {
  const params: AnyObject = {};
  for (const [key, val] of searchParams) {
    if (key.includes('.')) {
      const [obj, k] = key.split('.');
      params[obj] = params[obj] ?? {};
      params[obj][k] = params[obj][k] ?? {};
      params[obj][k] = val;
    } else {
      params[key] = params[key] ? [params[key], val]: val;
    }
  }
  return params;
};

/**
 * Name: updateConstObject
 * Description: Used for updating each property on a const initialized object as reassignment is not allowed eg: spread operator or Object.assign
 * @public
 * @param target AnyObject of object to update
 * @param newObj
 */
export const updateConstObject = (target: AnyObject, newObj: AnyObject): void =>  {
  Object.keys(target)
    .forEach((key: ObjectKey) => {
      if (typeof newObj[key] !== 'undefined') {
        target[key] = newObj[key];
      }
    })
};

/**
 * Name: utfToHex
 * Description: Coverts human readable string into string hexadecimal version
 *   Strings are UTF-8 by default https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
 * @public
 * @param str
 * @returns {string}
 */
export const utfToHex = (str: string): string => {
  return Array
    .from(Array(str.length).keys())
    .reduce((acc: string, current: number) => {
        return acc.concat(str.charCodeAt(current).toString(16));
    }, '');
};
