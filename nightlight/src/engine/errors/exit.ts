/*
 * When calling runtime.exit() this error is thrown
 * It is handled by the game better and calls onexit()
 */

export class ExitError extends Error {
  constructor() {
    super("Stopping game execution");
  }
}
