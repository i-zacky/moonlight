# moonlight

Project Template by AWS CDK

# Requirements

## System / Tools

- direnv
- Node.js v14.19.0

# Setup

## Activate direnv

```sh
$ cp .envrc.origin .envrc
$ direnv allow
```

## Install Dependencies

```sh
$ yarn install
```

## CDK Commands

### Setup

```sh
# env: dev / stg / prod
# project: your project name
$ yarn cdk bootstrap aws://${AWS_ACCOUNT_ID}/${AWS_DEFAULT_REGION} \
  --toolkit-stack-name cdk-toolkit \
  --context env=${env} \
  --context project=${project}
```

### Get Diff

```sh
# env: dev / stg / prod
# project: your project name
$ yarn cdk diff --context env=${env} --context project=${project}
```

### Deploy

```sh
# env: dev / stg / prod
# project: your project name
# target: '*' or specific stack name
$ yarn cdk deploy --context env=${env} --context project=${project} ${target}
```

### CLI Reference

https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-ref
