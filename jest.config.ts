/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",
    // A set of global variables that need to be available in all test environments
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.test.json",
        },
    },
    // The root directory that Jest should scan for tests and modules within
    rootDir: ".",
    // The glob patterns Jest uses to detect test files
    testMatch: ["**/*.test.ts"],
    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/"],
    // A map from regular expressions to paths to transformers
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
};

//testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
