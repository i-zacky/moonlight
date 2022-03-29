import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { getEnv, getProject, getRegion } from '@/env/env-helper'
import { AuroraSubnetGroup } from '@/lib/resource/aurora-subnet-group'
import { AuroraClusterParameterGroup } from '@/lib/resource/aurora-cluster-parameter-group'
import { AuroraDBParameterGroup } from '@/lib/resource/aurora-db-parameter-group'
import { AuroraCluster } from '@/lib/resource/aurora-cluster'
import { AuroraInstance } from '@/lib/resource/aurora-instance'

interface RDSStackProps extends StackProps {
  vpc: ec2.CfnVPC
  subnets: {
    az: 'A' | 'C' | 'D'
    subnet: ec2.CfnSubnet
  }[]
  securityGroup: ec2.CfnSecurityGroup
}

export class RDSStack extends Stack {
  constructor(scope: Construct, id: string, props: RDSStackProps) {
    super(scope, id, props)

    const env = getEnv(this)
    const project = getProject(this)
    const region = getRegion(this)

    const subnetGroup = AuroraSubnetGroup.create(
      this,
      props.vpc,
      props.subnets.map((v) => v.subnet)
    )

    const clusterParameterGroup = AuroraClusterParameterGroup.create(this)

    const dbParameterGroup = AuroraDBParameterGroup.create(this)

    const cluster = AuroraCluster.create(this, clusterParameterGroup, subnetGroup, props.securityGroup)

    if (props.subnets.find((v) => v.az === 'A')) {
      AuroraInstance.create(
        this,
        cluster,
        dbParameterGroup,
        subnetGroup,
        'AuroraInstanceA01',
        `${env}-${project}-db-a01`,
        `${region}a`
      )
    }

    if (props.subnets.find((v) => v.az === 'C')) {
      AuroraInstance.create(
        this,
        cluster,
        dbParameterGroup,
        subnetGroup,
        'AuroraInstanceC01',
        `${env}-${project}-db-c01`,
        `${region}c`
      )
    }

    if (props.subnets.find((v) => v.az === 'D')) {
      AuroraInstance.create(
        this,
        cluster,
        dbParameterGroup,
        subnetGroup,
        'AuroraInstanceD01',
        `${env}-${project}-db-d01`,
        `${region}d`
      )
    }
  }
}
