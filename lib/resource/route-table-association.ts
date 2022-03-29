import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class RouteTableAssociation extends Resource<ec2.CfnSubnetRouteTableAssociation> {
  private readonly subnet: ec2.CfnSubnet

  private readonly routeTable: ec2.CfnRouteTable

  private readonly logicalId: string

  private constructor(scope: Construct, subnet: ec2.CfnSubnet, routeTable: ec2.CfnRouteTable, logicalId: string) {
    super(scope)
    this.subnet = subnet
    this.routeTable = routeTable
    this.logicalId = logicalId
  }

  static create(
    scope: Construct,
    subnet: ec2.CfnSubnet,
    routeTable: ec2.CfnRouteTable,
    logicalId: string
  ): ec2.CfnSubnetRouteTableAssociation {
    return new this(scope, subnet, routeTable, logicalId).create()
  }

  create(): ec2.CfnSubnetRouteTableAssociation {
    return new ec2.CfnSubnetRouteTableAssociation(this.scope, this.logicalId, {
      subnetId: this.subnet.attrId,
      routeTableId: this.routeTable.attrRouteTableId,
    })
  }
}
