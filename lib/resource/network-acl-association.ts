import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class NetworkAclAssociation extends Resource<ec2.CfnSubnetNetworkAclAssociation> {
  private readonly subnet: ec2.CfnSubnet

  private readonly nacl: ec2.CfnNetworkAcl

  private readonly logicalId: string

  private constructor(scope: Construct, subnet: ec2.CfnSubnet, nacl: ec2.CfnNetworkAcl, logicalId: string) {
    super(scope)
    this.subnet = subnet
    this.nacl = nacl
    this.logicalId = logicalId
  }

  static create(
    scope: Construct,
    subnet: ec2.CfnSubnet,
    nacl: ec2.CfnNetworkAcl,
    logicalId: string
  ): ec2.CfnSubnetNetworkAclAssociation {
    return new this(scope, subnet, nacl, logicalId).create()
  }

  create(): ec2.CfnSubnetNetworkAclAssociation {
    return new ec2.CfnSubnetNetworkAclAssociation(this.scope, this.logicalId, {
      subnetId: this.subnet.attrId,
      networkAclId: this.nacl.ref,
    })
  }
}
