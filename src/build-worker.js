// 构建脚本 - 将 HTML 内嵌到 Worker 中
const fs = require('fs');
const path = require('path');

// 读取 HTML 文件
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// 转义 HTML 中的特殊字符
const escapedHtml = htmlContent
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$/g, '\\$');

// 读取 worker 模板
const workerPath = path.join(__dirname, 'script.js');
let workerContent = fs.readFileSync(workerPath, 'utf-8');

// 检查是否需要内嵌 HTML
if (workerContent.includes('HTML_PLACEHOLDER')) {
  workerContent = workerContent.replace('HTML_PLACEHOLDER', escapedHtml);
} else {
  // 如果没有占位符，在返回 HTML 的地方内嵌
  workerContent = workerContent.replace(
    /const html = await fetch\('.*?'\);[\s\S]*?return new Response\(html\.body/,
    `return new Response(\`${escapedHtml}\``
  );
}

// 输出到 index.js
const outputPath = path.join(__dirname, 'index.js');
fs.writeFileSync(outputPath, workerContent);

console.log('✅ Worker 构建完成: src/index.js');
