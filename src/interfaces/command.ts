import { CommandRunOptions } from "types";

export interface Command {
  name: string;
  description: string;
  run: (options: CommandRunOptions) => Promise<any> | void;
}
