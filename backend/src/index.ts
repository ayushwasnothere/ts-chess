import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import fs from "fs";
import { createRoom, Room } from "./utils/createRoom";
import { Chess } from "chess.js";
import { randomInt } from "crypto";

const keyPath = "key.pem";
const certPath = "cert.pem";
let rooms: Room[] = [];

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error("❌ SSL certificates not found! Generate them using:");
  console.error(
    "openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes",
  );
  process.exit(1);
}

const app = express();
app.get("/", (req, res) => {
  res.send("Running WSS");
});

const server = http.createServer({});
server.on("request", app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received: %s", message);
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "create") {
        rooms = rooms.filter((r) => r.clients.includes(ws));
        let room = createRoom(ws);
        while (rooms.find((r) => r.id === room.id)) {
          console.log("Room already exists, creating new one");
          room = createRoom(ws);
        }
        rooms.push(room);
        ws.send(
          JSON.stringify({ success: true, type: "create", roomId: room.id }),
        );
      } else if (data.type === "join") {
        const room = rooms.find((r) => r.id === data.roomId);
        if (room && !room.clients.includes(ws) && room.clients.length < 2) {
          room.clients.push(ws);
          ws.send(
            JSON.stringify({ success: true, type: "join", roomId: room.id }),
          );
          room.game = new Chess();
          const color = randomInt(0, 2);
          room.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                type: "start",
                color:
                  room.clients.indexOf(client) === color ? "white" : "black",
              }),
            );
          });
        } else {
          ws.send(
            JSON.stringify({
              success: false,
              type: "join",
              message: "Room not found!",
            }),
          );
        }
      } else if (data.type === "move") {
        const room = rooms.find((r) => r.clients.find((c) => c === ws));
        if (room) {
          try {
            const move = room.game?.move(data.move);
            console.log("Move", move);
            room.clients.forEach((client) => {
              if (client !== ws) {
                try {
                  client.send(
                    JSON.stringify({
                      type: "move",
                      move: { from: move?.from, to: move?.to },
                    }),
                  );
                } catch (error) {
                  console.error("Error sending move", error);
                }
              }
            });
            if (room.game?.isGameOver()) {
              let result = "Game Over";
              if (room.game.isCheckmate()) {
                result = `Checkmate! ${room.game.turn() === "w" ? "Black" : "White"} wins`;
              } else if (room.game.isStalemate()) {
                result = "Stalemate! It's a draw.";
              } else if (room.game.isInsufficientMaterial()) {
                result = "Draw due to insufficient material.";
              } else if (room.game.isThreefoldRepetition()) {
                result = "Draw by threefold repetition.";
              } else if (room.game.isDraw()) {
                result = "Draw!";
              }

              room.clients.forEach((client) => {
                client.send(
                  JSON.stringify({
                    type: "gameOver",
                    message: result,
                  }),
                );
              });

              rooms = rooms.filter((r) => r !== room);
            }
          } catch (error) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid move",
              }),
            );
          }
        }
      }
    } catch (error) {
      console.error("Error parsing JSON", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    while (rooms.find((r) => r.clients.includes(ws))) {
      const room = rooms.find((r) => r.clients.includes(ws));
      if (room) {
        room.clients.forEach((client) => {
          client.send(
            JSON.stringify({ type: "close", message: "Opponent disconnected" }),
          );
        });
        rooms = rooms.filter((r: Room) => r !== room);
      }
    }
  });
});

server.listen(8080, () => {
  console.log("✅ Server started on https://localhost:8080");
});
