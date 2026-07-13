import type { ContentReference } from "../graph";
import type { ContentLoader } from "./ContentLoader";
import type { ContentSource } from "./ContentSource";
import type { LoadedContent } from "./LoadedContent";

export class MarkdownContentLoader implements ContentLoader {
  constructor(private readonly source: ContentSource) {}

  public async load(reference: ContentReference): Promise<LoadedContent> {
    if (reference.format !== "markdown") {
      throw new Error(`Unsupported content format: ${reference.format}`);
    }

    return {
      reference,
      body: await this.source.read(reference.path),
    };
  }
}
