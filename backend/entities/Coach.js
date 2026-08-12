const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
  name: "Coach",
  tableName: "COACH",
  columns: {
    id:{
      type: "uuid",
      primary: true,
      generated:"uuid",
      nullable: false
    },
    experience_years: {
      type: "int",
      nullable: false,
    },
    description: {
      type: "varchar",
      length: 255,
      nullable: false
    },
    profile_image_url: {
      type: "varchar",
      length: 2048,
      nullable: true
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
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      joinColumn: { name: "user_id"}
    },
  }
})