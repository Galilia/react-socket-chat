import io from 'socket.io-client';

const connectSocket = io(); // proxy in package.json

export default connectSocket;