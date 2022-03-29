import { Construct } from 'constructs'
import { aws_cognito as cognito, Duration, RemovalPolicy } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class UserPool extends Resource<cognito.UserPool> {
  private constructor(scope: Construct) {
    super(scope)
  }

  static create(scope: Construct): cognito.UserPool {
    return new this(scope).create()
  }

  create(): cognito.UserPool {
    return new cognito.UserPool(this.scope, 'UserPool', {
      userPoolName: `${this.env}-${this.project}-user-pool`,
      signInAliases: {
        email: true,
      },
      signInCaseSensitive: true,
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 9,
        requireLowercase: true,
        requireUppercase: false,
        requireDigits: true,
        tempPasswordValidity: Duration.days(7),
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
    })
  }
}
