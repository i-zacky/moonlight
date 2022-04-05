import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { getEnv, getProject, getParam, getRegion } from '@/env/env-helper'
import { VPC } from '@/lib/resource/vpc'
import { InternetGateway } from '@/lib/resource/internet-gateway'
import { NetworkAcl } from '@/lib/resource/network-acl'
import { InBoundNetworkAclEntry } from '@/lib/resource/inbound-network-acl-entry'
import { OutBoundNetworkAclEntry } from '@/lib/resource/outbound-network-acl-entry'
import { Subnet } from '@/lib/resource/subnet'
import { RouteTable } from '@/lib/resource/route-table'
import { Route } from '@/lib/resource/route'
import { RouteTableAssociation } from '@/lib/resource/route-table-association'
import { NetworkAclAssociation } from '@/lib/resource/network-acl-association'
import { ElasticIP } from '@/lib/resource/elastic-ip'
import { NATGateway } from '@/lib/resource/nat-gateway'

export class VPCStack extends Stack {
  public readonly vpc: ec2.CfnVPC

  public readonly publicSubnets: {
    az: 'A' | 'C' | 'D'
    subnet: ec2.CfnSubnet
  }[]

  public readonly privateSubnets: {
    az: 'A' | 'C' | 'D'
    subnet: ec2.CfnSubnet
  }[]

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = VPC.create(this)
    this.vpc = vpc

    const igw = InternetGateway.create(this, vpc)

    const nacl = NetworkAcl.create(this, vpc)
    InBoundNetworkAclEntry.create(this, nacl)
    OutBoundNetworkAclEntry.create(this, nacl)

    const [publicSubnetA, privateSubnetA] = createSubnet(this, vpc, igw, nacl, 'A')
    const [publicSubnetC, privateSubnetC] = createSubnet(this, vpc, igw, nacl, 'C')
    const [publicSubnetD, privateSubnetD] = createSubnet(this, vpc, igw, nacl, 'D')

    this.publicSubnets = [
      {
        az: 'A',
        subnet: publicSubnetA,
      },
      {
        az: 'C',
        subnet: publicSubnetC,
      },
      {
        az: 'D',
        subnet: publicSubnetD,
      },
    ]

    this.privateSubnets = [
      {
        az: 'A',
        subnet: privateSubnetA,
      },
      {
        az: 'C',
        subnet: privateSubnetC,
      },
      {
        az: 'D',
        subnet: privateSubnetD,
      },
    ]
  }
}

const createSubnet = (
  scope: Construct,
  vpc: ec2.CfnVPC,
  igw: ec2.CfnInternetGateway,
  nacl: ec2.CfnNetworkAcl,
  az: 'A' | 'C' | 'D'
): [ec2.CfnSubnet, ec2.CfnSubnet] => {
  const env = getEnv(scope)
  const project = getProject(scope)
  const param = getParam(scope)
  const region = getRegion(scope)

  // Public Subnet
  const publicSubnet = Subnet.create(
    scope,
    vpc,
    `PublicSubnet${az}`,
    `${env}-${project}-public-${az.toLowerCase()}`,
    param.vpc[`PUBLIC_SUBNET_CIDR_${az}`],
    `${region}${az.toLowerCase()}`,
    true,
    [
      {
        key: 'kubernetes.io/role/elb',
        value: '1',
      },
    ]
  )
  const publicRouteTable = RouteTable.create(
    scope,
    vpc,
    `PublicRouteTable${az}`,
    `${env}-${project}-public-rt-${az.toLowerCase()}`
  )
  Route.create(scope, publicRouteTable, igw, `PublicRoute${az}`)
  RouteTableAssociation.create(scope, publicSubnet, publicRouteTable, `PublicRouteTableAssociation${az}`)
  NetworkAclAssociation.create(scope, publicSubnet, nacl, `PublicNetworkAclAssociation${az}`)

  // Private Subnet
  const privateSubnet = Subnet.create(
    scope,
    vpc,
    `PrivateSubnet${az}`,
    `${env}-${project}-private-${az.toLowerCase()}`,
    param.vpc[`PRIVATE_SUBNET_CIDR_${az}`],
    `${region}${az.toLowerCase()}`,
    false,
    [
      {
        key: 'kubernetes.io/role/internal-elb',
        value: '1',
      },
    ]
  )
  const eip = ElasticIP.create(scope, `NatEIP${az}`, `${env}-${project}-eip-${az.toLowerCase()}`)
  const natgw = NATGateway.create(
    scope,
    eip,
    publicSubnet,
    `NatGateway${az}`,
    `${env}-${project}-natgw-${az.toLowerCase()}`
  )
  const privateRouteTable = RouteTable.create(
    scope,
    vpc,
    `PrivateRouteTable${az}`,
    `${env}-${project}-private-rt-${az.toLowerCase()}`
  )
  Route.create(scope, privateRouteTable, natgw, `PrivateRoute${az}`)
  RouteTableAssociation.create(scope, privateSubnet, privateRouteTable, `PrivateRouteTableAssociation${az}`)
  NetworkAclAssociation.create(scope, privateSubnet, nacl, `PrivateNetworkAclAssociation${az}`)

  return [publicSubnet, privateSubnet]
}
