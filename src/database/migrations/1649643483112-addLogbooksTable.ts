import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class addLogbooksTable1649643483112 implements MigrationInterface {
  private tableName = 'logbooks';
  private projectTableName = 'projects';
  private mainDutyTableName = 'main_duties';
  private userTableName = 'users';

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
            name: 'project_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'main_duty_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name_task',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'date_task',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'evidence_task_url',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'evidence_task_path',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'link_attachment',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'workplace',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'organizer',
            type: 'varchar',
            length: '255',
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
        columnNames: ['project_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.projectTableName,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['main_duty_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.mainDutyTableName,
        onDelete: 'CASCADE',
      }),
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

    const projectIdForeignKey = thisTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('project_id') !== -1,
    );
    await queryRunner.dropForeignKey(this.tableName, projectIdForeignKey);

    const mainDutyIdForeignKey = thisTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('main_duty_id') !== -1,
    );
    await queryRunner.dropForeignKey(this.tableName, mainDutyIdForeignKey);

    const userIdForeignKey = thisTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    await queryRunner.dropForeignKey(this.tableName, userIdForeignKey);

    await queryRunner.query(`DROP TABLE ${this.tableName}`);
  }
}
