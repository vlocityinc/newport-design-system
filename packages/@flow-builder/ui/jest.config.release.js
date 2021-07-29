const standardConfig = require('./jest.config.json');

module.exports = {
    ...standardConfig,
    verbose: false,
    reporters: [
        'default',
        [
            '../../../node_modules/jest-html-reporter',
            {
                pageTitle: 'ui-interaction-builder-components Jest tests report',
                outputPath: '<rootDir>/../../../jest-report/index.html',
                includeFailureMsg: true
            }
        ]
    ]
};
