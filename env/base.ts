const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION as string
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID as string

export const base = {
  region: AWS_DEFAULT_REGION,
  account: AWS_ACCOUNT_ID,
}
