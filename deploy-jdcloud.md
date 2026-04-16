# 京东云服务器部署指南

## 项目信息

- **项目名称**: Cent (日计记账应用)
- **技术栈**: Vite + React 19 + TypeScript
- **构建产物**: 静态 SPA 应用 (dist 目录)
- **部署方式**: Nginx 静态托管

---

## 一、京东云服务器准备

### 1.1 连接服务器

```bash
# SSH 连接（替换为你的服务器 IP）
ssh root@你的服务器IP

# 或使用京东云控制台的远程连接功能
```

### 1.2 安装 Nginx

```bash
# CentOS/RHEL
yum install -y nginx

# Ubuntu/Debian
apt update && apt install -y nginx

# 启动 Nginx
systemctl start nginx
systemctl enable nginx
```

### 1.3 创建部署目录

```bash
mkdir -p /var/www/cent/dist
```

---

## 二、上传构建产物

### 2.1 本地构建（在你的开发机器上）

```bash
# 进入项目目录
cd D:\ai\dinghun\Cent-beihun

# 安装依赖（如果未安装）
pnpm install

# 构建
pnpm build

# 构建产物在 dist 目录
```

### 2.2 上传到服务器

**方式一：SCP 上传**

```bash
# Windows PowerShell 或 Git Bash
scp -r dist/* root@你的服务器IP:/var/www/cent/dist/
```

**方式二：使用 SFTP 工具**

- 使用 FileZilla、WinSCP 等工具
- 连接服务器后，将 dist 目录内容上传到 `/var/www/cent/dist/`

**方式三：京东云控制台上传**

- 如果服务器有京东云对象存储，可通过控制台上传

---

## 三、配置 Nginx

### 3.1 复制配置文件

将项目中的 `nginx.conf` 复制到服务器：

```bash
# 在服务器上
scp nginx.conf root@你的服务器IP:/etc/nginx/conf.d/cent.conf

# 或直接编辑
vim /etc/nginx/conf.d/cent.conf
```

### 3.2 修改配置

编辑 `/etc/nginx/conf.d/cent.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP
    
    root /var/www/cent/dist;
    ...
}
```

### 3.3 测试并重启

```bash
# 测试配置
nginx -t

# 重载配置
nginx -s reload

# 或重启服务
systemctl restart nginx
```

---

## 四、验证部署

### 4.1 访问测试

```bash
# 在浏览器访问
http://你的服务器IP

# 或使用 curl 测试
curl -I http://localhost
```

### 4.2 检查文件

```bash
# 确认文件已上传
ls -la /var/www/cent/dist/

# 应包含：
# index.html, assets/, sw.js, manifest.webmanifest, icon.png, favicon.ico
```

---

## 五、域名配置（可选）

### 5.1 域名解析

在京东云 DNS 或域名服务商配置：
- A 记录指向服务器 IP

### 5.2 SSL 证书（HTTPS）

**使用 Let's Encrypt 免费证书：**

```bash
# 安装 certbot
yum install -y certbot python3-certbot-nginx  # CentOS
apt install -y certbot python3-certbot-nginx  # Ubuntu

# 获取证书
certbot --nginx -d your-domain.com

# 自动续期
certbot renew --dry-run
```

**京东云 SSL 证书：**
- 在京东云控制台申请 SSL 证书
- 配置 Nginx 使用证书

---

## 六、常见问题

### Q1: 访问显示 404

检查 Nginx 配置的 root 路径是否正确：
```bash
nginx -t
ls -la /var/www/cent/dist/
```

### Q2: 页面空白

检查 index.html 是否存在，查看浏览器控制台错误。

### Q3: 路由刷新 404

确保 Nginx 配置了 `try_files $uri $uri/ /index.html;`

### Q4: 权限问题

```bash
# 设置正确权限
chown -R nginx:nginx /var/www/cent
chmod -R 755 /var/www/cent
```

---

## 七、自动化部署（可选）

### 7.1 创建部署脚本

在服务器创建 `/root/deploy-cent.sh`：

```bash
#!/bin/bash
cd /var/www/cent/dist
rm -rf *
# 从 GitHub 拉取最新构建产物
# 或等待本地 scp 上传
nginx -s reload
echo "部署完成"
```

### 7.2 GitHub Actions 自动部署

可配置 GitHub Actions 在构建完成后自动上传到京东云服务器。

---

## 八、防火墙配置

确保服务器防火墙开放 HTTP/HTTPS 端口：

```bash
# CentOS firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# Ubuntu ufw
ufw allow 'Nginx Full'
```

---

## 部署完成清单

- [ ] Nginx 已安装并启动
- [ ] dist 文件已上传到 /var/www/cent/dist
- [ ] nginx.conf 已配置并生效
- [ ] 域名已解析（如有）
- [ ] HTTPS 证书已配置（如有）
- [ ] 防火墙已开放端口
- [ ] 应用可正常访问