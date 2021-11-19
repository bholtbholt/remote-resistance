import logo from './logo';
import express from 'express';
import http from 'http';
import sslRedirect from 'heroku-ssl-redirect';
import helmet from 'helmet';

const app = express();
const expressServer = http.createServer(app);
const port = process.env.PORT || 4000;

// enable ssl redirect
app.use(sslRedirect());
// Follow Express security best practices
// https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(
  helmet({
    // These directives are required because of dev env, specifically ws: + http:
    // helemt defaults will work when localhost is upgraded to https
    contentSecurityPolicy: {
      directives: {
        'base-uri': ["'self'"],
        'block-all-mixed-content': [],
        'connect-src': ['self', 'wss:', 'ws:', 'http:', 'https:'],
        'default-src': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'", 'http:'],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'", 'http:'],
        // 'upgrade-insecure-requests': [],
      },
    },
  }),
);

// serves the assets directory
app.use(express.static('dist'));
// supports :room_id param
app.get('/:room_id', (req, res) => {
  res.sendFile('index.html', { root: './dist' });
});
expressServer.listen(port, () => {
  logo(`PORT:${port}`);
});

export { expressServer };
