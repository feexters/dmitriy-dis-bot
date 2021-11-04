import { PathLike, readdir } from "fs";
import { injectable } from "inversify";

@injectable()
export class FileService {
  readdir(
    path: PathLike,
    options:
      | {
          encoding: BufferEncoding | null;
          withFileTypes?: false | undefined;
        }
      | BufferEncoding
      | undefined
      | null,
    callback: (err: NodeJS.ErrnoException | null, files: string[]) => void
  ) {
    readdir(path, options, callback);
  }
}
