import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await processDir(fullPath);
        } else if (file.endsWith('.png')) {
            const outPath = fullPath.replace('.png', '.webp');
            await sharp(fullPath).webp({ quality: 80 }).toFile(outPath);
            fs.unlinkSync(fullPath);
            console.log(`Converted ${file} to webp and deleted original.`);
        }
    }
}

processDir(path.join(process.cwd(), 'public/products')).then(() => console.log('Done')).catch(console.error);
