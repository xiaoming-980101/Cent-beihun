# 阿里云函数计算 FC 部署指南

## 一、前置准备

### 1. 安装 Serverless Devs 工具

```bash
npm install -g @serverless-devs/s
```

### 2. 配置阿里云密钥

```bash
s config add
```

按提示输入：
- AccountID: 阿里云账号 ID
- AccessKeyID: 阿里云 AccessKey ID
- AccessKeySecret: 阿里云 AccessKey Secret

获取密钥位置：[阿里云控制台 -> AccessKey 管理](https://ram.console.aliyun.com/manage/ak)

### 3. 选择部署区域

推荐区域：
- `cn-hangzhou` - 华东1（杭州）
- `cn-shanghai` - 华东2（上海）
- `cn-shenzhen` - 华南1（深圳）

---

## 二、部署步骤

### 方式 1：使用部署脚本

```bash
# Windows 用户使用 Git Bash 或手动执行步骤
bash deploy-fc.sh
```

### 方式 2：手动执行

```bash
# 1. 构建项目
pnpm build

# 2. 部署到 FC
s deploy
```

---

## 三、部署结果

部署成功后会显示：

```
✅ cent-static-website
  - 函数名称: cent-static-website
  - 触发器: httpTrigger
  - 访问地址: https://cent-static-website.cn-hangzhou.fc.aliyuncs.com
```

测试域名格式：`https://{函数名}.{区域}.fc.aliyuncs.com`

---

## 四、域名配置（备案后）

如果域名已备案，可以绑定自定义域名：

### 1. 在 FC 控制台配置自定义域名

访问：[函数计算控制台 -> 自定义域名](https://fc.console.aliyun.com/domain)

### 2. 配置路由

| 路径 | 函数 |
|------|------|
| `/` | cent-static-website |

### 3. DNS 解析

在域名 DNS 解析中添加 CNAME 记录：

```
cent.example.com -> {区域}.fc.aliyuncs.com
```

---

## 五、费用说明

函数计算 FC 费用：

| 项目 | 免费额度 | 超出费用 |
|------|----------|----------|
| 函数调用次数 | 100 万次/月 | 0.0133 元/万次 |
| 函数执行时间 | 40 万 CU/月 | 0.00003167 元/CU-秒 |
| 公网流量 | 无 | 0.8 元/GB |

对于静态网站（低并发），每月费用通常 < 5 元。

---

## 六、常见问题

### Q1: 部署报错 "AccessKey not found"

重新配置密钥：
```bash
s config add --access default
```

### Q2: 函数启动超时

修改 `s.yaml` 中的 `timeout` 增大。

### Q3: 部署后访问空白页面

检查 `server.js` 是否正确处理 SPA 路由。

---

## 七、持续部署

建议配置 CI/CD 自动部署：

```yaml
# GitHub Actions 示例
name: Deploy to Aliyun FC

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: npm install -g @serverless-devs/s
      - run: s config add --AccountID ${{ secrets.ALIYUN_ACCOUNT_ID }} --AccessKeyID ${{ secrets.ALIYUN_AK_ID }} --AccessKeySecret ${{ secrets.ALIYUN_AK_SECRET }}
      - run: s deploy -y
```