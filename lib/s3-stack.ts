import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { S3 } from '@/lib/resource/s3'

export class S3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    S3.create(this)
  }
}
