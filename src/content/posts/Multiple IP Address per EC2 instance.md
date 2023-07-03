---
title: "Multiple IPs Address per EC2"
publishedAt: 2023-07-02
description: "Bind multiple elastic IPs to a single EC2 instance to realize multiple public IPs in one EC2 instance"
slug: "74c4514e-37bb-4b38-9acc-87d2db542bbf"
isPublish: true
---

### The scenario

One  of my cases, a compnay asked for my assistance with an AWS-related situation.

"Customers need multiple public IPs to support domain name access, and only set the EC2 instance network card and private IP when NLB and GA are not used."

### The problem

AWS official website does not have relevant technical guidance documents.

### The solution

The solution for this scenario is realized by assigning multiple auxiliary IPs through the initialization instance and adding the network card configuration file to the operating system.

#### Create EC2 instance secondary private IP
➊ Go to the EC2 management interface, select the target EC2 instance, click Action , and select'Manage IP Address' in Networking .

➋ Expand'eth0 'main network interface card, click Assign New IP Address , and save.
   In this step, if you do not understand the impact of manually setting a private IP, follow the solution steps.
   'Allow reallocation of secondary private IPv4 addresses' is optional, please set it according to your own needs.

➌ View the newly assigned private IP addresses on the EC2 instance. Click the network interface on the EC2 management interface, select the network interface associated with the EC2 instance, and find the secondary private IP address in the drop-down form below the details to see if there is a newly assigned secondary private IP address.

#### Create elastic IP
➊ In the EC2 management interface, click Elastic IP and click Assign Elastic IP Address .

➋ Create an elastic IP Attribute - Value Pair tab, click Assign to complete the elastic IP creation.
   Attribute - The key Name of the Value Pair is a fixed key, and Name represents the name created for this elastic IP.
   You can add other tags according to your own needs.

#### Associate Elastic IP to EC2 Instance
➊ Click Actions and select Associate elastic IP to associate EC2 instance and elastic IP.
   A. Resource type default selection, instance
   B. Select target EC2 instance
   C. Select the target private IP address
   D. Check Allow re-association of this elastic IP address
   E. Click Save

This operation includes multiple private IP addresses . Be careful not to associate an elastic IP with a bound private IP, which will invalidate the elastic IP associated before.

After completing the above steps, return to the EC2 instance and review the details below. The elastic IP address will display the elastic IP associated with the instance creation and the elastic IP address associated with the second time. There will be a total of two elastic IP addresses.
Log in to the EC2 instance and add network interface card settings 

#### Temporary settings
➊ Use SSH Client to log in to the EC2 server.

➋ Enter the following command
```bash
# Replace 172.16.134.11 with your actual secondary private IP address.
sudo ip addr add 172.16.134.11/32 dev eth0
```

After all of the above steps are performed, the solution of associating multiple elastic IP addresses with EC2 instances will be completed.
This step is set to temporary configuration and all bound private IP settings will expire after restart .

#### Permanent settings
➊ Use SSH Client to log in to the EC2 server.

➋ Make sure NetworkManager is installed and running. If not, you can install it with the following command:
```bash
# Install NetworkManager (execute if not installed)
sudo yum install NetworkManager
```

Open the network configuration file /etc/sysconfig/network-scripts/ifcfg-eth0: 1 (replace eth0 with the real network interface card name ) and add the following line to the end of the file:

```bash
# Create and edit the network card configuration file
# (press the i key to open the edit mode, paste, press the esc key to exit the edit mode, directly enter :wq to save and exit)
vi /etc/sysconfig/network-scripts/ifcfg-eth0:1

# Copy the following content and paste it into the file, save and exit
IPADDR=172.16.188.24
NETMASK=255.255.255.0

# For other IP addresses, add new IPADDR and NETMASK lines for each IP address by increasing the index number (1, 2, 3, etc.)
vi /etc/sysconfig/network-scripts/ifcfg-eth0:2
vi /etc/sysconfig/network-scripts/ifcfg-eth0:3
```

This sets multiple IP addresses and their corresponding subnet masks .
Primary private IP Skip this step and do not need to be set up. (Primary private IP address must exist and only one)
For example:
There are three private IP addresses assigned to the server, so only eth0:1 eth: 2 two index creation can be performed, the main private IP configuration file is ifcfg-eth0 ( modification is strictly prohibited )
Restart the NetworkManager service, or you can restart the entire system for the changes to take effect:
```bash
# restart Network
sudo systemctl restart NetworkManager
# reboot server
sudo reboot
```

⚠️ attention

➊ The solution builds on existing knowledge of AWS Public Cloud EC2, EBS, and VPC .

➋ This solution does not include creating an EC2 instance in a VPC public subnet , please refer to the AWS official website tutorial if necessary.

➌ After the EC2 instance is created, AWS will automatically assign a private IP address as the primary private IP address of the EC2 instance; the first step of this solution is to create the first secondary private IP address (in general, a total of two Private IPs, the first is automatically assigned when the instance is created, and the second is automatically assigned by AWS manually).
   In the last step, replace the private IP address with the second private IP address, not the main private IP address!!! and so on.

### Final Test
Finally, you can use multiple Elastic IP addresses for SSH logins to verify that network communication has been successfully set up.

### Conclusion
This solution can quickly help customers associate multiple elastic IPs with a single EC2 instance and perform network communication, effectively reducing the costs and labor costs caused by other services, unless you must use NLB and GA to meet the requirements of relevant business features.
I've shared some helpful documentation links down below:

[cloudcustodian](https://cloudcustodian.io/) - There are various ops related automation scripts in this project.

[AWS Blog](https://aws.amazon.com/blog/) - There are countless sharing of AWS solutions and knowledge.

Hope it was helpful,
