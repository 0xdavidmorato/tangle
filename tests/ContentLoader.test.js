const assert = require("node:assert/strict");
const test = require("node:test");

const {
  MarkdownContentLoader,
} = require("../.test-dist/content/MarkdownContentLoader.js");
const {
  FileSystemContentSource,
} = require("../.test-dist/infrastructure/content/FileSystemContentSource.js");

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
