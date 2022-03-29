import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { ECR } from '@/lib/resource/ecr'
import { getEnv, getProject } from '@/env/env-helper'

export class ECRStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const env = getEnv(this)
    const project = getProject(this)

    ECR.create(this, 'ApiRepository', `${env}-${project}-api`)
    ECR.create(this, 'WebRepository', `${env}-${project}-web`)
    ECR.create(this, 'BatchRepository', `${env}-${project}-batch`)
  }
}
