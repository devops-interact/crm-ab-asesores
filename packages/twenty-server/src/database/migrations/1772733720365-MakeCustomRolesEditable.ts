import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeCustomRolesEditable1772733720365 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `UPDATE "role" SET "isEditable" = true WHERE "standardId" IS NULL AND "isEditable" = false;`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Cannot safely revert without knowing previous state.
    }

}
