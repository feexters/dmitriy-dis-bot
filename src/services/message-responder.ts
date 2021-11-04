import { Client, Message, MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandService } from "services";
import { MessageHandler } from "interfaces";

@injectable()
export class MessageResponder implements MessageHandler {
  constructor(
    @inject(TYPES.Prefix) readonly prefix: string,
    @inject(TYPES.CommandService)
    private readonly commandService: CommandService
  ) {}

  async handleMessage(client: Client<boolean>, message: Message) {
    if (!message.content.startsWith(this.prefix) || message.author.bot) {
      return;
    }

    const messageArray = message.content.split(" ");

    const commandName = messageArray[0];

    const args = messageArray.slice(1);

    const command = this.commandService.getCommand(
      commandName.slice(this.prefix.length)
    );

    try {
      if (command) {
        await command.run({ client, message, args });
      } else {
        throw new Error('Команда не найдена...')
      }
    } catch (e) {
      const errorMessage =
        (e as Error).message || "Упс! Что-то пошло не так...";

      const error = new MessageEmbed()
        .setTitle(errorMessage)
        .setColor("#ff0000");

      message.channel.send({ embeds: [error] });
      console.error(errorMessage);
    }
  }
}
