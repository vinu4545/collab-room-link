import { promises as fs } from 'fs';
import path from 'path';

// TanStack/Nitro emits the static client bundle under .output/public in this project.
// Support both the historical dist/client path and the current Nitro output so the
// build remains reliable in local and deployment environments.
const candidateDirs = [path.resolve('dist', 'client'), path.resolve('.output', 'public')];

const themeScript =
    '(function(){try{var k="terminal-theme";var s=localStorage.getItem(k);' +
    'var m=window.matchMedia("(prefers-color-scheme: dark)").matches;' +
    'var t=s==="light"||s==="dark"?s:(m?"dark":"light");var e=document.documentElement;' +
    'e.classList.toggle("dark",t==="dark");e.style.colorScheme=t;}catch(e){}})();';

async function findStaticOutputDir() {
    for (const dir of candidateDirs) {
        try {
            await fs.access(dir);
            return dir;
        } catch {
            // keep checking remaining candidates
        }
    }
    throw new Error(`Could not find a static output directory in ${candidateDirs.join(', ')}`);
}

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
        throw new Error(`Could not find the client entry bundle in ${assetsDir}`);
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
    await fs.writeFile(path.join(destDir, '404.html'), html, 'utf8');
}

(async () => {
    try {
        const outputDir = await findStaticOutputDir();
        await generateIndexHtml(outputDir);
        console.log(`Generated ${path.relative(process.cwd(), outputDir)}/index.html for static hosting`);
    } catch (err) {
        console.error('Failed to generate the static index.html:', err);
        process.exitCode = 1;
    }
})();
