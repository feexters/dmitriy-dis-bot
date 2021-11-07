import { Client, Message, MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandService } from "services";
import { MessageHandler } from "interfaces";
import { MUSIC_COMMANDS_LIST } from "constant";

@injectable()
export class MessageResponder implements MessageHandler {
  constructor(
    @inject(TYPES.Prefix) readonly prefix: string,
    @inject(TYPES.CommandService)
    private readonly commandService: CommandService
  ) {}

  async handleMessage(client: Client<boolean>, message: Message) {
    const musicChannelId = "893386735394893855";

    if (!message.content.startsWith(this.prefix) || message.author.bot) {
      if (message.channelId === musicChannelId) {
        message.delete();
      }

      return;
    }

    const messageArray = message.content.split(" ");

    const commandName = messageArray[0].slice(this.prefix.length);

    const isMusicCommand = MUSIC_COMMANDS_LIST.includes(commandName);

    if (message.channelId === musicChannelId) {
      if (!isMusicCommand) {
        return message.delete();
      }
    } else if (isMusicCommand) {
      return message.delete();
    }

    const args = messageArray.slice(1);

    const command = this.commandService.getCommand(commandName);

    try {
      if (command) {
        await command.run({ client, message, args });
      } else {
        throw new Error("Команда не найдена!");
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
