const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');
const copyDir = (src, dest, callback) => {
    const copy = (copySrc, copyDest) => {
        fs.readdir(copySrc, (err, list) => {
            if (err) {
                callback(err);
                return;
            }
            list.forEach((item) => {
                const ss = path.resolve(copySrc, item);
                fs.stat(ss, (err, stat) => {
                    if (err) {
                        callback(err);
                    } else {
                        const curSrc = path.resolve(copySrc, item);
                        const curDest = path.resolve(copyDest, item);

                        if (stat.isFile()) {
                            // 文件，直接复制
                            fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest));
                        } else if (stat.isDirectory()) {
                            // 目录，进行递归
                            fs.mkdirSync(curDest, { recursive: true });
                            copy(curSrc, curDest);
                        }
                    }
                });
            });
        });
    };
    fs.access(dest, (err) => {
        if (err) {
            // 若目标目录不存在，则创建
            fs.mkdirSync(dest, { recursive: true });
        }
        copy(src, dest);
    });

};

// 清空dist目录
if (fs.existsSync(distDir)) {
    fs.rmdirSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);
// // 复制src目录下的所有文件（包括子目录）到dist目录
copyDir(srcDir, distDir);


// // 复制README.MD文件到dist目录
const readmeFile = path.join(srcDir, '../README.MD');
const distReadmeFile = path.join(distDir, 'README.MD');
fs.copyFileSync(readmeFile, distReadmeFile);

// // 复制package.json文件到dist目录
const packageFile = path.join(srcDir, '../package.json');
const distPackageFile = path.join(distDir, 'package.json');
fs.copyFileSync(packageFile, distPackageFile);

console.log('请将dist目录发布到npm仓库') // eslint-disable-line
