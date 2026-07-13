import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import type { ContentSource } from "../../content";

export class FileSystemContentSource implements ContentSource {
  private readonly root: string;

  constructor(root: string) {
    this.root = resolve(root);
  }

  public async read(path: string): Promise<string> {
    const target = resolve(this.root, path);
    const relativePath = relative(this.root, target);

    if (
      relativePath === "" ||
      relativePath.startsWith("..") ||
      isAbsolute(relativePath)
    ) {
      throw new Error("Content paths must stay inside the configured root.");
    }

    return readFile(target, "utf8");
  }
}
