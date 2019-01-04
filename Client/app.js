const env = require('./helpers/env')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var routes = require('./routes/routes');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: "error",
        message: err.message,
        error: env('APP_DEBUG') ? err : {}
    });
});

routes(app);

app.listen(env('APP_PORT'), () => {
    console.log('Server launches on port ' + env('APP_PORT'));
});