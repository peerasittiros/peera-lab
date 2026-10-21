// Creates content/products/<slug>.json (or content/projects/ with --projects) as a draft, ready to fill in.
// Usage: npm run new-product -- <slug> [preview]
//        npm run new-project -- <slug> [preview]
//   slug     lowercase letters, digits and hyphens (it becomes the URL: /th/products/<slug>)
//   preview  table | calendar | board | dashboard (the skeleton shown until there are screenshots), default dashboard
// The file starts with "draft": true, so it builds and validates but stays off the site until you remove that line.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const kind = args.includes('--projects') ? 'projects' : 'products';
const [slug, preview = 'dashboard'] = args.filter((arg) => arg !== '--projects');
const previews = ['table', 'calendar', 'board', 'dashboard'];

function fail(message) {
  console.error(`new-product: ${message}`);
  process.exit(1);
}

if (!slug) fail(`give a slug, for example: npm run new-${kind.slice(0, -1)} -- clinic-queue`);
if (!/^[a-z0-9-]+$/.test(slug)) fail(`"${slug}" must be lowercase letters, digits and hyphens`);
if (!previews.includes(preview)) fail(`preview must be one of ${previews.join(', ')}`);

const dir = path.join(process.cwd(), 'content', kind);
const file = path.join(dir, `${slug}.json`);
if (existsSync(file)) fail(`content/${kind}/${slug}.json already exists`);
mkdirSync(dir, { recursive: true });

// Put the new item after the existing ones in the Lab.
const orders = readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .map((name) => JSON.parse(readFileSync(path.join(dir, name), 'utf8')).order)
  .filter((order) => typeof order === 'number');
const order = orders.length ? Math.max(...orders) + 1 : 1;

const name = slug
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const product = {
  slug,
  draft: true,
  title: { en: name, th: name },
  tagline: { en: 'One sentence: what it does and for whom.', th: 'หนึ่งประโยค: ทำอะไร และทำให้ใคร' },
  category: { en: 'Category', th: 'หมวดหมู่' },
  status: 'concept',
  order,
  startedAt: new Date().toISOString().slice(0, 10),
  problem: { en: 'The problem it solves.', th: 'ปัญหาที่มันแก้' },
  value: { en: 'What changes for the user.', th: 'สิ่งที่ผู้ใช้ได้' },
  technologies: [],
  preview,
  sections: [{ type: 'overview', body: { en: 'A short overview.', th: 'ภาพรวมสั้น ๆ' } }],
};

writeFileSync(file, `${JSON.stringify(product, null, 2)}\n`, 'utf8');
mkdirSync(path.join(process.cwd(), 'public', 'images', kind, slug), { recursive: true });

console.log(`Created content/${kind}/${slug}.json (draft) and public/images/${kind}/${slug}/`);
console.log('Next: fill in both en and th, then delete the "draft": true line to publish. See content/README.md.');
