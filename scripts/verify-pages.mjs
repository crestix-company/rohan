import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, sep} from 'node:path';
import {spawn} from 'node:child_process';

// Match the repository's GitHub Pages prefix, not just a localhost root.
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const prefix = '/rohan/';
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!pathname.startsWith(prefix)) {
      res.writeHead(404).end();
      return;
    }
    const file = resolve(root, pathname.slice(prefix.length) || 'index.html');
    if (!file.startsWith(resolve(root) + sep)) {
      res.writeHead(404).end();
      return;
    }
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
try {
  const base = `http://127.0.0.1:${server.address().port}${prefix}`;
  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(new URL('./verify.mjs', import.meta.url)), base], {stdio: 'inherit'});
    child.once('error', reject);
    child.once('exit', code => resolve(code ?? 1));
  });
  process.exitCode = result;
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
