import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  // onde estão os testes
  testMatch: ["<rootDir>/tests/**/*.spec.ts"],

  // suporte aos paths @/alguma-coisa
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // configuração correta do ts-jest (sem globals)
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
};

export default config;
