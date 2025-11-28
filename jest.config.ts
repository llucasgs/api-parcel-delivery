import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  // onde estão os testes
  roots: ["<rootDir>/src", "<rootDir>/tests"],

  // quais arquivos são testes
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],

  // suporte ao alias "@/"
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  clearMocks: true,
  coverageProvider: "v8",
};

export default config;
