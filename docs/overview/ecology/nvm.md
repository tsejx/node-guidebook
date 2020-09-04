---
nav:
  title: 概览
  order: 1
group:
  title: 生态
  order: 3
title: nvm
order: 5
---

# NVM

## 安装

Linux 安装

```bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash

source ~/.bashrc
```

MacOS 安装

```bash
curl -0- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

## 常用命令

```bash
# 显示所有信息
nvm --help
# 显示当前安装的nvm版本
nvm --version


# 安装指定的版本，如果不存在.nvmrc,就从指定的资源下载安装
nvm install [-s] <version>
# 安装指定的版本，平且下载最新的npm
nvm install [-s] <version>  -latest-npm
# 卸载指定的版本
nvm uninstall <version>

# 使用已经安装的版本  切换版本
nvm use [--silent] <version>
# 查看当前使用的node版本
nvm current
# 查看已经安装的版本
nvm ls
# 查看指定版本
nvm ls  <version>
# 显示远程所有可以安装的nodejs版本
nvm ls-remote
# 查看长期支持的版本
nvm ls-remote --lts

# 安装罪行的npm
nvm install-latest-npm
# 重新安装指定的版本
nvm reinstall-packages <version>
# 显示nvm的cache
nvm cache dir
# 清空nvm的cache
nvm cache clear
```
