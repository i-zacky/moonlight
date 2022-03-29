import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class RouteTable extends Resource<ec2.CfnRouteTable> {
  private readonly vpc: ec2.CfnVPC

  private readonly logicalId: string

  private readonly routeTableName: string

  private constructor(scope: Construct, vpc: ec2.CfnVPC, logicalId: string, routeTableName: string) {
    super(scope)
    this.vpc = vpc
    this.logicalId = logicalId
    this.routeTableName = routeTableName
  }

  static create(scope: Construct, vpc: ec2.CfnVPC, logicalId: string, routeTableName: string): ec2.CfnRouteTable {
    return new this(scope, vpc, logicalId, routeTableName).create()
  }

  create(): ec2.CfnRouteTable {
    return new ec2.CfnRouteTable(this.scope, this.logicalId, {
      vpcId: this.vpc.ref,
      tags: [
        {
          key: 'Name',
          value: this.routeTableName,
        },
      ],
    })
  }
}
