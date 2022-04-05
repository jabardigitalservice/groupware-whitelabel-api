import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMainDutyTable1649130015636 implements MigrationInterface {
  private tableName = 'main_duties';
  private jobTitleTableName = 'job_titles';

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
            name: 'job_title_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'sequence',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'occupation_target',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            default: 'null',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['job_title_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.jobTitleTableName,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const thisTable = await queryRunner.getTable(this.tableName);

    const jobTitleIdForeignKey = thisTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('job_title_id') !== -1,
    );

    await queryRunner.dropForeignKey(this.tableName, jobTitleIdForeignKey);
    await queryRunner.query(`DROP TABLE ${this.tableName}`);
  }
}
