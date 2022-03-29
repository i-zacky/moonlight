import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class PublicSecurityGroup extends Resource<ec2.CfnSecurityGroup> {
  private readonly vpc: ec2.CfnVPC

  private constructor(scope: Construct, vpc: ec2.CfnVPC) {
    super(scope)
    this.vpc = vpc
  }

  static create(scope: Construct, vpc: ec2.CfnVPC): ec2.CfnSecurityGroup {
    return new this(scope, vpc).create()
  }

  create(): ec2.CfnSecurityGroup {
    return new ec2.CfnSecurityGroup(this.scope, 'PublicSecurityGroup', {
      groupName: `${this.env}-${this.project}-public-sg`,
      groupDescription: `${this.env}-${this.project}-public-sg`,
      vpcId: this.vpc.ref,
      securityGroupIngress: [
        {
          ipProtocol: '-1',
          cidrIp: this.param.vpc.PUBLIC_SUBNET_CIDR_A,
          description: 'Public Subnet IP AZ-A',
        },
        {
          ipProtocol: '-1',
          cidrIp: this.param.vpc.PUBLIC_SUBNET_CIDR_C,
          description: 'Public Subnet IP AZ-C',
        },
        {
          ipProtocol: '-1',
          cidrIp: this.param.vpc.PUBLIC_SUBNET_CIDR_D,
          description: 'Public Subnet IP AZ-D',
        },
      ],
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-public-sg`,
        },
      ],
    })
  }
}
