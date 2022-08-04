import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TruncateDatabase {
  constructor(private sequelize: Sequelize) {}

  public async cleanDatabase(): Promise<void> {
    try {
      await this.sequelize.sync({ force: true })
      // const entities = this.connection.entityMetadatas;
      // const tableNames = entities
      //   .map((entity) => `"${entity.tableName}"`)
      //   .join(', ');
      //
      // await this.connection.query(`TRUNCATE ${tableNames} CASCADE;`);
      console.log('[TEST DATABASE]: Clean');
    } catch (error) {
      throw new Error(`ERROR: Cleaning test database: ${error}`);
    }
  }
}
