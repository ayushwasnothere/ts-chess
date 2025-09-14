# TS-Chess

**TS-Chess** is a full-fledged chess implementation for the web, built with **TypeScript** and **React**.  
It supports three unique modes of play, making it both fun and versatile:

- ♟ **Two Player Mode** – Play locally with a friend on the same device
- 🌐 **Online Mode** – Play against others in real-time using **WebSockets**
- 🤖 **Bot Mode** – Challenge the powerful **Stockfish engine** directly in your browser

---

## Features

- Full chess rules implemented (legal moves, check, checkmate, stalemate, promotion, castling, en passant, etc.)
- Real-time online play with **WebSockets**
- Integrated **Stockfish** engine for AI gameplay
- Built with **TypeScript** for safety and reliability
- Sleek, responsive UI using **React**

---

## Tech Stack

| Layer       | Technology |
| ----------- | ---------- |
| Language    | TypeScript |
| Frontend    | React      |
| Online Play | WebSockets |
| Bot Engine  | Stockfish  |

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ayushwasnothere/ts-chess.git
cd ts-chess
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Start the development server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play.

---

## Usage

Choose between the three modes:

- **Two Player** – Pass and play on the same board
- **Online** – Play against other players using real-time WebSocket connections
- **Bot** – Compete with the Stockfish chess engine (with adjustable difficulty)

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch:

```bash
git checkout -b feature-name
```

3. Commit your changes:

```bash
git commit -m "Add feature"
```

4. Push to your branch:

```bash
git push origin feature-name
```

5. Open a pull request

---

## License

[MIT](LICENSE)

---

## Project Preview

```bash
$ pnpm dev
> Server running at http://localhost:3000
[Mode] Two Player / Online / Bot
[Engine] Stockfish loaded successfully
```

Play chess your way — local, online, or against the machine. ♞

