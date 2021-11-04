import { CommandRunOptions } from "types";

export interface Command {
  name: string;
  description: string;
  args?: string;
  defaultValue?: any;
  run: (options: CommandRunOptions) => Promise<any> | void;
}
