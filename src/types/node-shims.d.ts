declare module 'fs' {
  const fs: any;
  export = fs;
}

declare module 'path' {
  const path: any;
  export = path;
}

declare module 'url' {
  export function fileURLToPath(path: string): string;
}

declare module 'node:test' {
  const test: any;
  export default test;
}

declare module 'node:assert/strict' {
  const assert: any;
  export default assert;
}

declare const process: { argv: string[] };
declare const __filename: string;
declare const __dirname: string;
