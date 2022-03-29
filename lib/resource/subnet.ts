import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class Subnet extends Resource<ec2.CfnSubnet> {
  private readonly vpc: ec2.CfnVPC

  private readonly logicalId: string

  private readonly subnetName: string

  private readonly cidrBlock: string

  private readonly availabilityZone: string

  private constructor(
    scope: Construct,
    vpc: ec2.CfnVPC,
    logicalId: string,
    subnetName: string,
    cidrBlock: string,
    availabilityZone: string
  ) {
    super(scope)
    this.vpc = vpc
    this.logicalId = logicalId
    this.subnetName = subnetName
    this.cidrBlock = cidrBlock
    this.availabilityZone = availabilityZone
  }

  static create(
    scope: Construct,
    vpc: ec2.CfnVPC,
    logicalId: string,
    subnetName: string,
    cidrBlock: string,
    availabilityZone: string
  ): ec2.CfnSubnet {
    return new this(scope, vpc, logicalId, subnetName, cidrBlock, availabilityZone).create()
  }

  create(): ec2.CfnSubnet {
    return new ec2.CfnSubnet(this.scope, this.logicalId, {
      vpcId: this.vpc.ref,
      cidrBlock: this.cidrBlock,
      availabilityZone: this.availabilityZone,
      mapPublicIpOnLaunch: false,
      tags: [
        {
          key: 'Name',
          value: this.subnetName,
        },
      ],
    })
  }
}
