import { Command, Player } from "interfaces";
import { CommandRunOptions } from "types";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";

@injectable()
export class PlayCommand implements Command {
  readonly name = "play";
  readonly description = "Воспроизвеcти песню или поставить ее в очередь (Supports: YouTube, Spotify)";
  readonly args = "...listOfLinks";

  constructor(
    @inject(TYPES.Player) private readonly playerController: Player
  ) {}

  async run({ args, message }: CommandRunOptions) {
    if (!message.member || !args) {
      throw new Error();
    }

    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      throw new Error("Зайди в хату! Не будь крысой!");
    }

    const guildQueue = this.playerController.player.getQueue(
      message.guild?.id || ""
    );

    const queue = this.playerController.player.createQueue(
      message.guild?.id || ""
    );

    await queue.join(message.member.voice.channel);

    await queue.play(args.join(" ")).catch((_) => {
      if (!guildQueue) queue.stop();
    });
  }
}
