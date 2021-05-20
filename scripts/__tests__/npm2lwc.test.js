const { WATCH_FILTER_REGEX } = jest.requireActual('../constants');

const filepath = (filename) => `/path/to/file/${filename}`;

describe('watch:core file filtering', () => {
    const isPathIgnored = (path) => !WATCH_FILTER_REGEX.test(path);
    let path;

    describe('should ignore', () => {
        it.each`
            description                                     | ignoredFilenames
            ${"files containing '___'"}                     | ${['___file']}
            ${"files ending with '~'"}                      | ${['file~']}
            ${"files ending with '.tmp'"}                   | ${['file.tmp']}
            ${"files named '.DS_Store' (case insensitive)"} | ${['.DS_Store', '.ds_store', '.dS_sToRe']}
        `('$description', ({ ignoredFilenames }) => {
            for (const filename of ignoredFilenames) {
                path = filepath(filename);
                expect(isPathIgnored(path)).toEqual(true);
            }
        });
    });

    describe('should handle all of the other files like', () => {
        it.each`
            description                                                        | handledFilename
            ${'TypeScript files'}                                              | ${'file.ts'}
            ${"files containing '__' but not '___'"}                           | ${'__file'}
            ${"files containing '~' but not ending with it"}                   | ${'~file'}
            ${"files containing '.tmp' but not ending with it"}                | ${'file.tmp.ts'}
            ${"files containing '.ds_store' without it being their full name"} | ${'file.ds_store'}
        `('$description', ({ handledFilename }) => {
            path = filepath(handledFilename);
            expect(isPathIgnored(path)).toEqual(false);
        });
    });
});
