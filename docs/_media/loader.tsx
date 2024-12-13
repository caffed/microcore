/**
 * @module react/loader
 * Description: Convenience React root component mounter
 */

import {
  ReactNode,
} from 'react';
import {
  createRoot,
} from 'react-dom/client';
import type {
  Callable,
} from '../types';

/**
 * Name: RenderFunc
 * Description: Logger API type definition
 * @private
 * @typedef {typeof Function} RenderFunc
 */
type RenderFunc = Callable<RenderFuncParams, void>;

/**
 * Description: Logger API type definition
 * @public
 * @template F - F: log line format 
 * @typedef {Object}
 * @property {typeof Function} log
 * @property {typeof Function} updateOptions
 */
type RenderFuncParams = {
  Component: ReactNode;
  rootElement: RootElement;
};

type RootElement = Element | DocumentFragment | string;

const defaultRender = (params: RenderFuncParams) => {
  const {
    Component,
    rootElement,
  } = params;

  let el;
  if (typeof rootElement === 'string') {
    el = document.body.querySelector(rootElement);
    if (!el) {
      throw new Error(`Root Element query selector is invalid: ${rootElement}`);
    }
  } else {
    el = rootElement;
  }
  const root = createRoot(el);
  root.render(Component);
};

type MountRootComponentParams = {
  logger?: Callable<any[], void>;
  renderFunc?: RenderFunc;
} & RenderFuncParams;

/**
 * Universal loader for Component root
 * @param Comp
 * @param rootElement
 */
export const mountRootComponent = (params: MountRootComponentParams) : boolean => {
  const {
    Component,
    logger = globalThis.console.warn,
    rootElement,
    renderFunc = defaultRender,
  } = params;
  try {
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
     * There are three states: loading, interactive, and complete.
     * The DOM is accessible in the 'complete', and 'interactive' states.
     */
    if (['complete', 'interactive'].includes(document.readyState)) {
      // Add render to event queue
      setTimeout(() => renderFunc({ Component, rootElement }), 0);
    } else {
      /**
       * DOMContentLoaded event has not yet fired. Still in 'loading' readyState.
       * Add an event listener that removes itself when complete.
       */
      const loader = () => {
        renderFunc({ Component, rootElement });
        globalThis.removeEventListener('DOMContentLoaded', loader);
      };
      globalThis.addEventListener('DOMContentLoaded', loader);
    }
    // Success-ish
    return true;
  } catch (err: any) {
    logger(err);
    // Failure
    return false;
  }
};
