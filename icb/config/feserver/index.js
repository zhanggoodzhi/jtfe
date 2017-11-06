const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/test', router);

app.listen(3000, () => {
    console.info('Fe Server listening on port 3000!');
});
