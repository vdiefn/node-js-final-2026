const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "CreditPurchase",
  tableName: "CREDIT_PURCHASE",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
      nullable: false,
    },
    purchased_credit: {
      type: "int",
      nullable: false,
    },
    price_paid: {
      type: "int",
      nullable: false,
    },
    purchased_at: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      nullable: false,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "user_id" },
    },
    creditPackage: {
      target: "CreditPackage",
      type: "many-to-one",
      joinColumn: { name: "credit_package_id" },
    },
  },
});
