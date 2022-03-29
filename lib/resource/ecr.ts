import { Construct } from 'constructs'
import { aws_ecr as ecr, RemovalPolicy } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class ECR extends Resource<ecr.Repository> {
  private readonly logicalId: string

  private readonly repositoryName: string

  private constructor(scope: Construct, logicalId: string, repositoryName: string) {
    super(scope)
    this.logicalId = logicalId
    this.repositoryName = repositoryName
  }

  static create(scope: Construct, logicalId: string, repositoryName: string): ecr.Repository {
    return new this(scope, logicalId, repositoryName).create()
  }

  create(): ecr.Repository {
    return new ecr.Repository(this.scope, this.logicalId, {
      repositoryName: this.repositoryName,
      imageTagMutability: ecr.TagMutability.IMMUTABLE,
      removalPolicy: RemovalPolicy.DESTROY,
    })
  }
}
