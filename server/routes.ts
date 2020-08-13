import * as express from 'express';
import * as path from 'path';
import * as http from 'http';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Default paths render static file and support route parameter for :room_id
app.use(express.static(path.join(process.env.PWD, 'dist')));
app.get('/:room_id', function (req, res, next) {
  return res.sendFile(path.join(process.env.PWD, 'dist', 'index.html'));
});
server.listen(port);

export { server };
