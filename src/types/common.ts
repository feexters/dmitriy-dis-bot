import { Client, Message } from "discord.js";

export type CommandRunOptions = {
  prefix?: string;
  client: Client<boolean>;
  message: Message;
  args?: string[];
};
