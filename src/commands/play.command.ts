import { Command, Player } from "interfaces";
import { CommandRunOptions } from "types";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { LEAVE_TIMEOUT_MS } from 'constant';

@injectable()
export class PlayCommand implements Command {
  readonly name = "play";
  readonly description =
    "Воспроизвеcти песню или поставить ее в очередь (Supports: YouTube, Spotify, SoundCloud)";
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

    if (!message.guild) {
      throw new Error();
    }

    const queue = this.playerController.player.createQueue(message.guild, {
      ytdlOptions: {
        quality: "highest",
        filter: "audioonly",
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
      },
      leaveOnEnd: false,
      leaveOnEmptyCooldown: LEAVE_TIMEOUT_MS,
      metadata: {
        channel: voiceChannel,
      },
    });

    this.playerController.onActive();

    try {
      if (!queue.connection) await queue.connect(voiceChannel);
    } catch {
      queue.destroy();
      throw new Error("Не могу присоединиться к каналу!");
    }

    const track = await this.playerController.player
      .search(args[0], {
        requestedBy: message.member.user,
      })
      .then((x) => x.tracks[0]);


    if (!track) {
      throw new Error(`❌ | Музыка **${args[0]}** не найдена!`);
    }

    queue.play(track);
  }
}
