// src/config/Config.ts
import dotenv from 'dotenv';
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

dotenv.config();

const secret_name = "prod/solasafe/db";

const client = new SecretsManagerClient({
  region: "eu-central-1",
});

async function getDbConfig() {
    try {
      const response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
        })
      );
  
      if ('SecretString' in response) {
        const secret = JSON.parse(response.SecretString!);
  
        // Fallback to environment variables if secret values are missing
        const dbUser = process.env.DB_USER || '';
        const dbPassword = secret.solasafe_db_pass || '';
        const dbServer = process.env.DB_SERVER || '';
        const dbPort = process.env.DB_PORT || '5432';
        const dbName = process.env.DB_NAME || '';
  
        // Throw an error if any of the required fields are missing
        if (!dbUser || !dbPassword || !dbServer || !dbPort || !dbName) {
          throw new Error('Missing required database credentials from AWS Secrets Manager or environment variables');
        }
  
        return {
          user: dbUser,
          host: dbServer,
          database: dbName,
          password: dbPassword,
          port: parseInt(dbPort, 10),
          ssl: true,
        };
      } else {
        throw new Error('SecretString not found in the response from AWS Secrets Manager');
      }
    } catch (error: any) {
      throw new Error(`Error retrieving secrets: ${error.message}`);
    }
}
  
export const dbConfig = getDbConfig();