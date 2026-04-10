#!/bin/bash
# Cent 项目部署到阿里云函数计算 FC
# 使用 Serverless Devs 工具

set -e

echo "=== Cent 静态网站部署到阿里云 FC ==="

# 检查 s 工具是否安装
if ! command -v s &> /dev/null; then
    echo "正在安装 Serverless Devs 工具..."
    npm install -g @serverless-devs/s
fi

# 检查是否已配置阿里云密钥
echo "检查阿里云密钥配置..."
s config get

# 构建项目
echo "构建项目..."
pnpm build

# 部署到 FC
echo "部署到函数计算..."
s deploy -y

echo "=== 部署完成 ==="
echo "访问地址将在部署输出中显示"