const express = require('express');
const path = require('path');
const app = express();

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

const server = app.listen(app.get('port'), () => {
    const port = server.address().port;
    console.log(`Server up on http://localhost:${port}`); // eslint-disable-line no-console
});
