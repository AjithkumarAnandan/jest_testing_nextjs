const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",

  transform: {
    ...tsJestTransformCfg,
  },
 testPathIgnorePatterns: [
    "<rootDir>/__tests__/setup.ts"
  ],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",   // supports alias imports
  },
};
 