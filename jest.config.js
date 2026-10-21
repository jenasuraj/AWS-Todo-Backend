/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Convention: tests live in test/ and are named *.test.ts
  testMatch: ["<rootDir>/test/**/*.test.ts"],
};
