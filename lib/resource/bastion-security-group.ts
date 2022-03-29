import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class BastionSecurityGroup extends Resource<ec2.CfnSecurityGroup> {
  public readonly vpc: ec2.CfnVPC

  private constructor(scope: Construct, vpc: ec2.CfnVPC) {
    super(scope)
    this.vpc = vpc
  }

  static create(scope: Construct, vpc: ec2.CfnVPC): ec2.CfnSecurityGroup {
    return new this(scope, vpc).create()
  }

  create(): ec2.CfnSecurityGroup {
    return new ec2.CfnSecurityGroup(this.scope, 'BastionSecurityGroup', {
      groupName: `${this.env}-${this.project}-bastion-sg`,
      groupDescription: `${this.env}-${this.project}-bastion-sg`,
      vpcId: this.vpc.ref,
      securityGroupIngress: [
        {
          ipProtocol: 'tcp',
          cidrIp: '0.0.0.0/0',
          fromPort: 22,
          toPort: 22,
          description: 'SSH',
        },
      ],
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-bastion-sg`,
        },
      ],
    })
  }
}
