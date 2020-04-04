module.exports = {
    preset: 'jest-puppeteer',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    testTimeout: 100 * 6000,
    moduleNameMapper: {
        '^@root/(.*)$': '<rootDir>/$1',
        '^@assets/(.*)$': '<rootDir>/assets/$1',
        '^@config/(.*)$': '<rootDir>/config/$1',
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@layouts/(.*)$': '<rootDir>/src/layouts/$1',
        '^@test-utils/(.*)$': '<rootDir>/tests/utils/$1',
    }
};
