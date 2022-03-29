import { Construct } from 'constructs'
import { EnvParam } from '@/env/env'
import { getEnv, getProject, getParam, getRegion } from '@/env/env-helper'

export abstract class Resource<T> {
  public readonly scope: Construct

  public readonly region: string

  public readonly env: string

  public readonly project: string

  public readonly param: EnvParam

  protected constructor(scope: Construct) {
    this.scope = scope
    this.region = getRegion(scope)
    this.env = getEnv(scope)
    this.project = getProject(scope)
    this.param = getParam(scope)
  }

  abstract create(): T
}
