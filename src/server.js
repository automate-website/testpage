const express = require('express');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const path = require('path');

const app = express();

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

app.use(morgan('combined'));

const serve = serveStatic(path.join(__dirname, '../public'), { 'index': ['index.html', 'index.htm'] });
app.use('/', serve);

app.get('/healthcheck',function (req, res) {
  res.send('OK');
});

app.post('/upload/single', upload.single('file'), function (req, res, next) {
  res.send('OK');
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
