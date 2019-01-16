const express = require('express');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const path = require('path');

const app = express();

const basicAuth = require('basic-auth');

const multer  = require('multer')
const uploadDir='/usr/var/app/upload'
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  }
})
const upload = multer({ storage: storage })

const auth = function (req, res, next) {
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass || !(user.name === 'admin' && user.pass === 'secret')) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
  } else {
    next();
  }
}

app.all("/admin/*", auth);

app.use(morgan('combined'));

const serve = serveStatic(path.join(__dirname, '../public'), { 'index': ['index.html', 'index.htm'] });
app.use('/', serve);

app.get('/healthcheck',function (req, res) {
  res.send('OK');
});

app.post('/upload/single', upload.single('file'), function (req, res, next) {
  res.send('OK');
});


app.get('/foo', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({'foo': 'bar'});
});

app.get('/admin/foo', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({'foo': 'baz'});
});

let port = 3000;
if (process.env.NODE_PORT) {
  port = parseInt(process.env.NODE_PORT);
}
const server = app.listen(port);

const stopSignals = [
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
];

stopSignals.forEach(function (signal) {
  process.on(signal, function () {
    console.log('Got', signal);
    server.close();
  });
});
