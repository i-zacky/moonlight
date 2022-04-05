import { Construct } from 'constructs'
import { aws_ec2 as ec2, CfnOutput } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class EKSControlPlaneSecurityGroup extends Resource<ec2.CfnSecurityGroup> {
  private readonly vpc: ec2.CfnVPC

  private constructor(scope: Construct, vpc: ec2.CfnVPC) {
    super(scope)
    this.vpc = vpc
  }

  static create(scope: Construct, vpc: ec2.CfnVPC): ec2.CfnSecurityGroup {
    return new this(scope, vpc).create()
  }

  create(): ec2.CfnSecurityGroup {
    return new ec2.CfnSecurityGroup(this.scope, 'EKSControlPlaneSecurityGroup', {
      groupName: `${this.env}-${this.project}-eks-control-plane-sg`,
      groupDescription: `${this.env}-${this.project}-eks-control-plane-sg`,
      vpcId: this.vpc.ref,
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-eks-control-plane-sg`,
        },
      ],
    })
  }
}
