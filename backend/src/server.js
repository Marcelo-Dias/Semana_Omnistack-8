const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    /* console.log('Nova conexão', socket.id);

    socket.on('hello', message => {
        console.log(message)
    })

    setTimeout(() => {
        socket.emit('world', {
            message: 'OmniStack'
        });
    }, 5000) */

    const { user } = socket.handshake.query;

    console.log(user, socket.id);

    connectedUsers[user] = socket.id;
});

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-ztvra.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);