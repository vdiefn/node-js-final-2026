/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateCoachAndCoachSkillTable1786505725673 {
    name = 'CreateCoachAndCoachSkillTable1786505725673'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "COACH" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "experience_years" integer NOT NULL, "description" character varying(255) NOT NULL, "profile_image_url" character varying(2048), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_9970257bf1fb6ac7b8c2b13263" UNIQUE ("user_id"), CONSTRAINT "PK_86122345454fa1389314e7a74be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "COACH_SKILL" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "coach_id" uuid, "skill_id" uuid, CONSTRAINT "PK_e2d7fcc541de85a20db7aabf58e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "COACH" ADD CONSTRAINT "FK_9970257bf1fb6ac7b8c2b13263c" FOREIGN KEY ("user_id") REFERENCES "USER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COACH_SKILL" ADD CONSTRAINT "FK_f3d01aa2e9a96d6c799ac9e2434" FOREIGN KEY ("coach_id") REFERENCES "COACH"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COACH_SKILL" ADD CONSTRAINT "FK_fd65487c35e280a69d345a6f0a5" FOREIGN KEY ("skill_id") REFERENCES "SKILL"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COACH_SKILL" DROP CONSTRAINT "FK_fd65487c35e280a69d345a6f0a5"`);
        await queryRunner.query(`ALTER TABLE "COACH_SKILL" DROP CONSTRAINT "FK_f3d01aa2e9a96d6c799ac9e2434"`);
        await queryRunner.query(`ALTER TABLE "COACH" DROP CONSTRAINT "FK_9970257bf1fb6ac7b8c2b13263c"`);
        await queryRunner.query(`DROP TABLE "COACH_SKILL"`);
        await queryRunner.query(`DROP TABLE "COACH"`);
    }
}
