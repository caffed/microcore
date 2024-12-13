/**
 * @module logger/middleware
 * Description: Default middleware for logging API
 */

import {
  AnyObject,
} from '../types';
import {
  colorEscapeCodes,
  isNode,
} from '../utils';

/**
 * Name: consoleLog
 * Description: Middleware for outputting logs via stdout/console
 * @param api 
 * @returns Middleware for console logging
 */
export const consoleLog = (api: AnyObject) => {
  return (middleware: any) => {
    return (params: AnyObject) => {
      if (api.action.type === 'LOGGER_LOG_LINE') {
        const {
          logLine,
          output,
        } = params;
        const {
          lineOptions,
          logRecord,
        } = logLine;
        const { level } = lineOptions;
        // NOTE: LogLevel 'fatal' will use console.error in this case
        output[level === 'fatal' ? 'error' : level](logRecord.formatted);
      }
      return middleware(params);
    };
  }
};

/**
 * Name: createJsonLine
 * Description: Middleware for creating a log record
 * @param api 
 * @returns Middleware for creatibg log records
 */
export const createJsonLine = (api: AnyObject) => {
  return (middleware: any) => {
    return (params: AnyObject) => {
      const {
        args,
        lineOptions,
      } = params;

      if (api.action.type === 'LOGGER_CREATE_LINE') {
        return middleware({
          lineOptions,
          logRecord: {
            raw: {
              args,
              lineOptions,
            },
            formatted: lineOptions.formatter({ args, lineOptions }),
          },
        });
      }
      return middleware(params);
    };
  }
};

/**
 * Name: createLineFormatter
 * Description: Default log line string formatter 
 * @template F - F: log line format 
 * @param params args (what to log), lineOptions, amd template (formatter function)
 * @returns string
 */
export const createLineFormatter = <
  F = string
>(params: AnyObject): F => {
  const {
    args,
    lineOptions,
    template = defaultLineTemplate,
  } = params;
  const {
    level,
    prefix,
    timeStamp,
  } = lineOptions;
  
  const escapeStart: string = isNode() ? colorEscapeCodes[level] : '';
  const escapeStop: string = isNode() ? colorEscapeCodes.stop : '';

  return template({
    args,
    escapeStart,
    escapeStop,
    level,
    prefix,
    timeStamp,
  });
};

/**
 * Name: defaultLineTemplate
 * Description: Default log line string formatter 
 * @param params 
 * @returns string
 */
export const defaultLineTemplate = (
  params : AnyObject = {}
): string => {
  const {
    args,
    escapeStart,
    escapeStop,
    level,
    prefix,
    timeStamp,
  } = params;
  const bracketInfo = [
      timeStamp.formatted,
      level.toUpperCase(),
      prefix,
    ]
    .filter(Boolean)
    .join(' | ');
  return [
    `${escapeStart}[${bracketInfo}]:`,
    JSON.stringify(args, null, 2),
    escapeStop,
  ].join(' ');
};
