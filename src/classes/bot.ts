import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { MessageResponder } from "services";

@injectable()
export class Bot {
  private client: Client;
  private readonly token: string;
  private readonly messageResponder: MessageResponder;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.MessageResponder) messageResponder: MessageResponder
  ) {
    this.client = client;
    this.token = token;
    this.messageResponder = messageResponder;
  }

  public listen() {
    this.client.on("messageCreate", (message: Message) => {
      this.messageResponder.handleMessage(this.client, message);
    });

    return this.client.login(this.token);
  }
}
