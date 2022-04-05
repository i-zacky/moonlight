import { Construct } from 'constructs'
import { aws_ec2 as ec2, CfnTag } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class Subnet extends Resource<ec2.CfnSubnet> {
  private readonly vpc: ec2.CfnVPC

  private readonly logicalId: string

  private readonly subnetName: string

  private readonly cidrBlock: string

  private readonly availabilityZone: string

  private readonly mapPublicIpOnLaunch: boolean

  private readonly tags: CfnTag[]

  private constructor(
    scope: Construct,
    vpc: ec2.CfnVPC,
    logicalId: string,
    subnetName: string,
    cidrBlock: string,
    availabilityZone: string,
    mapPublicIpOnLaunch: boolean,
    tags: CfnTag[]
  ) {
    super(scope)
    this.vpc = vpc
    this.logicalId = logicalId
    this.subnetName = subnetName
    this.cidrBlock = cidrBlock
    this.availabilityZone = availabilityZone
    this.mapPublicIpOnLaunch = mapPublicIpOnLaunch
    this.tags = tags
  }

  static create(
    scope: Construct,
    vpc: ec2.CfnVPC,
    logicalId: string,
    subnetName: string,
    cidrBlock: string,
    availabilityZone: string,
    mapPublicIpOnLaunch: boolean,
    tags: CfnTag[]
  ): ec2.CfnSubnet {
    return new this(scope, vpc, logicalId, subnetName, cidrBlock, availabilityZone, mapPublicIpOnLaunch, tags).create()
  }

  create(): ec2.CfnSubnet {
    return new ec2.CfnSubnet(this.scope, this.logicalId, {
      vpcId: this.vpc.ref,
      cidrBlock: this.cidrBlock,
      availabilityZone: this.availabilityZone,
      mapPublicIpOnLaunch: this.mapPublicIpOnLaunch,
      tags: [
        {
          key: 'Name',
          value: this.subnetName,
        },
        ...this.tags,
      ],
    })
  }
}
