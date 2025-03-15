const moveSound = new Audio("/sounds/move.mp3");
const captureSound = new Audio("/sounds/capture.mp3");
const castleSound = new Audio("/sounds/castle.mp3");
const promoteSound = new Audio("/sounds/promote.mp3");
const gameEndSound = new Audio("/sounds/game_end.mp3");

export default function playSound(type: string) {
  switch (type) {
    case "move":
      moveSound.play();
      break;
    case "capture":
      captureSound.play();
      break;
    case "castle":
      castleSound.play();
      break;
    case "promote":
      promoteSound.play();
      break;
    case "game_end":
      gameEndSound.play();
      break;
    default:
      break;
  }
}
