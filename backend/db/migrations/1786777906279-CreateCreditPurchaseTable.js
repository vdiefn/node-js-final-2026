/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateCreditPurchaseTable1786777906279 {
    name = 'CreateCreditPurchaseTable1786777906279'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "CREDIT_PURCHASE" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchased_credit" integer NOT NULL, "price_paid" integer NOT NULL, "purchased_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "credit_package_id" uuid, CONSTRAINT "PK_45566d565b0b377382099c29b8a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASE" ADD CONSTRAINT "FK_061b692376c18aa4cc48058cbc0" FOREIGN KEY ("user_id") REFERENCES "USER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASE" ADD CONSTRAINT "FK_6f10d21677d47c234448baa856a" FOREIGN KEY ("credit_package_id") REFERENCES "CREDIT_PACKAGE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASE" DROP CONSTRAINT "FK_6f10d21677d47c234448baa856a"`);
        await queryRunner.query(`ALTER TABLE "CREDIT_PURCHASE" DROP CONSTRAINT "FK_061b692376c18aa4cc48058cbc0"`);
        await queryRunner.query(`DROP TABLE "CREDIT_PURCHASE"`);
    }
}
