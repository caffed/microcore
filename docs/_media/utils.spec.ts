import {
  expect as chaiExpect,
} from 'chai';
import type {
  AnyObject,
  InlineBlocks,
} from '../types';
import {
  arrayContentsRegex,
  blockCommentRegEx,
  clamp,
  colorCode,
  createNamespacedRecord,
  createProxy,
  createTimeStamp,
  enumToArray,
  fakeUuid,
  filterUndefinedFromObject,
  hexToUtf,
  interpolate,
  jsonObjectCopy,
  lineCommentRegEx,
  objectToSearchParams,
  randomHexString,
  randomInteger,
  randomString,
  removeComments,
  removeWhitespace,
  searchParamsToObject,
  updateConstObject,
  utfToHex,
} from './utils';

describe('utils', () => {
  describe('arrayContentsRegex', () => {
    it('should match a string with opening and closing brackets', async () => {
      chaiExpect('[]'.match(arrayContentsRegex)).to.not.be.null;
    });

    it('should match a string with opening and closing brackets and text in between', async () => {
      chaiExpect(`[${randomString()}]`.match(arrayContentsRegex)).to.not.be.null;
    });

    it('should not match a string without opening and closing brackets', async () => {
      chaiExpect(`${randomString()}`.match(arrayContentsRegex)).to.be.null;
      chaiExpect(`[${randomString()}`.match(arrayContentsRegex)).to.be.null;
      chaiExpect(`${randomString()}]`.match(arrayContentsRegex)).to.be.null;
    });
  });

  describe('blockCommentRegEx', () => {
    it('should match an inline block comment with no whitespace', async () => {
      chaiExpect('/**/'.match(blockCommentRegEx)).to.not.be.null;
    });

    it('should match an inline block comment with whitespace', async () => {
      chaiExpect('/* */'.match(blockCommentRegEx)).to.not.be.null;
    });

    it('should match an inline block comment with whitespace 2-1 asterisks', async () => {
      chaiExpect('/** */'.match(blockCommentRegEx)).to.not.be.null;
    });

    it('should match an inline block comment with 1-2 asterisks', async () => {
      chaiExpect('/* **/'.match(blockCommentRegEx)).to.not.be.null;
    });

    it('should match an inline block comment with text', async () => {
      chaiExpect(`/*${randomString()}*/`.match(blockCommentRegEx)).to.not.be.null;
    });

    it('should match a block comment with ext', async () => {
      chaiExpect(`/**
        ${randomString()}
      */`.match(blockCommentRegEx)).to.not.be.null;
    });

    it('should match a JSDoc block comment with text', async () => {
      chaiExpect(`
     /**
      * ${randomString()}
      */
     `.match(blockCommentRegEx)).to.not.be.null;
    });
  });

  describe('colorCode', () => {
    it('should encode correctly', async () => {
      const num = <number>randomInteger(1);
      chaiExpect(colorCode(num.toString())).to.eq( `\u001b[${num}m`);
    });
  });

  describe('clamp', () => {
    let between: number, small: number, large: number, min: number, max: number;

    beforeEach(() => {
      small = <number>randomInteger(1);
      large = <number>randomInteger(10);
      between = <number>randomInteger(6);
      min = <number>randomInteger(3);
      max = <number>randomInteger(8);
    });

    it('should return min value when under', async () => {
      chaiExpect(clamp(small, min, max)).to.eq(min);
    });

    it('should return max value when over', async () => {
      chaiExpect(clamp(large, min, max)).to.eq(max);
    });

    it('should return value when between min and max', async () => {
      chaiExpect(clamp(between, min, max)).to.eq(between);
    });
  });

  describe('createNamespacedRecord', () => {
    let keyOne: string, keyTwo: string, keyThree: string, keyFour: string,
        valueOne: string, valueTwo: string, delimeter: string;

    beforeEach(() => {
      keyOne = randomString();
      keyTwo = randomString();
      keyThree = randomString();
      keyFour = randomString();
      valueOne = randomString();
      valueTwo = randomString();
      delimeter = '/';
    });

    it('should flatten objects with 2 levels', async () => {
      const obj = {
        [keyOne]: {
          [keyTwo]: valueOne,
        },
        [keyThree]: {
          [keyFour]: valueTwo,
        },
      };

      const result = createNamespacedRecord(obj);

      chaiExpect(result).to.have.all.keys(
        `${keyOne}${delimeter}${keyTwo}`,
        `${keyThree}${delimeter}${keyFour}`,
      );
    });

    it('should flatten objects with 1 and 2 levels', async () => {
      const obj = {
        [keyOne]: {
          [keyTwo]: valueOne,
        },
        [keyThree]: valueTwo,
      };

      const result = createNamespacedRecord(obj);

      chaiExpect(result).to.have.all.keys(
        `${keyOne}${delimeter}${keyTwo}`,
        `${keyThree}`,
      );
    });
  });

  describe('createTimeStamp', () => {
    let timeStampFactory: any, timeStamp: any;

    beforeEach(() => {
      timeStampFactory = createTimeStamp();
      timeStamp = timeStampFactory();
    });

    it('should create a raw Date instance', async () => {
      chaiExpect(timeStamp.raw).to.be.instanceOf(Date);
    });

    it('should create a formatted Date string', async () => {
      chaiExpect(timeStamp.formatted).to.be.a.string;
    });
  });

  describe('enumToArray', () => {
    enum TEST {
      ONE,
      TWO,
    }
    const TEST_ARRAY = enumToArray(TEST);
    chaiExpect(TEST_ARRAY).to.include('ONE', 'TWO');
  });

  describe('fakeUuid', () => {
    it('should return as a valid UUID formated string', async () => {
      const id = fakeUuid();
      const parts = id.split('-');
      // string
      chaiExpect(id).to.be.string;
      // only a-f and 0-9 seperated by '-'
      chaiExpect(id).to.match(/[0-9a-fA-F-]/g);
      // part lengths
      chaiExpect(parts[0]).to.have.lengthOf(8);
      chaiExpect(parts[1]).to.have.lengthOf(4);
      chaiExpect(parts[2]).to.have.lengthOf(4);
      chaiExpect(parts[3]).to.have.lengthOf(4);
      chaiExpect(parts[4]).to.have.lengthOf(12);
    });
  });

  describe('filterUndefinedFromObject', () => {
    it('should remove keys of 1 depth that are undefined', async () => {
      const keyOne = randomString();
      const keyTwo = randomString();
      const keyThree = randomString();
      const keyFour = randomString();
      const valueOne = randomString();
      const valueTwo = randomString();

      const obj: AnyObject = {
        [keyOne]: {
          [keyTwo]: valueOne,
        },
        [keyThree]: valueTwo,
        [keyFour]: undefined,
      };

      const result = filterUndefinedFromObject(obj);

      chaiExpect(result).to.have.keys(keyOne, keyThree);
      chaiExpect(result).to.not.have.keys(keyFour);
    });
  });

  describe('hexToUtf', () => {
    it('should take at least 2 hex character string', async () => {
      const hex2char = randomHexString(2)
      chaiExpect(() => hexToUtf(hex2char)).to.not.throw();
      chaiExpect(() => hexToUtf(hex2char.slice(1))).to.throw();
    });

    it('should take an even hex character string', async () => {
      const even = Math.floor(Math.random() * 100 / 2) * 2;
      const hexEvenchar = randomHexString(even)
      chaiExpect(() => hexToUtf(hexEvenchar)).to.not.throw();
      chaiExpect(() => hexToUtf(hexEvenchar.slice(1))).to.throw();
    });

    it('should only accept 0-9 and a-f hex characters', async () => {
      const even = Math.floor(Math.random() * 100 / 2) * 2;
      const str = randomString(even);
      chaiExpect(() => hexToUtf(str)).to.throw();
    });
    
    it('should encode hex to UTF correctly', async () => {
      // taken from ASCII table https://en.wikipedia.org/wiki/ASCII
      chaiExpect(hexToUtf('54455354')).to.eq('TEST');
    });
  });

  describe('interpolate', function () {
    it('should interpolate strings correctly', function () {
      const testTemplateStrings = ['color: white;\n font-size: 24px;'];
      const testTemplateValues: InlineBlocks = [''];
      const testProps = {};
      const result = interpolate(testTemplateStrings, testTemplateValues, testProps);
      chaiExpect(result).to.eq('color: white;\n font-size: 24px;');
    });

    it('should interpolate strings with values correctly', function () {
      const testTemplateStrings = ['color: white;\n font-size: ', 'px;'];
      const testTemplateValues: InlineBlocks = ['24'];
      const testProps = {};
      const result = interpolate(testTemplateStrings, testTemplateValues, testProps);
      chaiExpect(result).to.eq('color: white;\n font-size: 24px;');
    });

    it('should interpolate strings and values with props correctly', function () {
      const testTemplateStrings = ['color: white;\n background-color: ', ';'];
      const testTemplateValues: InlineBlocks = [(props: any) => props.theme.color];
      const testProps = { theme: { color: 'white' } };
      const result = interpolate(testTemplateStrings, testTemplateValues, testProps);
      chaiExpect(result).to.eq('color: white;\n background-color: white;');
    });
  });

  describe('jsonObjectCopy', () => {
    let key: string, value: any, obj: AnyObject;

    beforeEach(() => {
      key = randomString(10, { filterRegex: /[0-9]/g });
      value = randomString();
      obj = {
        [key]: value,
      };
    });

    it('should copy valid JSON values', async () => {
      chaiExpect(jsonObjectCopy<AnyObject, typeof key>(obj)).to.not.be.undefined;
    });

    it('should contain the values from the original JSON', async () => {
      const copy = jsonObjectCopy<AnyObject, typeof key>(obj);
      chaiExpect(copy[key]).to.eq(value);
    });
  });

  describe('lineCommentRegEx', () => {
    it('should match a string with two consecutive forward slashes', async () => {
      chaiExpect('//'.match(lineCommentRegEx)).to.not.be.null;
    });

    it('should match a string with two consecutive forward slashes and text aftwards', async () => {
      chaiExpect(`//${randomString()}`.match(lineCommentRegEx)).to.not.be.null;
    });

    it('should not match a string without two consecutive forward slashes', async () => {
      chaiExpect(`/`.match(lineCommentRegEx)).to.be.null;
      chaiExpect(`/${randomString()}`.match(lineCommentRegEx)).to.be.null;
    });
  });

  describe('createProxy', () => {
    it('should create a proxy', async () => {
      const key = randomString(10, { filterRegex: /[0-9]/g });
      const val = randomString();
      const constantValueHandler = {
        get: (target: AnyObject) => {
          return target[key];
        },
      };
      const target = {
        [key]: val,
      };
      const proxy: AnyObject = createProxy<AnyObject>(constantValueHandler)(target);

      chaiExpect(proxy[randomString(10, { filterRegex: /[0-9]/g })]).to.eq(val);
    });
  });

  describe('objectToSearchParams', () => {
    // 2 levelsshould take an even hex character string
    // convert to strings
    let keyone: string, keytwo: string, val: string;

    beforeEach(() => {
      keyone = randomString(10, { filterRegex: /[0-9]/g });
      keytwo = randomString(10, { filterRegex: /[0-9]/g });
      val = randomString();
    });

    it('should convert JSON serializable object to a key=val string', async () => {
      const obj = {
        [keyone]: val,
      };
      chaiExpect(objectToSearchParams(obj)).to.eq(`${keyone}=${val}`);
    });

    it('should convert a multiple key JSON serializable object to a key=val string', async () => {
      const obj = {
        [keyone]: val,
        [keytwo]: val,
      };

      chaiExpect(objectToSearchParams(obj)).to.eq(`${keyone}=${val}&${keytwo}=${val}`);
    });
  });

  describe('randomHexString', () => {
    it('should only match base 16 characters', async () => {
      const str = randomHexString(10);
      chaiExpect(str).to.match(/[0-9a-fA-F]/g);
      chaiExpect(str).to.not.match(/[g-zG-Z]/g);
    });

    it('should accept even lengths', async () => {
      // const odd = Math.floor(Math.random() * 100 / 3) * 3;
      chaiExpect(() => randomHexString(3)).to.throw();
    });
  });

  describe('randomInteger', () => {
    it('should limit digit count betweeen 1-15 for non BigInt', async () => {
      chaiExpect(() => <number>randomInteger(16)).to.throw();
      chaiExpect(() => randomInteger(16, { bigint: true })).to.not.throw();
    });

    it('should return a BigInt if specified', async () => {
      chaiExpect(randomInteger(16, { bigint: true })).to.be.a('bigint');
    });

    it('should return a Number if not specified', async () => {
      chaiExpect(<number>randomInteger(15)).to.be.a('number');
    });

    it('should return a positive integer', async () => {
      chaiExpect(<number>randomInteger(15, { sign: '+'}) > 0).to.be.true;
    });

    it('should return a negative integer', async () => {
      chaiExpect(<number>randomInteger(15, { sign: '-'}) < 0).to.be.true;
    });
  });

  describe('randomString', function () {
    it('should return a 20 alpha character string', function () {
      chaiExpect(randomString().length).to.eq(20);
    });

    it('should return an arbitrary character length string', function () {
      const number = Math.floor(Math.random() * 100);
      chaiExpect(randomString(number).length).to.eq(number);
    });

    it('should return an only alpha character string', function () {
      chaiExpect(/\d+/.exec(randomString(20, { filterRegex: /[0-9]/g }))).to.be.an('null');
    });

    it('should return an alphanumeric character string', function () {
      const result = randomString(20);
      chaiExpect(/\d+/.exec(result).length).to.be.at.least(1);
      chaiExpect(/[A-Za-z]+/.exec(result).length).to.be.at.least(1);
    });
  });

  describe('removeComments', () => {
    let allCommentedString: string, blockCommentedString: string, lineCommentedString: string, str: string, unCommentedString: string;

    beforeEach(() => {
      str = randomString();
      blockCommentedString = `
        /*
          comment
        */
       ${str}
      `;
      lineCommentedString = `
      // comment
      ${str}
      `;
      allCommentedString = `
        ${blockCommentedString}
        ${lineCommentedString}
      `;
      unCommentedString = `${str}`;
    });

    it('should remove line comments', async () => {
      chaiExpect(removeComments(lineCommentedString)).to.include(str);
    });

    it('should remove block comments', async () => {
      chaiExpect(removeComments(blockCommentedString)).to.include(str);
    });

    it('should remove both line and block comments', async () => {
      chaiExpect(removeComments(allCommentedString)).to.include(str);
    });

    it('should not remove uncommented text', async () => {
      chaiExpect(removeComments(unCommentedString)).to.include(str);
    });
  });

  describe('removeWhitespace', function () {
    const correctString = 'test string';

    it('should remove whitespace', async () => {
      chaiExpect(removeWhitespace('test   string')).to.eq(correctString);
    });

    it('should trim whitespace', async () => {
      chaiExpect(removeWhitespace(' test string ')).to.eq(correctString);
    });

    it('should not affect correctly formatted string', async () => {
      const noopString = 'test string';
      chaiExpect(removeWhitespace(noopString)).to.eq(noopString);
    });
  });

  describe('searchParamsToObject', () => {
    it('should convert a URLSearchParams instance to a plain object', async () => {
      const keyOne = randomString(10, { filterRegex: /[0-9]/g });
      const keyTwo = randomString(10, { filterRegex: /[0-9]/g });
      const valOne = randomString();
      const valTwo = randomString();
      const urlParams = new URLSearchParams(`${keyOne}=${valOne}&${keyTwo}=${valTwo}`);
      const paramsObject = searchParamsToObject(urlParams);
      chaiExpect(paramsObject).to.have.keys(keyOne, keyTwo);
      chaiExpect(paramsObject[keyOne]).to.eq(valOne);
      chaiExpect(paramsObject[keyTwo]).to.eq(valTwo);
    });

    it('should convert a two level URLSearchParams instance to a plain object', async () => {
      const keyOne = randomString(10, { filterRegex: /[0-9]/g });
      const keyTwo = randomString(10, { filterRegex: /[0-9]/g });
      const valOne = randomString();
      const urlParams = new URLSearchParams(`${keyOne}.${keyTwo}=${valOne}`);
      const paramsObject = searchParamsToObject(urlParams);
      chaiExpect(paramsObject).to.have.keys(keyOne);
      chaiExpect(paramsObject).to.not.have.keys(keyTwo);
      chaiExpect(paramsObject[keyOne][keyTwo]).to.eq(valOne);
    });
  });

  describe('updateConstObject', () => {
    it('should update properties in destination object from source object', async () => {
      const keyOne = randomString(10, { filterRegex: /[0-9]/g });
      const valOne = randomString();
      const valTwo = randomString();
      const target = {
        [keyOne]: valOne,
      };
      const src = {
        [keyOne]: valTwo,
      };
      updateConstObject(target, src);
      chaiExpect(target[keyOne]).to.eq(valTwo);
    });
  });

  describe('utfToHex', () => {
    it('should convert UTF16 text to hexidecimal base16', async () => {
      // taken from ASCII table https://en.wikipedia.org/wiki/ASCII
      chaiExpect(utfToHex('TEST')).to.eq('54455354');
    });
  });
});
