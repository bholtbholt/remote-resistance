import express from 'express';
import http from 'http';

const app = express();
const expressServer = http.createServer(app);
const port = process.env.PORT || 4000;

// serves the assets directory
app.use(express.static('dist'));
// supports :room_id param
app.get('/:room_id', (req, res) => {
  res.sendFile('index.html', { root: './dist' });
});
expressServer.listen(port, () => {
  // prettier-ignore
  console.log(
  '\n',
  '                                                   .             \n',
  '                                                 .o8             \n',
  'oooo d8b  .ooooo.  ooo. .oo.  .oo.    .ooooo.  .o888oo  .ooooo.  \n',
  ' 888""8P d88   88b  888P"Y88bP"Y88b  d88   88b   888   d88   88b \n',
  ' 888     888ooo888  888   888   888  888   888   888   888ooo888 \n',
  ' 888     888    .o  888   888   888  888   888   888 . 888    .o \n',
  'd888b     Y8bod8P  o888o o888o o888o  Y8bod8P    "888"  Y8bod8P  \n',
  '\n',
  '                             o8o               .                                             \n',
  '                              "              .o8                                             \n',
  'oooo d8b  .ooooo.   .oooo.o oooo   .oooo.o .o888oo  .oooo.   ooo. .oo.    .ooooo.   .ooooo.  \n',
  ' 888""8P d88   88b d88(  "8  888  d88(  "8   888    P  )88b   888P"Y88b  d88   "Y8 d88   88b \n',
  ' 888     888ooo888  "Y88b.   888   "Y88b.    888    .oP"888   888   888  888       888ooo888 \n',
  ' 888     888    .o o.  )88b  888  o.  )88b   888 . d8(  888   888   888  888   .o8 888    .o \n',
  'd888b     Y8bod8P  8""888P  o888o 8""888P    "888"  Y888""8o o888o o888o  Y8bod8P   Y8bod8P  \n',
  '\n\n',
  `PORT:${port}      HISTORY:${process.env.HISTORY || 'CLEAN'}\n`,
  '_____________________________________________________________________________________________\n\n',
  );
});

export { expressServer };
