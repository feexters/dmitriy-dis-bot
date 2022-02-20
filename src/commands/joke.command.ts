import { MessageEmbed } from "discord.js";
import { Command } from "interfaces";
import { CommandRunOptions } from "types";
import { injectable } from "inversify";
import { getJoke } from "./api";
import { takeRandom } from '../utils/take-random';

@injectable()
export class JokeCommand implements Command {
  readonly name = "анекдот";
  readonly description = "Рандомный анекдот";

  private readonly availableTypes = new Array(18).fill(undefined).map((_, index) => index + 1)

  async getJokeMessage(type: number) {
    const jokeResponse = await getJoke(type);
    const jokeMessage = new MessageEmbed();

    jokeMessage.setColor("#ffff00").setDescription(jokeResponse.data);

    return jokeMessage;
  }

  async run({ message }: CommandRunOptions) {
    try {
      const jokeType = takeRandom(this.availableTypes);
      const messageEmbed = await this.getJokeMessage(jokeType)

      message.channel.send({ embeds: [messageEmbed] });
    } catch (error) {
      console.log(error);
      message.channel.send("Упс, что-то пошло не так...");
    }
  }
}
