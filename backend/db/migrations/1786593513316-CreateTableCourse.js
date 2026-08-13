/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTableCourse1786593513316 {
    name = 'CreateTableCourse1786593513316'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."COURSE_status_enum" AS ENUM('尚未開始', '進行中', '已結束')`);
        await queryRunner.query(`CREATE TABLE "COURSE" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "status" "public"."COURSE_status_enum" NOT NULL DEFAULT '尚未開始', "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "max_participants" integer NOT NULL DEFAULT '20', "participants" integer NOT NULL DEFAULT '0', "meeting_url" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "coach_id" uuid, "skill_id" uuid, CONSTRAINT "UQ_8cbd0bd15b53c2691e79678da02" UNIQUE ("name"), CONSTRAINT "PK_1dcd712a4d39dcfd9d46ca0ae11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "COURSE" ADD CONSTRAINT "FK_8320a8a6b0a1aad801f0be2922b" FOREIGN KEY ("coach_id") REFERENCES "COACH"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSE" ADD CONSTRAINT "FK_10d952a5e55998cf12f448fcfab" FOREIGN KEY ("skill_id") REFERENCES "SKILL"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSE" DROP CONSTRAINT "FK_10d952a5e55998cf12f448fcfab"`);
        await queryRunner.query(`ALTER TABLE "COURSE" DROP CONSTRAINT "FK_8320a8a6b0a1aad801f0be2922b"`);
        await queryRunner.query(`DROP TABLE "COURSE"`);
        await queryRunner.query(`DROP TYPE "public"."COURSE_status_enum"`);
    }
}
