import { promises as fs } from 'fs';
import path from 'path';

const src = path.resolve('.output', 'public');
const dest = path.resolve('dist');

async function copyDir(srcDir, destDir) {
    await fs.mkdir(destDir, { recursive: true });
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else if (entry.isFile()) {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

async function generateIndexHtml(destDir) {
    const assetsDir = path.join(destDir, 'assets');
    let css = '';
    const scripts = [];
    try {
        const files = await fs.readdir(assetsDir);
        for (const f of files) {
            if (/^styles-.*\.css$/.test(f)) css = `/assets/${f}`;
            if (/^index-.*\.js$/.test(f)) scripts.push(`/assets/${f}`);
        }
        // prefer client script first if exists
        const client = files.find((f) => /^client-.*\.js$/.test(f));
        if (client) scripts.unshift(`/assets/${client}`);
    } catch (e) {
        // ignore
    }

    const title = 'Chat Terminal';
    const html = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${title}</title>
        ${css ? `<link rel="stylesheet" href="${css}" />` : ''}
    </head>
    <body>
        <div id="root"></div>
        ${scripts.map((s) => `<script type="module" src="${s}"></script>`).join('\n    ')}
    </body>
</html>`;

    await fs.writeFile(path.join(destDir, 'index.html'), html, 'utf8');
}

(async () => {
    try {
        // ensure source exists
        await fs.access(src);
        await copyDir(src, dest);
        await generateIndexHtml(dest);
        console.log('Copied .output/public to dist and generated index.html');
    } catch (err) {
        console.error('Failed to copy .output/public to dist or generate index.html:', err);
        process.exitCode = 1;
    }
})();
