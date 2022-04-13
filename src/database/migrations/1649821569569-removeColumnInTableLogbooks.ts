import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class removeColumnInTableLogbooks1649821569569
  implements MigrationInterface
{
  private tableName = 'logbooks';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, 'evidence_task_url');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: 'evidence_task_url',
        type: 'varchar',
        length: '255',
        isNullable: false,
      }),
    );
  }
}
