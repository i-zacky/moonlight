import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class EKSNodeSecurityGroup extends Resource<ec2.CfnSecurityGroup> {
  private readonly vpc: ec2.CfnVPC

  private constructor(scope: Construct, vpc: ec2.CfnVPC) {
    super(scope)
    this.vpc = vpc
  }

  static create(scope: Construct, vpc: ec2.CfnVPC): ec2.CfnSecurityGroup {
    return new this(scope, vpc).create()
  }

  create(): ec2.CfnSecurityGroup {
    return new ec2.CfnSecurityGroup(this.scope, 'EKSNodeSecurityGroup', {
      groupName: `${this.env}-${this.project}-eks-node-sg`,
      groupDescription: `${this.env}-${this.project}-eks-node-sg`,
      vpcId: this.vpc.ref,
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-eks-node-sg`,
        },
      ],
    })
  }
}
