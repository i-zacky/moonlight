import { App, ScopedAws } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dev from '@/env/dev'
import { EnvParam } from '@/env/env'

export const getParam = (scope: Construct): EnvParam => {
  const env = getEnv(scope)

  if (env == 'dev') {
    return dev
  }

  throw new Error('not found env configuration')
}

export const getEnv = (scope: Construct | App): string => {
  const env = scope.node.tryGetContext('env')
  if (env) {
    return env
  }
  throw new Error('does not setting env of context')
}

export const getProject = (scope: Construct | App): string => {
  const project = scope.node.tryGetContext('project')
  if (project) {
    return project
  }
  throw new Error('does not setting project of context')
}

export const getRegion = (scope: Construct): string => {
  const { region } = new ScopedAws(scope)
  return region
}
