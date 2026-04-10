/**
 * 阿里云函数计算 FC 静态网站服务
 * 用于托管 Cent 应用的静态文件
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9000;
const ROOT_DIR = process.env.CODE_ROOT || '/code';

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

/**
 * 处理静态文件请求
 */
function serveStatic(req, res) {
  let urlPath = req.url.split('?')[0]; // 移除查询参数

  // 默认首页处理
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  // SPA 路由处理：非静态文件请求返回 index.html
  const ext = path.extname(urlPath);
  if (!ext || !MIME_TYPES[ext]) {
    urlPath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, urlPath);

  // 安全检查：防止路径遍历攻击
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // 读取文件
  fs.readFile(normalizedPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在，返回 index.html（SPA 路由）
        fs.readFile(path.join(ROOT_DIR, '/index.html'), (err2, indexData) => {
          if (err2) {
            res.writeHead(500);
            res.end('Internal Server Error');
          } else {
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=3600',
            });
            res.end(indexData);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    } else {
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // 根据文件类型设置缓存策略
      let cacheControl = 'public, max-age=3600'; // 默认 1 小时
      if (ext === '.js' || ext === '.css' || ext === '.woff2') {
        cacheControl = 'public, max-age=31536000, immutable'; // 静态资源 1 年
      } else if (ext === '.html') {
        cacheControl = 'public, max-age=0, must-revalidate'; // HTML 不缓存
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(data);
    }
  });
}

/**
 * FC 入口处理器
 */
exports.handler = (req, resp, context) => {
  serveStatic(req, resp);
};

/**
 * 本地开发服务器（用于测试）
 */
if (require.main === module) {
  const server = http.createServer((req, res) => {
    // 模拟 FC 环境
    process.env.CODE_ROOT = './dist';
    serveStatic(req, res);
  });

  server.listen(PORT, () => {
    console.log(`静态网站服务已启动: http://localhost:${PORT}`);
    console.log(`服务根目录: ${ROOT_DIR}`);
  });
}