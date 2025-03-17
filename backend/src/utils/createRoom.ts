import { Chess } from "chess.js";
import { randomInt } from "crypto";
import WebSocket from "ws";

export interface Room {
  id: number;
  clients: WebSocket[];
  game?: Chess;
}
export const createRoom = (ws: WebSocket) => {
  const room: Room = {
    id: randomInt(100000, 999999),
    clients: [ws],
  };
  return room;
};
