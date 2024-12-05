import {
  act,
} from '@testing-library/react';
import React from 'react';
import {
  randomString,
} from '../utils';
import {
  mountRootComponent,
} from './loader';

describe('loader', () => {
  it('should mount root component in "complete" state', async () => {
    const resolved = Promise.resolve();
    jest.useFakeTimers();
    await act(() => {
      const className = 'root-' + randomString();
      const rootElement = document.createElement('div');
      rootElement.classList.add(className);
      document.body.append(rootElement);
      const Component = <div className={className} />;
      mountRootComponent({Component, rootElement});
      expect(document.body.querySelector(`.${className}`)).toBeTruthy();
      return resolved;
    });
  });

  it('should mount root component in "loading" state', async () => {
    const resolved = Promise.resolve();
    Object.defineProperty(
      document,
      'readyState',
      {
        get() { return 'loading'; }
      }
    );
    jest.useFakeTimers();
    await act(() => {
      const className = 'root-' + randomString();
      const rootElement = document.createElement('div');
      rootElement.classList.add(className);
      document.body.append(rootElement);
      const Component = <div className={className} />;
      mountRootComponent({Component, rootElement});
      expect(document.body.querySelector(`.${className}`)).toBeTruthy();
      return resolved;
    });
  });
});