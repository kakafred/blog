---
title: "AWS EC2 Instance Auto-tagging"
publishedAt: 2023-06-30
description: "Automatically tag AWS EC2 instances as they launch to precisely identify target costs"
slug: "144f41b4-834b-46ef-bebe-1da73e225905"
isPublish: true
---

## *Idea from [AWS Blog](https://aws.amazon.com/blogs/security/how-to-automatically-tag-amazon-ec2-resources-in-response-to-api-events/)*

### The scenario

One of my cases, a compnay asked for my assistance with an AWS-related situation.

"We have a special AWS account, it need to be a sharing account for all department. The problem is that we need to analyze our costs from CE(_Cost Explorer_), but we can not separating the costs of every department because of the sharing account. We want every AWS Resources to be tagged with the tag of user definition."

### The problem

There is no complete solution for automated-dynamtic tagging situtaions.

### The solution

I use three Amazon services to achieve this solution. They are  [AWS CloudTrail](https://aws.amazon.com/cloudtrail/), [AWS CloudWatch](https://aws.amazon.com/cloudwatch/), [AWS Lambda](https://aws.amazon.com/lambda/).
These three services can form a complete architecture and meet the requirements.
The solution flow chart is described down below:

![The solution flow chart](https://dmhnzl5mp9mj6.cloudfront.net/security_awsblog/images/AM2.png)

### Tag automation

The IAM user has EC2 rights to launch an EC2 instance. Regardless of how the user creates the EC2 instance (with the AWS Management Console or AWS CLI), he performs a  RunInstances API call (#1 in the following diagram). CloudWatch Events records this activity (#2).

A CloudWatch Events rule targets a Lambda function called  AutoTag and it invokes the function with the event details (#3). The event details contain the information about the user that completed the action (this information is retrieved automatically from AWS CloudTrail, which  [must be on](http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/WhatIsCloudWatchEvents.html#CWE_Prerequisites)  for CloudWatch Events to work).

The Lambda function  AutoTag scans the event details, and extracts all the possible resource IDs as well as the user’s identity (#4). The function applies two tags to the created resources (#5):

- Owner, with the current  userName.
- PrincipalId, with the current user’s  aws:userid  value.

When Amazon Elastic Block Store (EBS) volumes, EBS snapshots and Amazon Machine Images (AMIs) are individually created, they invoke the same Lambda function. This way, you can similarly  Allow or  Deny actions based on tags for those resources, or identify which resources a user created.

#### Technical solution step by step procedure

In the upcoming section, I shall lead you step to step on how to get this mechanism up and running.

##### CloudTrail

1. Go to “**Cloud trail**” service, select “**Trails**” section and press the “**Create trail**” button.

2. Leave everything as default, besides these attributes:

   ·  **Apply trail to all regions** — Choose “no” if you want the trail only one region

   ·  **S3 bucket** — Select a name that would be indicative to your organization naming convention

3. Click on the “**Create**” button.

##### Lambda

1. Go to “**Lambda**” service, under “**Functions**” press on “**Create Function**”

2. Leave everything as default besides these attributes:

   ·  **Function name** — Select a name that would be indicative to your organization naming convention

   ·  **Runtime** — Python 3.6

3. Under the “**Function code**” section paste the following code

```py
   import boto3

    def lambda_handler(event, context):
    
    #-------------------- Debug ---------------------------
    
    #print( 'Hello {}'.format(event))
    
    #print( 'User Name- {}'.format(event['detail']['userIdentity']['principalId']))
    
    #print( 'Instance ID- {}'.format(event['detail']['responseElements']['instancesSet']['items'][0]['instanceId']))
    
    # Variables
    
    instanceId = event['detail']['responseElements']['instancesSet']['items'][0]['instanceId']
    
    userNameSTring = event['detail']['userIdentity']['principalId']
    
    # Checks if the user is an okta user
    
    if ":" in userNameSTring:
    
    userName = userNameSTring.split(":")[1]
    
    else:
    
    userName = event['detail']['userIdentity']['type']  #['type'] update by ['userName']
    
    print( 'Instance Id - ' , instanceId)
    
    print( 'User Name - ' , userName)
    
    tagKey = 'owner'
    
    tagValue = userName
    
    # ---------------------- Body ----------------------
    
    # EC2 tagging
    
    client = boto3.client('ec2')
    
    response = client.create_tags(
    
    Resources=[
    
    instanceId
    
    ],
    
    Tags=[
    
    {
    
    'Key': tagKey,
    
    'Value': tagValue
    
    },
    
    ]
    
    )
    
    # Volume tagging
    
    ec2 = boto3.resource('ec2')
    
    instance = ec2.Instance(instanceId)
    
    volumes = instance.volumes.all()
    
    for volume in volumes:
    
    volID = volume.id
    
    print("volume - " , volID)
    
    volume = ec2.Volume(volID)
    
    tag = volume.create_tags(
    
    Tags=[
    
    {
    
    'Key': tagKey,
    
    'Value': tagValue
    
    },
    
    ]
    
    )
    
    print(response)

```
The code has been updated by myself. When lambda function(python 3.6) separating json data, **['userName']** is no longer exist in json files. So if you execute the source code it will show you function errors.

4. Press on the “**Delpoy**” button

The Lambda function needs to have suitable permission to tag EC2 resources, therefor we will grant a suitable policy to its predefined role.

5. Go to “**IAM**” service and press on “**Roles**”.

6. Under “**Roles”** look for the following role name convention:
“The Lambda function name from step ‘2’ “**-role-”**random sequence**”**

7. click on the “**Roles**”

8. click on “**Attach policy**”

9. lookup for “**AmazonEC2FullAccess**” and attach it to the role.

##### CloudWatch
1. Go to “**Cloud Watch**” service, under “**Events**” click on “**Rules**” and press the “**create rule**” button.

2. In the “**Event source**” section, leave everything as default beside these attributes:

    ·  **Service Name** — EC2

    · **Event Type** — AWS API Call via Cloud Trail

    · In the radio button section pick: “**Specific operation(s)”**  and enter “**RunInstances**” in the free text box

3. In the “**Targets**” section, leave everything as default beside these attributes:

   · In the first Combobox select — “**Lambda function**”

   · In the second Combobox select — your Lambda function’s name

4. Click on “**Configure details**” button

5. Enter a name for your rule

6. Click on “**Create Rule**”

### Final Test
You can go “**EC2**” service, click on"**Launch instances**", choose AMI and click on "**Review and Launch**". When these operation all be down, check your EC2 instance's tag.

### Conclusion
If nothing else, you will get ec2 to tag itself. But we will use more than one aws service in production environment. That need you create more CloudWatch Event Roles and Lambda functions. This will include knowledge of AWS SDK and Lambda programming, which is very tricky for friends who have just started using AWS.
I've shared some helpful documentation links down below:
[cloudcustodian](https://cloudcustodian.io/) - There are various ops related automation scripts in this project.
[AWS Blog](https://aws.amazon.com/blog/) - There are countless sharing of AWS solutions and knowledge.

Hope it was helpful,
