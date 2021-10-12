import { Command } from "interfaces";
import { inject, injectable, multiInject } from "inversify";
import { TYPES } from "lib/inversify";

@injectable()
export class CommandService {
  public readonly prefix: string;
  private commands: Command[];

  constructor(
    @inject(TYPES.Prefix) prefix: string,
    @multiInject(TYPES.Command) commands: Command[]
  ) {
    this.prefix = prefix;
    this.commands = commands;
  }

  getCommand(commandName: string) {
    return this.commands.find(item => item.name === commandName)
  }
}
