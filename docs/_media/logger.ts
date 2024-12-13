/**
 * @module logger
 * Description: Generic logging API with middleware support
 */

import {
  createMiddlewareApi,
  type MiddlewareParams,
} from "../middleware";
import type {
  AnyObject,
  Callable,
} from "../types";
import {
  createTimeStamp,
} from '../utils';
import {
  consoleLog,
  createJsonLine,
  createLineFormatter,
} from "./middleware";

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/console
 * Description: Console interface. Deprecated and experimental functions are excluded
 * @public
 * @typedef {Object} Console
 */
export type Console = {
  assert: Callable<any[], void>;
  clear: Callable<any[], void>;
  count: Callable<any[], void>;
  countReset: Callable<any[], void>;
  debug: Callable<any[], void>;
  dir: Callable<any[], void>;
  dirxml: Callable<any[], void>;
  error: Callable<any[], void>;
  // While an error can be recovered from, fatal cannot
  fatal: Callable<any[], void>;
  group: Callable<any[], void>;
  groupCollapsed: Callable<any[], void>;
  groupEnd: Callable<any[], void>;
  info: Callable<any[], void>;
  log: Callable<any[], void>;
  table: Callable<any[], void>;
  time: Callable<any[], void>;
  timeEnd: Callable<any[], void>;
  timeLog: Callable<any[], void>;
  trace: Callable<any[], void>;
  warn: Callable<any[], void>;
};

/**
 * Name: LineOptions
 * Description: Line options used for logging lines through the API
 *  The `formatter` is used to create, most likely, a string.
 *  The `level` sets the severity
 *  The `prefix` identifies what is logging 
 *  The `timeStamp` represents the timestamp of the loglne
 * @public
 * @template F - F: log line format 
 * @typedef {Object} LineOptions<F> 
 * @property {typeof Function} formatter
 * @property {LogLevel} level
 * @property {string} prefix 
 */
export type LineOptions<F = string> = {
  formatter: Callable<any[], F>;
  level: LogLevel;
  prefix: string;
  timeStamp: {
    raw: Date;
    formatted: string;
  };
};

/**
 * Description: Logger API type definition
 * @public
 * @template F - F: log line format 
 * @typedef {Object} Logger<F> 
 * @property {typeof Function} log
 * @property {typeof Function} updateOptions
 */
export type Logger<F = string> = {
  log: (...args: any[]) => void;
  updateOptions: (params: LoggerParams<F>) => void;
}

/**
 * Name: LOGGER_ACTIONS
 * Description: Logger API actions
 * @public
 * @readonly
 * @enum {string}
 */
export enum LOGGER_ACTIONS  {
  LOGGER_CREATE_LINE = 'LOGGER_CREATE_LINE',
  LOGGER_LOG_LINE = 'LOGGER_LOG_LINE',
}

/**
 * Name: LogLevel
 * Description: LogLevel type definition
 * @public
 * @typedef {'debug' | 'info' | 'warn' | 'error' | 'fatal'} string
 */
export type LogLevel =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

/**
 * Name: LoggerParams<F>
 * Description: params for `createLogger<F>`
 * @private
 * @template F - F: log line format 
 * @typedef {typeof Function} formatter
 * @typedef {LogLevel} level
 * @typedef {AnyObject} middlewareOptions
 * @typedef {string} prefix
 * @typedef {Console} output
 */
type LoggerParams<F = string> = {
  formatter?: Callable<any, F>;
  level?: LogLevel;
  middlewareOptions?: AnyObject,
  prefix?: string;
  output?: Console | Callable<any, F>;
};

/**
 * Name: LogRecord<T>
 * Description: params for `createLogger<F>`
 * @public
 * @template F - F: log line format 
 * @typedef {AnyObject} raw
 * @typedef {T} formatted
 */
export type LogRecord<T = string> = {
  raw: AnyObject;
  formatted?: T;
};

/**
 * Name: createLogger<F>
 * Description: Creates a middleware enabled Logger
 * @public
 * @template F - F: log line format 
 * @param params LoggerParams<F> & MiddlewareParams
 * @returns Logger<F>
 */
export const createLogger = <
  F = string
>(
  params: LoggerParams<F> & MiddlewareParams = {}
): Logger<F> => {
  let {
    formatter = createLineFormatter<F>,
    level = 'info',
    prefix = '',
    output = globalThis.console,
  } = params;
  const {
    createApi,
    middleware = [
      { middleware: consoleLog },
      { middleware: createJsonLine },
    ],
    middlewareOptions = {},
    sort,
    transform,
  } = params;

  const api = createMiddlewareApi({
    createApi,
    middleware,
    sort,
    transform,
  });

  return {
    updateOptions(params: LoggerParams<F> = {}): void {
      formatter = params.formatter || formatter;
      level = params.level || level;
      prefix = params.prefix || prefix;
      output = params.output || output;
    },
    log(...args: any[]) : void {
      const timeStamp = createTimeStamp()();
      const lineOptions : LineOptions<F> = {
        formatter,
        level,
        prefix,
        timeStamp,
      };
      const logLine = api({
          action: {
            data: {
              options: middlewareOptions,
            },
            type: LOGGER_ACTIONS.LOGGER_CREATE_LINE,
          },
        }).middleware({
          args,
          lineOptions,
        });
      api({
        action: {
          data: {
            options: middlewareOptions,
          },
          type: LOGGER_ACTIONS.LOGGER_LOG_LINE,
        },
      }).middleware({
        logLine,
        output,
      });
    },
  };
}

export default createLogger;
