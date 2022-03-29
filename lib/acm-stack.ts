import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { ACM } from '@/lib/resource/acm'

export class ACMStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    ACM.create(this)
  }
}
