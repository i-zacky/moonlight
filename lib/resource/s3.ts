import { Construct } from 'constructs'
import { aws_s3 as s3 } from 'aws-cdk-lib'
import { Resource } from '@/lib/resource/resource'

export class S3 extends Resource<s3.Bucket> {
  private constructor(scope: Construct) {
    super(scope)
  }

  static create(scope: Construct): s3.Bucket {
    return new this(scope).create()
  }

  create(): s3.Bucket {
    return new s3.Bucket(this.scope, 'DataBucket', {
      bucketName: `${this.env}-${this.project}-data`,
      accessControl: s3.BucketAccessControl.PRIVATE,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      cors: [
        {
          id: 'PreSignedURLRule',
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          allowedMethods: [s3.HttpMethods.GET],
          maxAge: 3600,
        },
      ],
    })
  }
}
