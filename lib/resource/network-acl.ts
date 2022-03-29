import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class NetworkAcl extends Resource<ec2.CfnNetworkAcl> {
  private readonly vpc: ec2.CfnVPC

  private constructor(scope: Construct, vpc: ec2.CfnVPC) {
    super(scope)
    this.vpc = vpc
  }

  static create(scope: Construct, vpc: ec2.CfnVPC): ec2.CfnNetworkAcl {
    return new this(scope, vpc).create()
  }

  create(): ec2.CfnNetworkAcl {
    return new ec2.CfnNetworkAcl(this.scope, 'NetworkAcl', {
      vpcId: this.vpc.ref,
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-nacl`,
        },
      ],
    })
  }
}
