const express = require('express');

const PORT = 9999;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.json()); // to receive data from req.body
app.use(express.urlencoded({ extended: true }));  // parse url

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
    const { id: roomId } = req.params;
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
    } : { users: [], messages: [] };
    res.json(obj);
});

app.post('/rooms', (req, res) => {
    const { roomId, userName } = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
            ['users', new Map()],
            ['messages', []],
        ]));
    }
    res.send();
})

io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ roomId, userName }) => {
        socket.join(roomId); // connect to socket
        rooms.get(roomId).get('users').set(socket.id, userName); // save to database
        const users = [...rooms.get(roomId).get('users').values()]; // get list of all users
        socket.to(roomId).emit('ROOM:SET_USERS', users); // send to everyone besides me array of users in dialog
    });

    socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text}) => {
        const obj = {
            userName, text
        };
        rooms.get(roomId).get('messages').push(obj);
        socket.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.to(roomId).emit('ROOM:SET_USERS', users);

            }
        });
    })
    console.log('user connected', socket.id);
})

server.listen(PORT, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log('Server is logged on ', PORT);
});