import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const sourceDir = 'src';
const distDir = 'dist';

const shouldCopyFile = (filePath) => !filePath.endsWith('.ts') && !filePath.endsWith('.tsx');

const copyStatic = (fromDir, toDir) => {
    for (const entry of readdirSync(fromDir, { withFileTypes: true })) {
        const fromPath = join(fromDir, entry.name);
        const toPath = join(toDir, entry.name);

        if (entry.isDirectory()) {
            copyStatic(fromPath, toPath);
            continue;
        }

        if (!shouldCopyFile(fromPath)) {
            continue;
        }

        mkdirSync(dirname(toPath), { recursive: true });
        cpSync(fromPath, toPath);
    }
};

if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
}

mkdirSync(distDir, { recursive: true });
copyStatic(sourceDir, distDir);
