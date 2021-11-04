import "reflect-metadata";
import { Container } from "inversify";
import { default as TYPES } from "./types";
import { Bot, PlayerController } from "classes";
import { Client, Intents } from "discord.js";
import { CommandService, FileService, MessageResponder } from "services";
import {
  AvatarCommand,
  ExchangeRateCommand,
  WeatherCommand,
  PlayCommand,
  SkipCommand,
  StopCommand,
  SeekCommand,
} from "commands";
import { Command, Player, MessageHandler } from "interfaces";

const container = new Container();

// Classes
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(
  new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  })
);
container.bind<Player>(TYPES.Player).to(PlayerController).inSingletonScope();

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
  .bind<MessageHandler>(TYPES.MessageHandler)
  .to(MessageResponder)
  .inSingletonScope();

// Commands
container.bind<Command>(TYPES.Command).to(AvatarCommand);
container.bind<Command>(TYPES.Command).to(WeatherCommand);
container.bind<Command>(TYPES.Command).to(ExchangeRateCommand);
container.bind<Command>(TYPES.Command).to(PlayCommand);
container.bind<Command>(TYPES.Command).to(SkipCommand);
container.bind<Command>(TYPES.Command).to(StopCommand);
container.bind<Command>(TYPES.Command).to(SeekCommand);

export default container;
