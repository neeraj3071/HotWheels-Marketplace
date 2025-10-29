import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  setupFiles: ["<rootDir>/tests/setupEnv.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json"
      }
    ]
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/types/**/*.d.ts"]
};

export default config;
