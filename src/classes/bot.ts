import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { MessageHandler } from "../interfaces/message-handler";

@injectable()
export class Bot {
  constructor(
    @inject(TYPES.Client) private readonly client: Client,
    @inject(TYPES.Token) private readonly token: string,
    @inject(TYPES.MessageHandler) private readonly messageResponder: MessageHandler
  ) {}

  public listen() {
    this.client.on("messageCreate", (message: Message) => {
      this.messageResponder.handleMessage(this.client, message);
    });

    return this.client.login(this.token);
  }
}
