# Redis

## Windows 上安装使用 Redis

在 Windows 上使用 WSL 中启动的 Redis 服务。

1. 下载安装 WSL，在 [Redis 官网](https://redis.io/) 根据指导安装 WSL 上的 Redis。

2. 获取 WSL 的 IP 地址

```bash
hostname -I
```

3. 配置 Redis 允许外部连接

默认情况下，Redis 只监听 `localhost`，所以你需要配置 Redis 监听所有 IP 地址。编辑 Redis 的配置文件 `redis.conf`：

```bash
sudo nano /etc/redis/redis.conf
```

找到以下内容并将其修改：

```text
bind 127.0.0.1 ::1 => bind 0.0.0.0
protected-mode yes => protected-mode no
```

4. 重启 Redis 服务，进行测试链接

```bash
# 启动服务
sudo service redis-server start

# 重启服务
sudo service redis-server restart

# 查看运行状态
sudo service redis-server status

# 关闭服务
sudo service redis-server stop
```

使用 Redis CLI 或其他 Redis 客户端工具来连接到 WSL 中的 Redis 服务

```bash
# 将 <WSL_IP_ADDRESS> 替换为你在步骤 2 中获取的 IP 地址。
redis-cli -h <WSL_IP_ADDRESS> -p 6379
```

测试链接

```bash
127.0.0.1:6379> PING
PONG
```
