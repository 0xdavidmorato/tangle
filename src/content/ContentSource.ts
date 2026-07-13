export interface ContentSource {
  read(path: string): Promise<string>;
}
