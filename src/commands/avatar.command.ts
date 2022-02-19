import { Message, MessageEmbed, User } from "discord.js";
import { getRandomInt } from "utils";
import { Command } from "interfaces";
import { CommandRunOptions } from "types";
import { injectable } from "inversify";
import { LIFE_STATUSES } from "./constants/avatar.constants";

@injectable()
export class AvatarCommand implements Command {
  readonly name = "avatar";
  readonly description = "Получить аватарку пользователя";
  readonly args = "...usersList?";

  private readonly lifeStatuses = LIFE_STATUSES;
  private readonly statusSeparator = '♱'
  private readonly maxNameLength = 32

  private setLifeStatusToNickname(message: Message, status: string) {
    const previewStatus = ' ' + this.statusSeparator + status + this.statusSeparator

    try {
      const currentName = message.member?.displayName || '';

      const regexExistStatus = new RegExp(`\u2671.+\u2671`)
      const isHasStatus = regexExistStatus.exec(currentName)

      const nameWithoutStatus = isHasStatus ? currentName?.replace(regexExistStatus, '').trim() : currentName

      let newName = nameWithoutStatus + previewStatus

      if (newName.length > this.maxNameLength) {
        newName = nameWithoutStatus.slice(this.maxNameLength - newName.length) + previewStatus;
      }

      return message.member?.setNickname(newName).catch(error => console.log(error));
    } catch (error) {
      console.log("error", error);
    }
  }

  run({ args, message }: CommandRunOptions) {
    const sendAvatar = (user: User, options?: { updateName: boolean }) => {
      const status = this.lifeStatuses[getRandomInt(this.lifeStatuses.length)];

      const avatar = new MessageEmbed()
        .setColor("#ff00ff")
        .setTitle("Прошмандовки Таджикистана")
        .setDescription(
          `
        ***Кличка***: ${user.username}
        ***По жизни***: ${status}
      `
        )
        .setImage(user.displayAvatarURL());

      if (options?.updateName) {
        this.setLifeStatusToNickname(message, status);
      }

      message.channel.send({ embeds: [avatar] });
    };

    if (args?.length) {
      for (let user of message.mentions.users) {
        sendAvatar(user[1]);
        break;
      }
    } else {
      sendAvatar(message.author, { updateName: true });
    }
  }
}
