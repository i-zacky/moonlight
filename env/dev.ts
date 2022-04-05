import { VPC, ACM, Cognito, RDS, EC2, EKS } from '@/env/env'

export const vpc: VPC = {
  CIDR: '10.10.0.0/16',
  PUBLIC_SUBNET_CIDR_A: '10.10.10.0/24',
  PUBLIC_SUBNET_CIDR_C: '10.10.20.0/24',
  PUBLIC_SUBNET_CIDR_D: '10.10.30.0/24',
  PRIVATE_SUBNET_CIDR_A: '10.10.40.0/24',
  PRIVATE_SUBNET_CIDR_C: '10.10.50.0/24',
  PRIVATE_SUBNET_CIDR_D: '10.10.60.0/24',
}

export const acm: ACM = {
  DOMAIN_NAME: 'dev-leone.link',
  API_DOMAIN_NAME: 'api.dev-leone.link',
}

export const cognito: Cognito = {
  ADMINISTRATOR_EMAIL: 'leone-admin@example.com',
  ADMINISTRATOR_PASSWORD: 'uYz6o8deGgpC61CL',
}

export const rds: RDS = {
  FAMILY: 'aurora-postgresql13',
  ENGINE: 'aurora-postgresql',
  ENGINE_VERSION: '13.4',
  PORT: 5432,
  TIMEZONE: 'Asia/Tokyo',
  INSTANCE_CLASS: 'db.t3.medium',
  DATABASE_NAME: 'dev_leone_db',
  DATABASE_UER: 'postgresql',
  DATABASE_PASSWORD: 'paJydVmA3z7vqEkr',
}

export const ec2: EC2 = {
  SSH_KEY_NAME: 'dev-leone-bastion',
}

export const eks: EKS = {
  INSTANCE_TYPE: 't3.medium',
  DISK_SIZE: 20,
  DESIRED_SIZE: 3,
  MAX_SIZE: 3,
  MIN_SIZE: 3,
}
