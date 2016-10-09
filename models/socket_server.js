var io = require('socket.io')();
var sessionMiddleware = require('../app').sessionMiddleware;
//var router = require('../routes/news').post;

io.use(function(socket,next){
    sessionMiddleware(socket.request,socket.request.res,next);
});
io.on('connection',function(socket){
    //console.log('one connected');
    if (socket.request.session.user) {
        var roomid = 'wuan' + socket.request.session.user.userID;
        socket.join(roomid);
        //console.log('user joined room:'+roomid);
    }
    socket.on('disconnect',function(){
        if (socket.request.session.user) {
            var roomid = 'wuan' + socket.request.session.user.userID;
            socket.leave(roomid);
            //console.log('user leave room:'+roomid);
        }
        //console.log('one leave');
    });
});


exports.listen = function(server){
    return io.listen(server);
}