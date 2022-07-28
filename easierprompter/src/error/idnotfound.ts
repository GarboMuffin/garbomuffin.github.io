export class ElementIDNotFoundError extends Error {
  constructor(id: string) {
    super(`Element with id '${id}' not found.`);
  }
}
