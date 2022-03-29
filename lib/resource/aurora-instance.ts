import { Construct } from 'constructs'
import { aws_rds as rds } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class AuroraInstance extends Resource<rds.CfnDBInstance> {
  private readonly cluster: rds.CfnDBCluster

  private readonly parameterGroup: rds.CfnDBParameterGroup

  private readonly subnetGroup: rds.CfnDBSubnetGroup

  private readonly logicalId: string

  private readonly instanceIdentifier: string

  private readonly availabilityZone: string

  private constructor(
    scope: Construct,
    cluster: rds.CfnDBCluster,
    parameterGroup: rds.CfnDBParameterGroup,
    subnetGroup: rds.CfnDBSubnetGroup,
    logicalId: string,
    instanceIdentifier: string,
    availabilityZone: string
  ) {
    super(scope)
    this.cluster = cluster
    this.parameterGroup = parameterGroup
    this.subnetGroup = subnetGroup
    this.logicalId = logicalId
    this.instanceIdentifier = instanceIdentifier
    this.availabilityZone = availabilityZone
  }

  static create(
    scope: Construct,
    cluster: rds.CfnDBCluster,
    parameterGroup: rds.CfnDBParameterGroup,
    subnetGroup: rds.CfnDBSubnetGroup,
    logicalId: string,
    instanceIdentifier: string,
    availabilityZone: string
  ): rds.CfnDBInstance {
    return new this(
      scope,
      cluster,
      parameterGroup,
      subnetGroup,
      logicalId,
      instanceIdentifier,
      availabilityZone
    ).create()
  }

  create(): rds.CfnDBInstance {
    return new rds.CfnDBInstance(this.scope, this.logicalId, {
      availabilityZone: this.availabilityZone,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: false,
      engine: this.param.rds.ENGINE,
      engineVersion: this.param.rds.ENGINE_VERSION,
      dbClusterIdentifier: this.cluster.ref,
      dbInstanceIdentifier: this.instanceIdentifier,
      dbInstanceClass: this.param.rds.INSTANCE_CLASS,
      dbParameterGroupName: this.parameterGroup.ref,
      dbSubnetGroupName: this.subnetGroup.ref,
      publiclyAccessible: false,
    })
  }
}
