---
nav:
  title: 网络
  order: 4
title: DNS 域名服务器
order: 2
---

# DNS

[关于 DNS 域名解析系统](https://tsejx.github.io/JavaScript-Guidebook/computer-networks/dns.html)

dns 模块用于解析域名。

## 基本概况

dns 模块包含两大类函数：

- 第一类函数，使用底层操作系统工具进行域名解析，且无需进行网络通信。 这类函数只有一个：`dns.lookup()`
- 第二类函数，连接到真实的 DNS 服务器进行域名解析，且始终使用网络进行 DNS 查询。 这类函数包含了 dns 模块中除 `dns.lookup()` 以外的所有函数。 这些函数使用与 `dns.lookup()` 不同的配置文件（例如 `/etc/hosts`）

| 方法    | 功能                                               | 同步 | 网络请求 | 速度 |
| ------- | -------------------------------------------------- | ---- | -------- | ---- |
| lookup  | 通过系统自带的 DNS 缓存（如 `/etc/hosts`）         | 同步 | 无       | 快   |
| resolve | 通过系统配置的 DNS 服务器指定的记录（rrtype 指定） | 异步 | 有       | 慢   |

**dns 模块中 `.loopup` 与 `.resolve` 的区别：**

当你要解析一个域名的 IP 时，通过 `.lookup` 查询直接调用 `getaddrinfo` 来拿去地址，速度很快，但是如果本地的 `hosts` 文件被修改了，`.lookup` 就会拿 `hosts` 文件中的地址，而 `.resolve` 依旧是外部正常的地址。

由于 `.lookup` 是同步的，所以如果由于什么不可控的原因导致 `getaddrinfo` 缓慢或者阻塞是会影响整个 Node 进程的。

## 模块方法

- `dns.lookup(hostname [,options], callback)`：将域名解析为第一条找到的记录
- `dns.resolve(hostname [, rrtype], callback)`：将一个域名解析为一个 rrtype 指定记录类型的数组
- `dns.reverse(ip, callback)`：反向解析 IP 地址，指向该 IP 地址的域名数组
- `dns.getServer()`：返回一个用于当前解析的 IP 地址数组的字符串
- `dns.setServer(servers)`：指定一组 IP 地址作为解析服务器

🌰 **示例：**

```js
const dns = require('dns');

dns.lookup('www.google.com', 4, (err, address) => {
  // do something
});
```

## 记录类型

域名与 IP 之间的对应关系，称为记录（record）。根据使用场景，记录可以分成不同的类型（type）。

常见的 DNS 记录类型：

- **A**：地址记录（Address），将域名指向一个 IPV4 的地址
- **AAAA**：将域名指向一个 IPV6 的地址
- **NS**：域名服务器记录（Name Server），将子域名指定其他 DNS 服务器解析。该记录只能设置为域名，不能设置为 IP 地址。
- **MX**：邮件记录（Mail eXchange），将域名指向邮件服务器地址。
- **CNAME**：规范名称记录（Canonical Name），将域名指向另一个域名，即当前查询的域名是另一个域名的跳转，详见下文。
- **PTR**：逆向查询记录（Pointer Record），只用于从 IP 地址查询域名
- **TXT**：文本长度限制 512，通常做 SPF 记录（反垃圾邮件）
- **CAA**：CA 证书颁发机构授权校验（Certification Authority Authorization）
- **SRV**：服务记录（Service Record），记录提供特定的服务的服务器
- **显性URL**：将域名 302 重定向到另一个地址

一般来说，为了服务的安全可靠，至少应该有两条 NS 记录，而 A 记录和 MX 记录也可以有多条，这样就提供了服务的冗余性，防止出现单点失败。

### CNAME

**CNAME** 记录主要用于域名的内部跳转，为服务器配置提供灵活性，用户感知不到。举例来说，`www.baidu.com` 这个域名就是一个 CNAME 记录。

```bash
$ dig www.baidu.com

;;ANSWER SECTION:
www.baidu.com     1091  IN   CNAME   www.a.shifen.com
www.a.shifen.com  200   IN     A     14.215.177.39
www.a.shifen.com  200   IN     A     14.215.177.38
```

上面结果显示，`www.baidu.com` 的 CNAME 记录指向 `www.a.shifen.com`。也就说，用户查询 `www.baidu.com` 的时候，实际上返回的是 `www.a.shifen.com` 的 IP 地址。

这样的好处是，变更服务器 IP 地址的时候，只要修改 `www.a.shifen.com` 这个域名就可以了，用户的 `www.baidu.com` 域名不用修改。

由于 CNAME 记录就是一个替换，所以域名一旦设置 CNAME 记录以后，就不能再设置其他记录了（比如 A 记录和 MX 记录），这是为了防止产生冲突。举例来说，`foo.com` 指向 `bar.com`，而两个域名各有自己的 MX 记录，如果两者不一致，就会产生问题。由于顶级域名通常要设置 MX 记录，所以一般不允许用户对顶级域名设置 CNAME 记录。

### PTR

PTR 记录用于从 IP 地址反查域名。

逆向查询的一个应用，是可以防止垃圾邮件，即验证发送邮件的 IP 地址，是否真的有它所声称的域名。

## 错误码

| 错误码                   | 语义                        |
| ------------------------ | --------------------------- |
| dns.NODATA               | DNS 服务返回没有数据        |
| dns.FORMERR              | DNS 服务器查询没有格式化    |
| dns.SERVFAIL             | DNS 服务器返回失败          |
| dns.NOTFOUND             | 域名未找到                  |
| dns.NOIMP                | DNS 服务器不执行请求的操作  |
| dns.REFUSED              | 查询 DNS 服务器拒绝         |
| dns.BADQUERY             | 未格式化 DNS 查询           |
| dns.BADNAME              | 未格式化主机                |
| dns.BADFAMILY            | 没有提供地址族              |
| dns.BADRESP              | 未格式化 DNS 回复           |
| dns.CONNREFUSED          | 无法连接 DNS 服务器         |
| dns.TIMEOUT              | 连接 DNS 服务器超时         |
| dns.EOF                  | 文件末尾                    |
| dns.FILE                 | 读取文件错误                |
| dns.NOMEM                | 内存溢出                    |
| dns.DESTRUCTION          | 通道以及销毁                |
| dns.BADSTR               | 未格式化字符串              |
| dns.BADFLAGS             | 指定非法标记                |
| dns.NONAME               | 给定主机名不是数字          |
| dns.BADHINTS             | 指定非法的提示标志          |
| dns.NOTINITIALIED        | 异步 DNS 请求库初始化未完成 |
| dns.LOADIPHLPAPI         | 加载 iphlpapi.dll 错误      |
| dns.ADDRGETNETWORKPARAMS | 找不到读取本机 DNS 信息函数 |
| dns.CANCELLED            | DNS 查询取消                |

---

**参考资料：**

- [📖 NodeJS API Documentation：DNS](http://nodejs.cn/api/dns.html)
- [📝 从 Chrome 源码看 DNS 解析过程](https://juejin.im/post/5a4a2f00f265da431e171da4)
