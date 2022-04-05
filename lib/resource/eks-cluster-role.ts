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
    const role = new iam.Role(this.scope, 'EKSClusterRole', {
      roleName: `${this.env}-${this.project}-eks-cluster-role`,
      description: `${this.env}-${this.project}-eks-cluster-role`,
      path: '/',
      assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSServicePolicy'),
      ],
    })

    new iam.Policy(this.scope, 'CloudWatchMetricsPolicy', {
      policyName: `${this.env}-${this.project}-cloudwatch-metrics-policy`,
      roles: [role],
      statements: [
        new iam.PolicyStatement({
          actions: ['cloudwatch:PutMetricData'],
          effect: iam.Effect.ALLOW,
          resources: ['*'],
        }),
      ],
    })

    new iam.Policy(this.scope, 'ELBPermissionPolicy', {
      policyName: `${this.env}-${this.project}-elb-permission-policy`,
      roles: [role],
      statements: [
        new iam.PolicyStatement({
          actions: ['ec2:DescribeAccountAttributes', 'ec2:DescribeAddresses', 'ec2:DescribeInternetGateways'],
          effect: iam.Effect.ALLOW,
          resources: ['*'],
        }),
      ],
    })

    return role
  }
}
