import { Construct } from 'constructs'
import { aws_certificatemanager as acm, aws_route53 as route53 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class ACM extends Resource<acm.Certificate> {
  private constructor(scope: Construct) {
    super(scope)
  }

  static create(scope: Construct): acm.Certificate {
    return new this(scope).create()
  }

  create(): acm.Certificate {
    const hostedZone = route53.HostedZone.fromLookup(this.scope, 'HostedZone', {
      domainName: this.param.acm.DOMAIN_NAME,
    })
    return new acm.Certificate(this.scope, 'Certificate', {
      domainName: this.param.acm.DOMAIN_NAME,
      validation: acm.CertificateValidation.fromDns(hostedZone),
      subjectAlternativeNames: [`*.${this.param.acm.DOMAIN_NAME}`],
    })
  }
}
