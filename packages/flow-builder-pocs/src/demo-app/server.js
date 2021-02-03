const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());

// eslint-disable-next-line lwc-core/no-process-env
app.set('port', process.env.PORT || 3000);

// SLDS
app.use(
    '/assets/',
    express.static(path.resolve(__dirname, '../../../../node_modules/@salesforce-ux/design-system/assets'))
);

app.use('/main.js', express.static(path.resolve(__dirname, '../../build/demo-app/main.js')));

app.use('/builder.js', express.static(path.resolve(__dirname, '../../build/demo-app/builder.js')));

app.use('/', express.static(path.resolve(__dirname, 'public')));

const freeFormDirName = './public/data/ffcUiModels';
const autoLayoutDirName = './public/data/flcUiModels';

function createNewFfcTestCase(json) {
    const dir = path.resolve(__dirname, freeFormDirName);
    const testCaseFile = `${new Date().toISOString()}.json`;
    fs.writeFileSync(`${dir}/${testCaseFile}`, JSON.stringify(json, null, '   '));
    return testCaseFile;
}

function listFiles(dir) {
    const prefixIndex = './public'.length;
    const rootPath = dir.substring(prefixIndex);

    return fs
        .readdirSync(path.resolve(__dirname, dir))
        .filter((file) => file.endsWith('.json'))
        .map((file) => `${rootPath}/${file}`);
}

const getTestCases = () => {
    return {
        freeForm: listFiles(freeFormDirName),
        autoLayout: listFiles(autoLayoutDirName)
    };
};

app.get('/testcases', (req, res) => {
    res.json(getTestCases());
});

app.post('/testcases', (req, res) => {
    const json = req.body;
    console.log(json);
    const file = createNewFfcTestCase(json);
    res.json({ file });
});

const server = app.listen(app.get('port'), () => {
    const port = server.address().port;
    console.log(`Server up on http://localhost:${port}`); // eslint-disable-line no-console
});
