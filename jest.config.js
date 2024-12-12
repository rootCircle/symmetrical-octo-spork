import { pathsToModuleNameMapper } from 'ts-jest';

import compilerOptions from './tsconfig.json' assert { type: 'json' };

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  modulePaths: [compilerOptions.compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.compilerOptions.paths /*, { prefix: '<rootDir>/' } */,
  ),
};
