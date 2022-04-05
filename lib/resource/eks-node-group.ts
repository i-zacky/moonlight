import { Construct } from 'constructs'
import { aws_iam as iam, aws_ec2 as ec2, aws_eks as eks } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'
import { SubnetProps } from '@/lib/eks-stack'

export class EKSNodeGroup extends Resource<void> {
  private readonly vpc: ec2.CfnVPC

  private readonly subnets: SubnetProps[]

  private readonly controlPlaneSecurityGroup: ec2.CfnSecurityGroup

  private readonly cluster: eks.CfnCluster

  private constructor(
    scope: Construct,
    vpc: ec2.CfnVPC,
    subnets: SubnetProps[],
    controlPlaneSecurityGroup: ec2.CfnSecurityGroup,
    cluster: eks.CfnCluster
  ) {
    super(scope)
    this.vpc = vpc
    this.subnets = subnets
    this.controlPlaneSecurityGroup = controlPlaneSecurityGroup
    this.cluster = cluster
  }

  static create(
    scope: Construct,
    vpc: ec2.CfnVPC,
    subnets: SubnetProps[],
    controlPlaneSecurityGroup: ec2.CfnSecurityGroup,
    cluster: eks.CfnCluster
  ): void {
    new this(scope, vpc, subnets, controlPlaneSecurityGroup, cluster).create()
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
      ],
    })

    const nodeInstanceProfile = new iam.CfnInstanceProfile(this.scope, 'NodeInstanceProfile', {
      path: '/',
      roles: [nodeInstanceRole.roleName],
    })

    const nodeSecurityGroup = new ec2.CfnSecurityGroup(this.scope, 'NodeSecurityGroup', {
      groupName: `${this.env}-${this.project}-eks-node-sg`,
      groupDescription: `${this.env}-${this.project}-eks-node-sg`,
      vpcId: this.vpc.ref,
      tags: [
        {
          key: 'Name',
          value: `${this.env}-${this.project}-eks-worker-node-sg`,
        },
        {
          key: `kubernetes.io/cluster/${this.cluster.ref}`,
          value: 'owned',
        },
      ],
    })

    new ec2.CfnSecurityGroupIngress(this.scope, 'NodeSecurityGroupIngress', {
      description: 'allow node to communicate with each other',
      groupId: nodeSecurityGroup.ref,
      sourceSecurityGroupId: nodeSecurityGroup.ref,
      ipProtocol: '-1',
    })

    new ec2.CfnSecurityGroupIngress(this.scope, 'NodeSecurityGroupFromControlPlaneIngress', {
      description: 'allow worker Kubelets and pods to receive communicate from the cluster control plane',
      groupId: nodeSecurityGroup.ref,
      sourceSecurityGroupId: this.controlPlaneSecurityGroup.ref,
      ipProtocol: 'tcp',
      fromPort: 1025,
      toPort: 65535,
    })

    new ec2.CfnSecurityGroupEgress(this.scope, 'ControlPlaneEgressToNodeSecurityGroup', {
      description: 'allow the cluster control plane to communicate with worker Kubelet and pods',
      groupId: this.controlPlaneSecurityGroup.ref,
      destinationSecurityGroupId: nodeSecurityGroup.ref,
      ipProtocol: 'tcp',
      fromPort: 1025,
      toPort: 65535,
    })

    new ec2.CfnSecurityGroupIngress(this.scope, 'NodeSecurityGroupFromControlPlaneOn443Ingress', {
      description:
        'allow pods running extension API servers on port 443 to receive communicate from cluster control plane',
      groupId: nodeSecurityGroup.ref,
      sourceSecurityGroupId: this.controlPlaneSecurityGroup.ref,
      ipProtocol: 'tcp',
      fromPort: 443,
      toPort: 443,
    })

    new ec2.CfnSecurityGroupEgress(this.scope, 'ControlPlaneEgressToNodeSecurityGroupOn443', {
      description: 'allow the cluster control plane to communicate with pods running extension API servers on port 443',
      groupId: this.controlPlaneSecurityGroup.ref,
      destinationSecurityGroupId: nodeSecurityGroup.ref,
      ipProtocol: 'tcp',
      fromPort: 443,
      toPort: 443,
    })

    new ec2.CfnSecurityGroupIngress(this.scope, 'ControlPlaneSecurityGroupIngress', {
      description: 'allow pods to communicate with the cluster API server',
      groupId: this.controlPlaneSecurityGroup.ref,
      sourceSecurityGroupId: nodeSecurityGroup.ref,
      ipProtocol: 'tcp',
      fromPort: 443,
      toPort: 443,
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
