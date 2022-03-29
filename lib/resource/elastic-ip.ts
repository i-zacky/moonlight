import { Construct } from 'constructs'
import { aws_ec2 as ec2 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class ElasticIP extends Resource<ec2.CfnEIP> {
  private readonly logicalId: string

  private readonly eipName: string

  private constructor(scope: Construct, logicalId: string, eipName: string) {
    super(scope)
    this.logicalId = logicalId
    this.eipName = eipName
  }

  static create(scope: Construct, logicalId: string, eipName: string): ec2.CfnEIP {
    return new this(scope, logicalId, eipName).create()
  }

  create(): ec2.CfnEIP {
    return new ec2.CfnEIP(this.scope, this.logicalId, {
      domain: 'vpc',
      tags: [
        {
          key: 'Name',
          value: this.eipName,
        },
      ],
    })
  }
}
