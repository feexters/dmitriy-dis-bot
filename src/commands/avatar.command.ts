import { MessageEmbed, User } from "discord.js";
import { getRandomInt } from "utils";
import { Command } from "interfaces";
import { CommandRunOptions } from "types";
import { injectable } from "inversify";

@injectable()
export class AvatarCommand implements Command {
  readonly name = "avatar";
  readonly description = "Получить аватарку пользователя";
  private readonly lifeStatus = [
    "Пидр",
    "Петух",
    "Бродяга",
    "Вор",
    "Бандит",
    "Хуесос",
    "Авторитет",
    "Давалка",
    "Немец",
    "Залупа",
    "Алкаш",
    "Блатной",
    "Таджик",
    "Трудовик",
    "Харчок",
  ];

  run({ args, message }: CommandRunOptions) {
    const sendAvatar = (user: User) => {
      const avatar = new MessageEmbed()
        .setColor("#ff00ff")
        .setTitle("Прошмандовки Таджикистана")
        .setDescription(
          `
        ***Кличка***: ${user.username}
        ***По жизни***: ${this.lifeStatus[getRandomInt(this.lifeStatus.length)]}
      `
        )
        .setImage(user.displayAvatarURL());

      message.channel.send({ embeds: [avatar] });
    };

    if (args?.length) {
      for (let user of message.mentions.users) {
        sendAvatar(user[1]);
        break;
      }
    } else {
      sendAvatar(message.author);
    }
  }
}
