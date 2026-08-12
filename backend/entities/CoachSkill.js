const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
  name: "CoachSkill",
  tableName: "COACH_SKILL",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
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
  },
  relations: {
    coach: {
      target: "Coach",
      type: "many-to-one",
      joinColumn: { name: "coach_id"}
    },
    skill: {
      target: "Skill",
      type: "many-to-one",
      joinColumn: { name: "skill_id"}
    }
  }
})