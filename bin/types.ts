import { StackProps } from 'aws-cdk-lib';

export interface ISecondayIndexes {
  indexName: string,
  partionKeyName: string,
  sortingKey: string,
}

interface ITable {
  name: string,
  partionKey: string,
  sortingKey: string,
  secondaryIndexes: ISecondayIndexes[],
}

export interface IAwsStorageStackProps extends StackProps {
  kms: {
    alias: string,
    desc: string,
  },
  s3: {
    name: string,
  },
  dynamodb: {
    customerTable: ITable,
    ordersTable: ITable,
  }
}