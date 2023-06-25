#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsStorageStack } from '../lib/aws-storage-stack';
import { stackConfig } from './config';

const app = new cdk.App();
new AwsStorageStack(app, 'ph-storage-stack', stackConfig);