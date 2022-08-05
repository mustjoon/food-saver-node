import socketio from "socket.io";
import JwtService from "./services/jwt-service";

let connection = null;

class Realtime {
    _io
    constructor() {
        this._io = null;
    }
    connect(server) {
        const io = socketio(server);

        io.use(function(socket, next){
            if (socket.handshake.query && socket.handshake.query.token){
                JwtService.verify(socket.handshake.query.token, function(err, decoded) {
                  
                if (err) return next(new Error("Authentication error"));
                socket.decoded = decoded;
                next();
              });
            }
            else {
              next(new Error("Authentication error"));
            }    
          });

        this._io = io;

   
    }

    emit(event, data) {
        this._io.emit(event, data);
    }

    on(event, handler) {
        this._io.on(event, handler);
    }

    static init(server) {
        if(!connection) {
            connection = new Realtime();
            connection.connect(server);
            
         
        }
    }

    static getConnection() {
        if(!connection) {
            throw new Error("no active connection");
        }
        return connection;
    }
}

export const initSocketIO = Realtime.init;
export const getIO = Realtime.getConnection;



