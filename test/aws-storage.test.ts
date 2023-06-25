/* eslint-disable max-lines */
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as AwsStorage from '../lib/aws-storage-stack';
import { stackConfig } from '../bin/config';

const app = new cdk.App();
const stack = new AwsStorage.AwsStorageStack(app, 'MyTestStack', stackConfig);
const template = Template.fromStack(stack);

test('KMS Key Created', () => {
  template.hasResourceProperties('AWS::KMS::Key', {
    Description: stackConfig.kms.desc,
  });
});

test('KMS Alias Created', () => {
  template.hasResourceProperties('AWS::KMS::Alias', {
    AliasName: stackConfig.kms.alias,
  });
});

test('S3 Bucket Created', () => {
  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: stackConfig.s3.name,
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [
        {
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'aws:kms',
          },
        },
      ],
    },
    VersioningConfiguration: {
      Status: 'Enabled',
    },
    AccessControl: 'LogDeliveryWrite',
    LoggingConfiguration: {
      LogFilePrefix: 'access-logs' },
  });
});

test('DynamoDB Customers Table Created', () => {
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    TableName: stackConfig.dynamodb.customerTable.name,
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      {
        AttributeName: stackConfig.dynamodb.customerTable.partionKey,
        AttributeType: 'S',
      },
      {
        AttributeName: stackConfig.dynamodb.customerTable.sortingKey,
        AttributeType: 'S',
      },
      {
        AttributeName: stackConfig.dynamodb.customerTable.secondaryIndexes[0].partionKeyName,
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: stackConfig.dynamodb.customerTable.partionKey,
        KeyType: 'HASH',
      },
      {
        AttributeName: stackConfig.dynamodb.customerTable.sortingKey,
        KeyType: 'RANGE',
      },
    ],
    GlobalSecondaryIndexes: [
      {

        IndexName: stackConfig.dynamodb.customerTable.secondaryIndexes[0].indexName,
        KeySchema: [
          {
            AttributeName: stackConfig.dynamodb.customerTable.secondaryIndexes[0].partionKeyName,
            KeyType: 'HASH',
          },
          {
            AttributeName: stackConfig.dynamodb.customerTable.secondaryIndexes[0].sortingKey,
            KeyType: 'RANGE',
          },
        ],
      },
    ],
    SSESpecification: {
      SSEEnabled: true,
      SSEType: 'KMS',
    },
  });
});

test('DynamoDB Orders Table Created', () => {
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    TableName: stackConfig.dynamodb.ordersTable.name,
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      {
        AttributeName: stackConfig.dynamodb.ordersTable.partionKey,
        AttributeType: 'S',
      },
      ...stackConfig.dynamodb.ordersTable.secondaryIndexes.map((index) => ({ AttributeName: index.partionKeyName, AttributeType: 'S' })),
    ],
    KeySchema: [
      {
        AttributeName: stackConfig.dynamodb.ordersTable.partionKey,
        KeyType: 'HASH',
      },
      {
        AttributeName: stackConfig.dynamodb.ordersTable.sortingKey,
        KeyType: 'RANGE',
      },
    ],
    GlobalSecondaryIndexes: [
      ...stackConfig.dynamodb.ordersTable.secondaryIndexes.map((index) => ({
        IndexName: index.indexName,
        KeySchema: [
          {
            AttributeName: index.partionKeyName,
            KeyType: 'HASH',
          },
          {
            AttributeName: index.sortingKey,
            KeyType: 'RANGE',
          },
        ],
      })),
    ],
    SSESpecification: {
      SSEEnabled: true,
      SSEType: 'KMS',
    },
  });
});