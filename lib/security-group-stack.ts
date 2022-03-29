import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { BastionSecurityGroup } from '@/lib/resource/bastion-security-group'
import { AuroraSecurityGroup } from '@/lib/resource/aurora-security-group'
import { PublicSecurityGroup } from '@/lib/resource/public-security-group'
import { PrivateSecurityGroup } from '@/lib/resource/private-security-group'

interface SecurityGroupStackProps extends StackProps {
  vpc: ec2.CfnVPC
}

export class SecurityGroupStack extends Stack {
  public readonly bastionSecurityGroup: ec2.CfnSecurityGroup

  public readonly auroraSecurityGroup: ec2.CfnSecurityGroup

  public readonly publicSecurityGroup: ec2.CfnSecurityGroup

  public readonly privateSecurityGroup: ec2.CfnSecurityGroup

  constructor(scope: Construct, id: string, props: SecurityGroupStackProps) {
    super(scope, id, props)

    this.bastionSecurityGroup = BastionSecurityGroup.create(this, props.vpc)
    this.auroraSecurityGroup = AuroraSecurityGroup.create(this, props.vpc)
    this.publicSecurityGroup = PublicSecurityGroup.create(this, props.vpc)
    this.privateSecurityGroup = PrivateSecurityGroup.create(this, props.vpc)
  }
}
