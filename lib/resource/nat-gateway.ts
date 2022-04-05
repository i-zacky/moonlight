import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class NATGateway extends Resource<ec2.CfnNatGateway> {
  private readonly eip: ec2.CfnEIP

  private readonly subnet: ec2.CfnSubnet

  private readonly logicalId: string

  private readonly gatewayName: string

  private constructor(
    scope: Construct,
    eip: ec2.CfnEIP,
    subnet: ec2.CfnSubnet,
    logicalId: string,
    gatewayName: string
  ) {
    super(scope)
    this.eip = eip
    this.subnet = subnet
    this.logicalId = logicalId
    this.gatewayName = gatewayName
  }

  static create(
    scope: Construct,
    eip: ec2.CfnEIP,
    subnet: ec2.CfnSubnet,
    logicalId: string,
    gatewayName: string
  ): ec2.CfnNatGateway {
    return new this(scope, eip, subnet, logicalId, gatewayName).create()
  }

  create(): ec2.CfnNatGateway {
    return new ec2.CfnNatGateway(this.scope, this.logicalId, {
      allocationId: this.eip.attrAllocationId,
      subnetId: this.subnet.ref,
      tags: [
        {
          key: 'Name',
          value: this.gatewayName,
        },
      ],
    })
  }
}
