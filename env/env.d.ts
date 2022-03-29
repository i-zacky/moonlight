export declare interface VPC {
  CIDR: string
  PUBLIC_SUBNET_CIDR_A: string
  PUBLIC_SUBNET_CIDR_C: string
  PUBLIC_SUBNET_CIDR_D: string
  PRIVATE_SUBNET_CIDR_A: string
  PRIVATE_SUBNET_CIDR_C: string
  PRIVATE_SUBNET_CIDR_D: string
}

export declare interface ACM {
  DOMAIN_NAME: string
  API_DOMAIN_NAME: string
}

export declare interface Cognito {
  ADMINISTRATOR_EMAIL: string
  ADMINISTRATOR_PASSWORD: string
}

export declare interface RDS {
  FAMILY: string
  ENGINE: string
  ENGINE_VERSION: string
  PORT: number
  TIMEZONE: string
  INSTANCE_CLASS: string
  DATABASE_NAME: string
  DATABASE_UER: string
  DATABASE_PASSWORD: string
}

export declare interface EnvParam {
  vpc: VPC
  acm: ACM
  cognito: Cognito
  rds: RDS
}
