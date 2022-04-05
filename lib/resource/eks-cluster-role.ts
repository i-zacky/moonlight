import { Construct } from 'constructs'
import { aws_iam as iam } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class EKSClusterRole extends Resource<iam.Role> {
  private constructor(scope: Construct) {
    super(scope)
  }

  static create(scope: Construct): iam.Role {
    return new this(scope).create()
  }

  create(): iam.Role {
    return new iam.Role(this.scope, 'EKSClusterRole', {
      roleName: `${this.env}-${this.project}-eks-cluster-role`,
      description: `${this.env}-${this.project}-eks-cluster-role`,
      path: '/',
      assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSServicePolicy'),
      ],
    })
  }
}
