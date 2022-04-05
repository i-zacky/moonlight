import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class EKSSecurityGroupIngress extends Resource<void> {
  private readonly controlPlane: ec2.CfnSecurityGroup

  private readonly node: ec2.CfnSecurityGroup

  private constructor(scope: Construct, controlPlane: ec2.CfnSecurityGroup, node: ec2.CfnSecurityGroup) {
    super(scope)
    this.controlPlane = controlPlane
    this.node = node
  }

  static create(scope: Construct, controlPlane: ec2.CfnSecurityGroup, node: ec2.CfnSecurityGroup): void {
    new this(scope, controlPlane, node).create()
  }

  create(): void {
    new ec2.CfnSecurityGroupIngress(this.scope, 'NodeFromControlPlaneIngress', {
      description: 'allow managed and unmanaged nodes to communicate with each other (all ports)',
      groupId: this.node.ref,
      sourceSecurityGroupId: this.controlPlane.attrGroupId,
      ipProtocol: '-1',
      fromPort: 0,
      toPort: 65535,
    })

    new ec2.CfnSecurityGroupIngress(this.scope, 'NodeIngress', {
      description: 'allow nodes to communicate with each other (all ports)',
      groupId: this.node.ref,
      sourceSecurityGroupId: this.node.attrGroupId,
      ipProtocol: '-1',
      fromPort: 0,
      toPort: 65535,
    })

    new ec2.CfnSecurityGroupIngress(this.scope, 'ControlPlaneFromNodeIngress', {
      description: 'allow unmanaged nodes to communicate with control plane (all ports)',
      groupId: this.controlPlane.attrGroupId,
      sourceSecurityGroupId: this.node.ref,
      ipProtocol: '-1',
      fromPort: 0,
      toPort: 65535,
    })
  }
}
