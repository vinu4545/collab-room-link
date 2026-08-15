import { promises as fs } from 'fs';
import path from 'path';

// The Vite/Nitro build emits the static client bundle to dist/client.
// Vercel (outputDirectory: dist/client) serves that folder as a static site,
// with an SPA fallback to index.html for direct URL access / refresh.
const clientDir = path.resolve('dist', 'client');

const themeScript =
    '(function(){try{var k="terminal-theme";var s=localStorage.getItem(k);' +
    'var m=window.matchMedia("(prefers-color-scheme: dark)").matches;' +
    'var t=s==="light"||s==="dark"?s:(m?"dark":"light");var e=document.documentElement;' +
    'e.classList.toggle("dark",t==="dark");e.style.colorScheme=t;}catch(e){}})();';

async function generateIndexHtml(destDir) {
    const assetsDir = path.join(destDir, 'assets');
    let css = '';
    const scripts = [];
    const files = await fs.readdir(assetsDir);
    for (const f of files) {
        if (/^styles-.*\.css$/.test(f)) css = `/assets/${f}`;
    }
    const client = files.find((f) => /^client-.*\.js$/.test(f));
    if (client) scripts.push(`/assets/${client}`);

    if (!client) {
        throw new Error('Could not find the client entry bundle in dist/client/assets');
    }

    const title = 'Terminal Workspace';
    const description =
        'Create or join a private terminal to chat and share practical files instantly.';

    const html = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        ${css ? `<link rel="stylesheet" href="${css}" />` : ''}
        <script>${themeScript}</script>
    </head>
    <body>
        ${scripts.map((s) => `<script type="module" src="${s}"></script>`).join('\n        ')}
    </body>
</html>`;

    await fs.writeFile(path.join(destDir, 'index.html'), html, 'utf8');
    // 404.html mirrors index.html so static hosts fall back to the SPA too.
    await fs.writeFile(path.join(destDir, '404.html'), html, 'utf8');
}

(async () => {
    try {
        await fs.access(clientDir);
        await generateIndexHtml(clientDir);
        console.log('Generated dist/client/index.html for static SPA hosting');
    } catch (err) {
        console.error('Failed to generate the static index.html:', err);
        process.exitCode = 1;
    }
})();
