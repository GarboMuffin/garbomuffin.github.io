// All z indexes are defined here to avoid magic numbers and using 9999999

// Reminder: Static stuff renders at -1

export enum ZIndexes {
  Stars = -10,
  Block = 0, // note: possibly static
  Grass = 1, // note: static
  Player = 10,
  FinalBoss = 20,
  PauseMenu = 100,
}
