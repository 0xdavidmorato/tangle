const assert = require("node:assert/strict");
const test = require("node:test");
const { readdir } = require("node:fs/promises");
const { join, relative, sep } = require("node:path");

const {
  MarkdownContentLoader,
} = require("../.test-dist/content/MarkdownContentLoader.js");
const {
  FileSystemContentSource,
} = require("../.test-dist/infrastructure/content/FileSystemContentSource.js");
const { tangleGraph } = require("../.test-dist/graph/tangleGraph.js");

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? findMarkdownFiles(path)
        : Promise.resolve(path.endsWith(".md") ? [path] : []);
    }),
  );
  return nested.flat();
}

test("markdown loader delegates content retrieval without interpreting it", async () => {
  const reads = [];
  const loader = new MarkdownContentLoader({
    async read(path) {
      reads.push(path);
      return "# Preserved Markdown";
    },
  });
  const reference = {
    path: "docs/content/boa-empresa/visao-geral.md",
    format: "markdown",
  };

  const content = await loader.load(reference);

  assert.deepEqual(reads, [reference.path]);
  assert.equal(content.reference, reference);
  assert.equal(content.body, "# Preserved Markdown");
});

test("filesystem content source reads repository content and rejects traversal", async () => {
  const source = new FileSystemContentSource(process.cwd());
  const body = await source.read(
    "docs/content/boa-empresa/visao-geral.md",
  );

  assert.match(body, /Visão Geral/);
  await assert.rejects(() => source.read("../outside.md"));
});

test("every content Markdown is mapped exactly once and can be loaded", async () => {
  const root = process.cwd();
  const contentFiles = (await findMarkdownFiles(join(root, "docs/content")))
    .map((path) => relative(root, path).split(sep).join("/"))
    .sort();
  const graphReferences = tangleGraph.nodes
    .flatMap((node) => node.content.map((reference) => reference.path))
    .sort();

  assert.deepEqual(graphReferences, contentFiles);
  assert.equal(new Set(graphReferences).size, graphReferences.length);

  const loader = new MarkdownContentLoader(new FileSystemContentSource(root));
  const loaded = await Promise.all(
    tangleGraph.nodes.flatMap((node) =>
      node.content.map((reference) => loader.load(reference)),
    ),
  );

  assert.ok(loaded.every((content) => content.body.trim().length > 0));
});
