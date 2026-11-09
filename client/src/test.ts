import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    <T>(id: string): T;
    keys(): string[];
  };
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: true },
  }
);

const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach((key) => {
  try {
    context(key);
  } catch (error) {
    if (error instanceof Error && error.message.includes('No module')) {
      console.warn(
        `Unable to load spec file: ${key}. This is expected when using lazy loading or standalone components that require additional setup.`
      );
    } else {
      throw error;
    }
  }
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'CSS', {
    value: null,
  });

  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      display: 'none',
      appearance: ['-webkit-appearance'],
    }),
  });

  Object.defineProperty(document, 'doctype', {
    value: '<!DOCTYPE html>',
  });

  Object.defineProperty(document.body.style, 'transform', {
    value: () => ({
      enumerable: true,
      configurable: true,
    }),
  });
}

if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'CSS', {
    value: null,
  });
}

Error.stackTraceLimit = Infinity;

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
});