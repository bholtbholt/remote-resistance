require('dotenv').config();
import { Server as SocketIO } from 'socket.io';
import { expressServer } from './routes';
import { socketConnection } from './sockets';

const namespaces = new SocketIO(expressServer).of(/^\/\w+/);
socketConnection(namespaces);
