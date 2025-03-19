export type Color = "white" | "black";
export type Role = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Key = "a0" | `${File}${Rank}`;

export type Dests = Map<Key, Key[]>;

export interface MoveMetadata {
  premove: boolean;
  ctrlKey?: boolean;
  holdTime?: number;
  captured?: Piece;
  predrop?: boolean;
}

export interface Piece {
  role: Role;
  color: Color;
  promoted?: boolean;
}

export interface MovableOptions {
  free?: boolean;
  color?: Color | "both";
  dests?: Dests;
  showDests?: boolean;
  events?: {
    after?: (orig: Key, dest: Key, metadata: MoveMetadata) => void;
    afterNewPiece?: (role: Role, key: Key, metadata: MoveMetadata) => void;
  };
  rookCastle?: boolean;
}
