/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class UpdateCreditPackageSetting1786094413831 {
    name = 'UpdateCreditPackageSetting1786094413831'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "CREDIT_PACKAGE" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PACKAGE" ADD "price" integer NOT NULL`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "CREDIT_PACKAGE" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PACKAGE" ADD "price" numeric(10,2) NOT NULL`);
    }
}
