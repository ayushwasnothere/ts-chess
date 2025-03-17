"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const createRoom_1 = require("./utils/createRoom");
const chess_js_1 = require("chess.js");
const crypto_1 = require("crypto");
let rooms = [];
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Running WSS");
});
const server = http_1.default.createServer({});
server.on("request", app);
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message) => {
        var _a, _b;
        console.log("Received: %s", message);
        try {
            const data = JSON.parse(message.toString());
            if (data.type === "create") {
                rooms = rooms.filter((r) => r.clients.includes(ws));
                let room = (0, createRoom_1.createRoom)(ws);
                while (rooms.find((r) => r.id === room.id)) {
                    console.log("Room already exists, creating new one");
                    room = (0, createRoom_1.createRoom)(ws);
                }
                rooms.push(room);
                ws.send(JSON.stringify({ success: true, type: "create", roomId: room.id }));
            }
            else if (data.type === "join") {
                const room = rooms.find((r) => r.id === data.roomId);
                if (room && !room.clients.includes(ws) && room.clients.length < 2) {
                    room.clients.push(ws);
                    ws.send(JSON.stringify({ success: true, type: "join", roomId: room.id }));
                    room.game = new chess_js_1.Chess();
                    const color = (0, crypto_1.randomInt)(0, 2);
                    room.clients.forEach((client) => {
                        client.send(JSON.stringify({
                            type: "start",
                            color: room.clients.indexOf(client) === color ? "white" : "black",
                        }));
                    });
                }
                else {
                    ws.send(JSON.stringify({
                        success: false,
                        type: "join",
                        message: "Room not found!",
                    }));
                }
            }
            else if (data.type === "move") {
                const room = rooms.find((r) => r.clients.find((c) => c === ws));
                if (room) {
                    try {
                        const move = (_a = room.game) === null || _a === void 0 ? void 0 : _a.move(data.move);
                        console.log("Move", move);
                        room.clients.forEach((client) => {
                            if (client !== ws) {
                                try {
                                    client.send(JSON.stringify({
                                        type: "move",
                                        move: { from: move === null || move === void 0 ? void 0 : move.from, to: move === null || move === void 0 ? void 0 : move.to },
                                    }));
                                }
                                catch (error) {
                                    console.error("Error sending move", error);
                                }
                            }
                        });
                        if ((_b = room.game) === null || _b === void 0 ? void 0 : _b.isGameOver()) {
                            let result = "Game Over";
                            if (room.game.isCheckmate()) {
                                result = `Checkmate! ${room.game.turn() === "w" ? "Black" : "White"} wins`;
                            }
                            else if (room.game.isStalemate()) {
                                result = "Stalemate! It's a draw.";
                            }
                            else if (room.game.isInsufficientMaterial()) {
                                result = "Draw due to insufficient material.";
                            }
                            else if (room.game.isThreefoldRepetition()) {
                                result = "Draw by threefold repetition.";
                            }
                            else if (room.game.isDraw()) {
                                result = "Draw!";
                            }
                            room.clients.forEach((client) => {
                                client.send(JSON.stringify({
                                    type: "gameOver",
                                    message: result,
                                }));
                            });
                            rooms = rooms.filter((r) => r !== room);
                        }
                    }
                    catch (error) {
                        ws.send(JSON.stringify({
                            type: "error",
                            message: "Invalid move",
                        }));
                    }
                }
            }
        }
        catch (error) {
            console.error("Error parsing JSON", error);
        }
    });
    ws.on("close", () => {
        console.log("Client disconnected");
        while (rooms.find((r) => r.clients.includes(ws))) {
            const room = rooms.find((r) => r.clients.includes(ws));
            if (room) {
                room.clients.forEach((client) => {
                    client.send(JSON.stringify({ type: "close", message: "Opponent disconnected" }));
                });
                rooms = rooms.filter((r) => r !== room);
            }
        }
    });
});
server.listen(8080, () => {
    console.log("✅ Server started on https://localhost:8080");
});
