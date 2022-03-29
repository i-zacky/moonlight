import { Construct } from 'constructs'
import { aws_rds as rds } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class AuroraDBParameterGroup extends Resource<rds.CfnDBParameterGroup> {
  private constructor(scope: Construct) {
    super(scope)
  }

  static create(scope: Construct): rds.CfnDBParameterGroup {
    return new this(scope).create()
  }

  create(): rds.CfnDBParameterGroup {
    return new rds.CfnDBParameterGroup(this.scope, 'AuroraDBParameterGroup', {
      description: `${this.env}-${this.project}-aurora-db-pg`,
      family: this.param.rds.FAMILY,
    })
  }
}
