export class ServerError extends Error {
  status: number;

  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 500;
  }

  getMessage(): { name: string; message: string } {
    return {
      name: this.name,
      message: this.message,
    };
  }
}
