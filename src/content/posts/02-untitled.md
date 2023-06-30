---
title: "Linux MySQL 5.7.x Installation"
publishedAt: 2023-06-30
description: "Tutorial for Installing MySQL 5.7.x in CentOS"
slug: "Linux"
isPublish: true
---

本安装流程仅 *CentOS* 及 *RHEL 7* 操作系统上验证有效，请勿在*Ubuntu* *Debain* *Kali* 等不同操作系统上尝试。

This installation  is only valid on *CentOS* and *RHEL 7* operating systems, please do not try it on a different OS like *Ubuntu* *Debain* *Kali*.



### Server and Client

```shell
# Enable MySQL Repository
sudo yum localinstall https://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm

# Enable GPG KEY
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022

# Install MySQL-server
sudo yum install mysql-community-server

# Check Genreal Password
sudo grep 'A temporary password' /var/log/mysqld.log |tail -1

# Start Service
sudo systemctl start mysqld

# Initial MySQL Configuration
/usr/bin/mysql_secure_installation
```

```shell
# MySQL Configuration Output:

Securing the MySQL server deployment.

Enter password for user root: **********

The 'validate_password' plugin is installed on the server.
The subsequent steps will run with the existing configuration
of the plugin.
Using existing password for root.

Estimated strength of the password: 100
Change the password for root ? ((Press y|Y for Yes, any other key for No) : y

New password: ******************

Re-enter new password: ******************

Estimated strength of the password: 100
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
Success.


Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y
Success.

By default, MySQL comes with a database named 'test' that
anyone can access. This is also intended only for testing,
and should be removed before moving into a production
environment.


Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
 - Dropping test database...
Success.

 - Removing privileges on test database...
Success.

Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
Success.

All done!
```

```shell
# Login
mysql -h localhost -u root -p

# CREATE NEW DATABASE
mysql> CREATE DATABASE mydb;

# CREATE MYSQL USER FOR DATABASE
mysql> CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'password';

# GRANT Permission to User on Database
mysql> GRANT ALL ON mydb.* TO 'db_user'@'localhost';

# RELOAD PRIVILEGES
mysql> FLUSH PRIVILEGES;
```

### Client Only

```shell
# Enable MySQL Repository
sudo yum localinstall https://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm

# Enable GPG KEY
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022

# Install MySQL-server
sudo yum install mysql-community-client

# Use Client
$ mysql -h $host -u $user -p
Enter password: $password
```
