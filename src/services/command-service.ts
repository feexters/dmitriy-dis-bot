import { Command } from "interfaces";
import { inject, injectable, multiInject } from "inversify";
import { TYPES } from "lib/inversify";

@injectable()
export class CommandService {
  constructor(
    @inject(TYPES.Prefix) readonly prefix: string,
    @multiInject(TYPES.Command) private commands: Command[]
  ) {}

  getCommand(commandName: string) {
    return this.commands.find(item => item.name === commandName)
  }
}
