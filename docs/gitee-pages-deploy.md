# Gitee Pages 部署指南

本项目支持自动部署到 Gitee Pages，适合国内用户访问。

## 前置条件

1. **Gitee 账号** - 注册地址：https://gitee.com/signup
2. **Gitee 仓库** - 需要在 Gitee 上创建对应仓库
3. **Gitee 个人访问令牌** - 用于 GitHub Actions 推送

## 步骤一：在 Gitee 导入仓库

### 方案 A：直接导入（推荐）

1. 登录 Gitee，点击右上角 **+** → **从 GitHub / GitLab 导入仓库**
2. 输入 GitHub 仓库地址：
   ```
   https://github.com/xiaoming-980101/Cent-beihun
   ```
3. 设置仓库名称（建议保持一致）：`Cent-beihun`
4. 点击导入，Gitee 会自动同步 GitHub 仓库内容

### 方案 B：手动创建并推送

```bash
# 添加 Gitee 远程仓库
git remote add gitee https://gitee.com/<你的用户名>/Cent-beihun.git

# 推送代码
git push gitee main
```

## 步骤二：创建 Gitee 个人访问令牌

1. 登录 Gitee → **设置** → **私人令牌** → **生成新令牌**
2. 勾选权限：
   - `projects`（仓库读写）
   - `pull_requests`（可选）
3. 复制生成的令牌（**只显示一次，务必保存**）

## 步骤三：配置 GitHub Secrets

在你的 GitHub 仓库中添加以下 Secrets：

1. 打开 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `GITEE_TOKEN` | `你的Gitee令牌` | 个人访问令牌 |
| `GITEE_REPO` | `<用户名>/Cent-beihun` | Gitee 仓库地址（不带 https://） |

示例：
```
GITEE_TOKEN = a1b2c3d4e5f6g7h8i9j0
GITEE_REPO = xiaoming/Cent-beihun
```

## 步骤四：启用 Gitee Pages

1. 打开 Gitee 仓库 → **服务** → **Gitee Pages**
2. 选择部署分支：`gh-pages`
3. 选择部署目录：`/`（根目录）
4. 点击 **启动**

部署完成后，访问地址为：
```
https://<用户名>.gitee.io/Cent-beihun
```

## 自动部署流程

配置完成后，每次推送到 GitHub `main` 分支时：

1. GitHub Actions 自动触发构建
2. 构建产物推送到 Gitee `gh-pages` 分支
3. Gitee Pages 自动更新站点

## 手动触发部署

在 GitHub 仓库页面：
- **Actions** → **Deploy to Gitee Pages** → **Run workflow**

## 本地测试构建

```bash
pnpm build
pnpm preview
```

## 常见问题

### Q: Gitee Pages 更新不及时？
A: Gitee Pages 有缓存，更新后可能需要几分钟生效。可在 Gitee Pages 页面点击 **更新** 按钮。

### Q: 404 错误？
A: 检查：
- `gh-pages` 分支是否存在且有内容
- Gitee Pages 是否正确配置分支和目录
- 仓库是否公开（Gitee Pages 要求仓库公开）

### Q: 如何使用自定义域名？
A:
1. 在域名 DNS 添加 CNAME 记录指向 `<用户名>.gitee.io`
2. 在 Gitee Pages 设置中绑定自定义域名
3. 在仓库根目录创建 `CNAME` 文件，内容为你的域名

## 注意事项

- Gitee Pages 仅支持公开仓库
- 免费版 Gitee Pages 有带宽限制，个人项目通常够用
- 如需更强性能，可考虑 Gitee Pages Pro（付费）