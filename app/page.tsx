import { MarkdownContentLoader } from "../src/content";
import { tangleGraph } from "../src/graph";
import { FileSystemContentSource } from "../src/infrastructure/content";
import { TangleExperience } from "../src/ui/TangleExperience";

export default async function Home() {
  const loader = new MarkdownContentLoader(
    new FileSystemContentSource(process.cwd()),
  );

  const contentEntries = await Promise.all(
    tangleGraph.nodes.map(async (node) => {
      const reference = node.content[0];
      const loaded = reference ? await loader.load(reference) : null;
      return [node.id, loaded?.body ?? ""] as const;
    }),
  );

  return (
    <TangleExperience
      graph={tangleGraph}
      contentByNodeId={Object.fromEntries(contentEntries)}
    />
  );
}
