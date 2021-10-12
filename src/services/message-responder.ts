import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandService } from "services";

@injectable()
export class MessageResponder {
  public readonly prefix: string;
  private readonly commandService: CommandService;

  constructor(
    @inject(TYPES.Prefix) prefix: string,
    @inject(TYPES.CommandService) commandService: CommandService
  ) {
    this.prefix = prefix;
    this.commandService = commandService;
  }

  handleMessage(client: Client<boolean>, message: Message) {
    if (!message.content.startsWith(this.prefix) || message.author.bot) {
      return;
    }

    const messageArray = message.content.split(" ");

    const commandName = messageArray[0];

    const args = messageArray.slice(1);

    const command = this.commandService.getCommand(
      commandName.slice(this.prefix.length)
    );

    if (command) {
      command.run({ client, message, args });
    }
  }
}
