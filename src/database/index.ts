import { Connection, createConnection, getConnectionOptions } from 'typeorm';

const databaseTest = './src/database/database.test.sqlite';

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? databaseTest
          : defaultOptions.database,
    }),
  );
};
