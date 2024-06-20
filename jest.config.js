module.exports = {
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': 'identity-obj-proxy',
  },
};
