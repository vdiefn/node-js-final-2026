const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
  name: "Skill",
  tableName: "SKILL",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
      nullable: false
    },
    name: {
      type: "varchar",
      length: 50,
      nullable: false
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      nullable: false
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      nullable: false
    }
  }
})