import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { EKSClusterRole } from '@/lib/resource/eks-cluster-role'
import { EKSControlPlaneSecurityGroup } from '@/lib/resource/eks-control-plane-security-group'
import { EKSCluster } from '@/lib/resource/eks-cluster'
import { EKSNodeGroup } from '@/lib/resource/eks-node-group'

export interface SubnetProps {
  az: 'A' | 'C' | 'D'
  subnet: ec2.CfnSubnet
}

interface EKSStackProps extends StackProps {
  vpc: ec2.CfnVPC
  publicSubnets: SubnetProps[]
  privateSubnets: SubnetProps[]
  securityGroup: ec2.CfnSecurityGroup
}

export class EKSStack extends Stack {
  constructor(scope: Construct, id: string, props: EKSStackProps) {
    super(scope, id, props)

    const controlPlaneSecurityGroup = EKSControlPlaneSecurityGroup.create(this, props.vpc)
    const controlPlaneRole = EKSClusterRole.create(this)
    const cluster = EKSCluster.create(this, props.publicSubnets, controlPlaneSecurityGroup, controlPlaneRole)
    EKSNodeGroup.create(this, props.vpc, props.publicSubnets, controlPlaneSecurityGroup, cluster)
  }
}
