/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateCourseBookingTable1786800960750 {
    name = 'CreateCourseBookingTable1786800960750'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "COURSE_BOOKING" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cancelled_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "course_id" uuid NOT NULL, CONSTRAINT "PK_88f0144d4507e4f42cb4e6a7c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKING" ADD CONSTRAINT "FK_853e2392bad56b186c9df746eab" FOREIGN KEY ("user_id") REFERENCES "USER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKING" ADD CONSTRAINT "FK_c09f76aafa8ca07c6bca9af07a6" FOREIGN KEY ("course_id") REFERENCES "COURSE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKING" DROP CONSTRAINT "FK_c09f76aafa8ca07c6bca9af07a6"`);
        await queryRunner.query(`ALTER TABLE "COURSE_BOOKING" DROP CONSTRAINT "FK_853e2392bad56b186c9df746eab"`);
        await queryRunner.query(`DROP TABLE "COURSE_BOOKING"`);
    }
}
