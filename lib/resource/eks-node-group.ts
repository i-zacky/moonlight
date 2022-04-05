import { Construct } from 'constructs'
import { aws_iam as iam, aws_ec2 as ec2, aws_eks as eks } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'
import { SubnetProps } from '@/lib/eks-stack'

export class EKSNodeGroup extends Resource<void> {
  private readonly subnets: SubnetProps[]

  private readonly bastionSecurityGroup: ec2.CfnSecurityGroup

  private readonly cluster: eks.CfnCluster

  private constructor(
    scope: Construct,
    subnets: SubnetProps[],
    bastionSecurityGroup: ec2.CfnSecurityGroup,
    cluster: eks.CfnCluster
  ) {
    super(scope)
    this.subnets = subnets
    this.bastionSecurityGroup = bastionSecurityGroup
    this.cluster = cluster
  }

  static create(
    scope: Construct,
    subnets: SubnetProps[],
    bastionSecurityGroup: ec2.CfnSecurityGroup,
    cluster: eks.CfnCluster
  ): void {
    new this(scope, subnets, bastionSecurityGroup, cluster).create()
  }

  create(): void {
    const nodeInstanceRole = new iam.Role(this.scope, 'NodeInstanceRole', {
      roleName: `${this.env}-${this.project}-eks-node-instance-role`,
      description: `${this.env}-${this.project}-eks-node-instance-role`,
      path: '/',
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    })

    new eks.CfnNodegroup(this.scope, 'NodeGroup', {
      nodegroupName: `${this.env}-${this.project}-eks-node-group`,
      clusterName: this.cluster.ref,
      nodeRole: nodeInstanceRole.roleArn,
      subnets: this.subnets.map((v) => v.subnet.ref),
      instanceTypes: [this.param.eks.INSTANCE_TYPE],
      diskSize: this.param.eks.DISK_SIZE,
      remoteAccess: {
        ec2SshKey: this.param.ec2.SSH_KEY_NAME,
      },
      scalingConfig: {
        desiredSize: this.param.eks.DESIRED_SIZE,
        maxSize: this.param.eks.MAX_SIZE,
        minSize: this.param.eks.MIN_SIZE,
      },
    })
  }
}
