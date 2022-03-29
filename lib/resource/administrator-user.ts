import { Construct } from 'constructs'
import { aws_cognito as cognito } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class AdministratorUser extends Resource<cognito.CfnUserPoolUser> {
  private readonly userPool: cognito.UserPool

  private constructor(scope: Construct, userPool: cognito.UserPool) {
    super(scope)
    this.userPool = userPool
  }

  static create(scope: Construct, userPool: cognito.UserPool): cognito.CfnUserPoolUser {
    return new this(scope, userPool).create()
  }

  create(): cognito.CfnUserPoolUser {
    return new cognito.CfnUserPoolUser(this.scope, 'AdministratorUser', {
      forceAliasCreation: true,
      messageAction: 'SUPPRESS',
      userAttributes: [
        {
          name: 'email',
          value: this.param.cognito.ADMINISTRATOR_EMAIL,
        },
        {
          name: 'email_verified',
          value: 'true',
        },
      ],
      username: this.param.cognito.ADMINISTRATOR_EMAIL,
      userPoolId: this.userPool.userPoolId,
    })
  }
}
