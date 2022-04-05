#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { base } from '@/env/base'
import { getEnv, getProject } from '@/env/env-helper'
import { VPCStack } from '@/lib/vpc-stack'
import { SecurityGroupStack } from '@/lib/security-group-stack'
import { ACMStack } from '@/lib/acm-stack'
import { CognitoStack } from '@/lib/cognito-stack'
import { S3Stack } from '@/lib/s3-stack'
import { ECRStack } from '@/lib/ecr-stack'
import { RDSStack } from '@/lib/rds-stack'
import { EKSStack } from '@/lib/eks-stack'

const app = new App()
const env = getEnv(app)
const project = getProject(app)

// VPC
const vpc = new VPCStack(app, `${env}-${project}-vpc`)

// SecurityGroup
const securityGroup = new SecurityGroupStack(app, `${env}-${project}-sg`, {
  vpc: vpc.vpc,
})
securityGroup.addDependency(vpc)

// ACM
const acm = new ACMStack(app, `${env}-${project}-acm`, {
  env: {
    region: base.region,
    account: base.account,
  },
})

// Cognito
const cognito = new CognitoStack(app, `${env}-${project}-cognito`)

// S3
const s3 = new S3Stack(app, `${env}-${project}-s3`)

// ECR
const ecr = new ECRStack(app, `${env}-${project}-ecr`)

// RDS
const rds = new RDSStack(app, `${env}-${project}-rds`, {
  vpc: vpc.vpc,
  subnets: vpc.privateSubnets,
  securityGroup: securityGroup.auroraSecurityGroup,
})
rds.addDependency(vpc)
rds.addDependency(securityGroup)

// EKS
const eks = new EKSStack(app, `${env}-${project}-eks`, {
  vpc: vpc.vpc,
  publicSubnets: vpc.publicSubnets,
  privateSubnets: vpc.privateSubnets,
  securityGroup: securityGroup.publicSecurityGroup,
})
eks.addDependency(vpc)
eks.addDependency(securityGroup)
