import { MessageEmbed } from "discord.js";
import { Command } from "interfaces";
import { inject, injectable, multiInject } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandRunOptions } from "types";

@injectable()
export class CommandService {
  constructor(
    @inject(TYPES.Prefix) readonly prefix: string,
    @multiInject(TYPES.Command) private commands: Command[]
  ) {}

  getCommand(commandName: string) {
    if (commandName === "help") {
      return this.getListOfCommands();
    }
    return this.commands.find((item) => item.name === commandName);
  }

  private getListOfCommands(): Command {
    return {
      name: "help",
      description: "Получить список команд",
      run: ({ message }: CommandRunOptions) => {
        const commandsList = this.commands.reduce(
          (prev, command) =>
            prev +
            `***${command.name}*** - ${command.description}
            syntax: \`${
              this.prefix +
              command.name +
              (command.args ? " " + command.args : "")
            } \`${
              command.defaultValue != undefined
                ? "\ndefaultValue: " + "*" + command.defaultValue + "*"
                : ""
            }\n\n`,

          ""
        );

        const helpMessage = new MessageEmbed()
          .setColor("#1155FF")
          .setTitle("Список доступных команд: ")
          .setDescription(commandsList);

        message.channel.send({ embeds: [helpMessage] });
      },
    };
  }
}
