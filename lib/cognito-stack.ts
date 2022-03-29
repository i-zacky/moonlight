import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { UserPool } from '@/lib/resource/user-pool'
import { UserPoolClient } from '@/lib/resource/user-pool-client'
import { AdministratorUser } from '@/lib/resource/administrator-user'

export class CognitoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const userPool = UserPool.create(this)
    const userPoolClient = UserPoolClient.create(this, userPool)
    const administrator = AdministratorUser.create(this, userPool)
  }
}
