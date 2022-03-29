import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class Route extends Resource<ec2.CfnRoute> {
  private readonly routeTable: ec2.CfnRouteTable

  private readonly gateway: ec2.CfnInternetGateway | ec2.CfnNatGateway

  private readonly logicalId: string

  private constructor(
    scope: Construct,
    routeTable: ec2.CfnRouteTable,
    gateway: ec2.CfnInternetGateway | ec2.CfnNatGateway,
    logicalId: string
  ) {
    super(scope)
    this.routeTable = routeTable
    this.gateway = gateway
    this.logicalId = logicalId
  }

  static create(
    scope: Construct,
    routeTable: ec2.CfnRouteTable,
    gateway: ec2.CfnInternetGateway | ec2.CfnNatGateway,
    logicalId: string
  ): ec2.CfnRoute {
    return new this(scope, routeTable, gateway, logicalId).create()
  }

  create(): ec2.CfnRoute {
    if (this.gateway instanceof ec2.CfnInternetGateway) {
      return new ec2.CfnRoute(this.scope, this.logicalId, {
        routeTableId: this.routeTable.attrRouteTableId,
        destinationCidrBlock: '0.0.0.0/0',
        gatewayId: this.gateway.attrInternetGatewayId,
      })
    }

    if (this.gateway instanceof ec2.CfnNatGateway) {
      return new ec2.CfnRoute(this.scope, this.logicalId, {
        routeTableId: this.routeTable.attrRouteTableId,
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: this.gateway.ref,
      })
    }

    throw new Error('cannot resolve gateway instance')
  }
}
