import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsers1607972171213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            /** E-mail é único no DB, ou seja, e-mail não pode se repetir */
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            /** Para mantermos a data de criação */
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            /** Para mantermos a data de update */
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
