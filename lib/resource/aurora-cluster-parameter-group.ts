import { Construct } from 'constructs'
import { aws_rds as rds } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class AuroraClusterParameterGroup extends Resource<rds.CfnDBClusterParameterGroup> {
  private constructor(scope: Construct) {
    super(scope)
  }

  static create(scope: Construct): rds.CfnDBClusterParameterGroup {
    return new this(scope).create()
  }

  create(): rds.CfnDBClusterParameterGroup {
    return new rds.CfnDBClusterParameterGroup(this.scope, 'AuroraClusterParameterGroup', {
      description: `${this.env}-${this.project}-aurora-cluster-pg`,
      family: this.param.rds.FAMILY,
      parameters: {
        timezone: this.param.rds.TIMEZONE,
      },
    })
  }
}
