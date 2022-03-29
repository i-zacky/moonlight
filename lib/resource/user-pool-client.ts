import { Construct } from 'constructs'
import { aws_cognito as cognito, Duration } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class UserPoolClient extends Resource<cognito.UserPoolClient> {
  private readonly userPool: cognito.UserPool

  private constructor(scope: Construct, userPool: cognito.UserPool) {
    super(scope)
    this.userPool = userPool
  }

  static create(scope: Construct, userPool: cognito.UserPool): cognito.UserPoolClient {
    return new this(scope, userPool).create()
  }

  create(): cognito.UserPoolClient {
    const attributes = new cognito.ClientAttributes()
    attributes.withCustomAttributes('email')

    return new cognito.UserPoolClient(this.scope, 'UserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: `${this.env}-${this.project}-user-pool-client`,
      generateSecret: false,
      refreshTokenValidity: Duration.days(7),
      accessTokenValidity: Duration.days(1),
      idTokenValidity: Duration.days(1),
      authFlows: {
        adminUserPassword: true,
        userSrp: true,
      },
      preventUserExistenceErrors: true,
      readAttributes: attributes,
      writeAttributes: attributes,
    })
  }
}
