module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/__tests__/**/*.test.js", "**/*.test.js"],
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover", "html"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!**/node_modules/**",
    "!src/app/OrderDashboard/page.js",
    "!src/app/OrderDashboard/page.js",
    "!src/app/PackingDashboard/page.js",
    "!src/app/page.js",
    "!src/app/layout.js",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
