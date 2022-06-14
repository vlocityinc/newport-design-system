module.exports = {
    preset: '@lwc/jest-preset',
    moduleNameMapper: {
        '^aura$': '<rootDir>/jest-modules/aura.js'
    },
    moduleNameMapper: {
        '^(builder_framework)/(.+)$': '<rootDir>/../shared-utils/jest-modules/$1/$2/$2',
        '^aura$': '<rootDir>/../ui/jest-modules/aura/aura',
        '^(builder_platform_interaction)/builderTestUtils/commonTestUtils$':
            '<rootDir>/../ui/src/builder_platform_interaction/builderTestUtils/commonTestUtils',
        '^(force)/(.+)$': '<rootDir>/../ui/jest-modules/$1/$2/$2'
    },
    moduleFileExtensions: ['ts', 'js']
};
