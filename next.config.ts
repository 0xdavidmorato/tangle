import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true"
  && process.env.PLAYWRIGHT_TEST !== "true";
const repositoryBasePath = "/tangle";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? repositoryBasePath : "",
  assetPrefix: isGitHubPages ? repositoryBasePath : "",
};

export default nextConfig;
