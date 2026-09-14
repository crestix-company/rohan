import {readFile, readdir, stat} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(new URL('../dist/',import.meta.url).pathname);
const base=process.argv[2];
const pages=['index.html','menu.html','space.html','access.html','404.html'];
const docs=new Map(await Promise.all(pages.map(async p=>[p,await readFile(resolve(root,p),'utf8')])));
const assets=new Set();
for(const [name,html] of docs){
 assert.match(html,/串揚げと魚 ろはん/);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,name+' h1');
 assert.match(html,/<html lang="ja">/);assert.match(html,/name="viewport"/);assert.match(html,/rel="icon"/);
 assert.doesNotMatch(html,/TODO|Lorem ipsum|localhost|README|undefined|NaN/);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,name+' duplicate ids');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=match[1];if(/^(https?:|tel:|data:)/.test(url))continue;
  assert.ok(!url.startsWith('/'),`${name}: root-relative URL breaks project Pages: ${url}`);
  const [path,hash]=url.split('#');const file=path||name;const content=docs.get(file);
  assert.ok((await stat(resolve(root,file))).size>0,`${name}: ${url}`);
  if(hash){assert.ok(content?.includes(`id="${hash}"`),`${name}: missing anchor ${url}`);}
  if(path&&!path.endsWith('.html'))assets.add(path);
 }
 for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const entry of match[1].split(',')){const asset=entry.trim().split(' ')[0];assert.ok((await stat(resolve(root,asset))).size>0);assets.add(asset);}
 for(const match of html.matchAll(/<img[^>]*>/g)){assert.match(match[0],/alt="[^"]+"/);assert.match(match[0],/width="\d+"/);assert.match(match[0],/height="\d+"/);}
 for(const match of html.matchAll(/<a[^>]*target="_blank"[^>]*>/g))assert.match(match[0],/noopener/);
 if(base){const u=new URL(name==='index.html'?'':name,base.endsWith('/')?base:base+'/');const r=await fetch(u);assert.ok(r.ok,`${u} ${r.status}`);assert.equal(await r.text(),html,`${u}: actual served version differs`);}
}
if(base)for(const asset of assets){const r=await fetch(new URL(asset,base.endsWith('/')?base:base+'/'));assert.ok(r.ok,asset);assert.ok((await r.arrayBuffer()).byteLength>0,asset);}
assert.match(docs.get('menu.html'),/ちょい飲みセット/);assert.match(docs.get('access.html'),/0246-25-3175/);assert.match(docs.get('access.html'),/ドリンク L.O. 22:00/);assert.match(docs.get('index.html'),/九月から五月まで/);
let bytes=0;for(const f of await readdir(resolve(root,'assets')))bytes+=(await stat(resolve(root,'assets',f))).size;
console.log(`PASS: ${pages.length} pages, ${assets.size} referenced assets, links/anchors/metadata/identity. All assets: ${(bytes/1024/1024).toFixed(2)} MiB.`);
