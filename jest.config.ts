import { JestConfigWithTsJest } from "ts-jest";
import { defaults as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>'],
  transform: {
    ...tsjPreset.transform
  },
  testMatch: ['<rootDir>/tests/**/*.ts'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1',
    '^@test/(.+)': '<rootDir>/arc/tests/$1',
  },
};

export default jestConfig;