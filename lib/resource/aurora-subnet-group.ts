import { Construct } from 'constructs'
import { aws_ec2 as ec2, aws_rds as rds } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class AuroraSubnetGroup extends Resource<rds.CfnDBSubnetGroup> {
  private readonly vpc: ec2.CfnVPC

  private readonly subnets: ec2.CfnSubnet[]

  private constructor(scope: Construct, vpc: ec2.CfnVPC, subnets: ec2.CfnSubnet[]) {
    super(scope)
    this.vpc = vpc
    this.subnets = subnets
  }

  static create(scope: Construct, vpc: ec2.CfnVPC, subnets: ec2.CfnSubnet[]): rds.CfnDBSubnetGroup {
    return new this(scope, vpc, subnets).create()
  }

  create(): rds.CfnDBSubnetGroup {
    return new rds.CfnDBSubnetGroup(this.scope, 'AuroraSubnetGroup', {
      dbSubnetGroupName: `${this.env}-${this.project}-aurora-sng`,
      dbSubnetGroupDescription: `${this.env}-${this.project}-aurora-sng`,
      subnetIds: this.subnets.map((subnet) => subnet.attrId),
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-aurora-sng`,
        },
      ],
    })
  }
}
