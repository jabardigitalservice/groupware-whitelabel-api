import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class UserProfileTable1647216750779 implements MigrationInterface {
  private tableName = 'user_profile';
  private userTableName = 'user';
  private institutionTableName = 'institution';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'birth_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'birth_place',
            type: 'varchar',
            length: '192',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'char',
            length: '1',
            isNullable: true,
          },
          {
            name: 'avatar',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'employment_status',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'is_pns',
            type: 'boolean',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.userTableName,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const thisTable = await queryRunner.getTable(this.tableName);

    const userIdForeignKey = thisTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );

    await queryRunner.dropForeignKey(this.tableName, userIdForeignKey);
    await queryRunner.query(`DROP TABLE ${this.tableName}`);
  }
}
