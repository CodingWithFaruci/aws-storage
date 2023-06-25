import { IAwsStorageStackProps } from './types';

export const stackConfig: IAwsStorageStackProps = {
  kms: {
    alias: 'alias/key',
    desc: 'EncryptionKey',
  },
  s3: {
    name: 'images-bucket',
  },
  dynamodb: {
    customerTable: {
      name: 'customer-table',
      partionKey: 'account_id',
      sortingKey: 'account_name',
      secondaryIndexes: [
        {
          indexName: 'email_index',
          partionKeyName: 'account_email',
          sortingKey: 'account_id',
        },
      ],
    },
    ordersTable: {
      name: 'customer-orders',
      partionKey: 'account_id',
      sortingKey: 'order_id',
      secondaryIndexes: [
        {
          indexName: 'order_id',
          partionKeyName: 'order_id',
          sortingKey: 'order_date',
        },
        {
          indexName: 'order_date_index',
          partionKeyName: 'order_date',
          sortingKey: 'shipment_date',
        },
        {
          indexName: 'shipment_date_index',
          partionKeyName: 'shipment_date',
          sortingKey: 'order_date',
        },
        {
          indexName: 'order_status_index',
          partionKeyName: 'order_status',
          sortingKey: 'order_date',
        },
      ],
    },
  },
};