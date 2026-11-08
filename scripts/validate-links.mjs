import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MARKDOWN_DIRS = [
  'docs',
  'docs/components',
  'docs/runbooks',
  'docs/api',
];
const MARKDOWN_FILES = [
  'README.md',
];

function findMarkdownFiles() {
  const files = [];
  for (const dir of MARKDOWN_DIRS) {
    const fullDir = path.join(ROOT, dir);
    if (fs.existsSync(fullDir)) {
      walkDir(fullDir, files);
    }
  }
  for (const file of MARKDOWN_FILES) {
    const fullFile = path.join(ROOT, file);
    if (fs.existsSync(fullFile)) {
      files.push(fullFile);
    }
  }
  return files;
}

function walkDir(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, files);
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
}

function extractLinks(content, filePath) {
  const links = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const [fullMatch, text, url] = match;
      links.push({ file: filePath, line: i + 1, text, url, fullMatch });
    }
  }
  return links;
}

function isExternalLink(url) {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('#');
}

function resolveLink(baseFile, url) {
  if (isExternalLink(url)) return null;
  
  // Handle fragments (e.g., ApiError.md#constructor)
  const [filePart, fragment] = url.split('#');
  const baseDir = path.dirname(baseFile);
  const linkPath = path.resolve(baseDir, filePart || '');
  
  if (filePart.endsWith('.md') || filePart.endsWith('.mdx')) {
    return linkPath;
  }
  
  if (!path.extname(filePart)) {
    return linkPath + '.md';
  }
  
  return linkPath;
}

function checkFileExists(filePath) {
  // Remove fragment if present
  const basePath = filePath.split('#')[0];
  return fs.existsSync(basePath);
}

function validateLinks() {
  const markdownFiles = findMarkdownFiles();
  const allFiles = new Set(markdownFiles.map(f => path.relative(ROOT, f)));
  
  console.log(`Found ${markdownFiles.length} markdown files to check\n`);
  
  let totalLinks = 0;
  let brokenLinks = 0;
  let externalLinks = 0;
  
  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractLinks(content, file);
    
    for (const link of links) {
      totalLinks++;
      
      if (isExternalLink(link.url)) {
        externalLinks++;
        continue;
      }
      
      const resolved = resolveLink(file, link.url);
      if (!resolved) continue;
      
      const relativeResolved = path.relative(ROOT, resolved);
      
      if (!checkFileExists(resolved)) {
        console.log(`❌ BROKEN: ${path.relative(ROOT, file)}:${link.line}`);
        console.log(`   [${link.text}](${link.url})`);
        console.log(`   → Resolved to: ${relativeResolved} (NOT FOUND)\n`);
        brokenLinks++;
      }
    }
  }
  
  console.log('─'.repeat(60));
  console.log(`Total links checked: ${totalLinks}`);
  console.log(`External links skipped: ${externalLinks}`);
  console.log(`Broken internal links: ${brokenLinks}`);
  
  if (brokenLinks > 0) {
    process.exit(1);
  } else {
    console.log('✅ All internal links valid!');
  }
}

validateLinks();