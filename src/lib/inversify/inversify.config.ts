import "reflect-metadata";
import { Container } from "inversify";
import { default as TYPES } from "./types";
import { Bot } from "classes";
import { Client, Intents } from "discord.js";
import { CommandService, FileService, MessageResponder } from "services";
import { AvatarCommand, WeatherCommand } from "commands";
import { Command } from "interfaces";

const container = new Container();

// Classes
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(
  new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  })
);

// Env
container
  .bind<string>(TYPES.Token)
  .toConstantValue(process.env.BOT_CLIENT_TOKEN || "");
container
  .bind<string>(TYPES.Prefix)
  .toConstantValue(process.env.BOT_PREFIX || "!");

// Services
container
  .bind<FileService>(TYPES.FileService)
  .to(FileService)
  .inSingletonScope();
container
  .bind<CommandService>(TYPES.CommandService)
  .to(CommandService)
  .inSingletonScope();
container
  .bind<MessageResponder>(TYPES.MessageResponder)
  .to(MessageResponder)
  .inSingletonScope();

// Commands
container.bind<Command>(TYPES.Command).to(AvatarCommand);
container.bind<Command>(TYPES.Command).to(WeatherCommand);

export default container;
