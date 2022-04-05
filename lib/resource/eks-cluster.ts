import { Construct } from 'constructs'
import { aws_eks as eks, aws_ec2 as ec2, aws_iam as iam } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'
import { SubnetProps } from '@/lib/eks-stack'

export class EKSCluster extends Resource<eks.CfnCluster> {
  private readonly subnets: SubnetProps[]

  private readonly securityGroup: ec2.CfnSecurityGroup

  private readonly role: iam.Role

  private constructor(scope: Construct, subnets: SubnetProps[], securityGroup: ec2.CfnSecurityGroup, role: iam.Role) {
    super(scope)
    this.subnets = subnets
    this.securityGroup = securityGroup
    this.role = role
  }

  static create(
    scope: Construct,
    subnets: SubnetProps[],
    securityGroup: ec2.CfnSecurityGroup,
    role: iam.Role
  ): eks.CfnCluster {
    return new this(scope, subnets, securityGroup, role).create()
  }

  create(): eks.CfnCluster {
    return new eks.CfnCluster(this.scope, 'EKSCluster', {
      name: `${this.env}-${this.project}-cluster`,
      version: '1.22',
      roleArn: this.role.roleArn,
      resourcesVpcConfig: {
        subnetIds: this.subnets.map((v) => v.subnet.ref),
        securityGroupIds: [this.securityGroup.ref],
        endpointPublicAccess: true,
        endpointPrivateAccess: true,
      },
    })
  }
}
