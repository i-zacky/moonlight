import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class VPC extends Resource<ec2.CfnVPC> {
  private constructor(scope: Construct) {
    super(scope)
  }

  static create(scope: Construct): ec2.CfnVPC {
    return new this(scope).create()
  }

  create(): ec2.CfnVPC {
    return new ec2.CfnVPC(this.scope, 'VPC', {
      cidrBlock: this.param.vpc.CIDR,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-vpc`,
        },
      ],
    })
  }
}
