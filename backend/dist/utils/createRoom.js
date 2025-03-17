"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = void 0;
const crypto_1 = require("crypto");
const createRoom = (ws) => {
    const room = {
        id: (0, crypto_1.randomInt)(100000, 999999),
        clients: [ws],
    };
    return room;
};
exports.createRoom = createRoom;
