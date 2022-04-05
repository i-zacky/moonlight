import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class InternetGateway extends Resource<ec2.CfnInternetGateway> {
  private readonly vpc: ec2.CfnVPC

  private constructor(scope: Construct, vpc: ec2.CfnVPC) {
    super(scope)
    this.vpc = vpc
  }

  static create(scope: Construct, vpc: ec2.CfnVPC): ec2.CfnInternetGateway {
    return new this(scope, vpc).create()
  }

  create(): ec2.CfnInternetGateway {
    const igw = new ec2.CfnInternetGateway(this.scope, 'InternetGateway', {
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-igw`,
        },
      ],
    })
    new ec2.CfnVPCGatewayAttachment(this.scope, 'VPCGatewayAttachment', {
      vpcId: this.vpc.ref,
      internetGatewayId: igw.ref,
    })

    return igw
  }
}
