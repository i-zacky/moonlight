import { Construct } from 'constructs'
import { aws_ec2 as ec2, aws_rds as rds } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class AuroraCluster extends Resource<rds.CfnDBCluster> {
  private readonly clusterParameterGroup: rds.CfnDBClusterParameterGroup

  private readonly subnetGroup: rds.CfnDBSubnetGroup

  private readonly securityGroup: ec2.CfnSecurityGroup

  private constructor(
    scope: Construct,
    clusterParameterGroup: rds.CfnDBClusterParameterGroup,
    subnetGroup: rds.CfnDBSubnetGroup,
    securityGroup: ec2.CfnSecurityGroup
  ) {
    super(scope)
    this.clusterParameterGroup = clusterParameterGroup
    this.subnetGroup = subnetGroup
    this.securityGroup = securityGroup
  }

  static create(
    scope: Construct,
    clusterParameterGroup: rds.CfnDBClusterParameterGroup,
    subnetGroup: rds.CfnDBSubnetGroup,
    securityGroup: ec2.CfnSecurityGroup
  ): rds.CfnDBCluster {
    return new this(scope, clusterParameterGroup, subnetGroup, securityGroup).create()
  }

  create(): rds.CfnDBCluster {
    return new rds.CfnDBCluster(this.scope, 'AuroraCluster', {
      dbClusterIdentifier: `${this.env}-${this.project}-cluster`,
      dbClusterParameterGroupName: this.clusterParameterGroup.ref,
      dbSubnetGroupName: this.subnetGroup.ref,
      engine: this.param.rds.ENGINE,
      engineMode: 'provisioned',
      engineVersion: this.param.rds.ENGINE_VERSION,
      databaseName: this.param.rds.DATABASE_NAME,
      masterUsername: this.param.rds.DATABASE_UER,
      masterUserPassword: this.param.rds.DATABASE_PASSWORD,
      port: this.param.rds.PORT,
      backupRetentionPeriod: 7,
      storageEncrypted: true,
      preferredBackupWindow: '18:00-18:30',
      preferredMaintenanceWindow: 'Sat:19:00-Sat:19:30',
      vpcSecurityGroupIds: [this.securityGroup.attrGroupId],
    })
  }
}
