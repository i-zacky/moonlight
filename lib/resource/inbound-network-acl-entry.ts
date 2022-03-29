import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class InBoundNetworkAclEntry extends Resource<ec2.CfnNetworkAclEntry> {
  private readonly nacl: ec2.CfnNetworkAcl

  private constructor(scope: Construct, nacl: ec2.CfnNetworkAcl) {
    super(scope)
    this.nacl = nacl
  }

  static create(scope: Construct, nacl: ec2.CfnNetworkAcl): ec2.CfnNetworkAclEntry {
    return new this(scope, nacl).create()
  }

  create(): ec2.CfnNetworkAclEntry {
    return new ec2.CfnNetworkAclEntry(this.scope, 'InBoundNetworkAclEntry', {
      networkAclId: this.nacl.ref,
      ruleNumber: 100,
      protocol: -1,
      ruleAction: 'allow',
      egress: false,
      cidrBlock: '0.0.0.0/0',
    })
  }
}
