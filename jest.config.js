const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testMatch: ['**/?(*.)+(spec|test).[tj]s'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};