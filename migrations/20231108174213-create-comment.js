"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comment", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      PhotoId: {
        type: Sequelize.INTEGER,
      },
      comment: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("Comment", {
      fields: ["UserId"],
      type: "foreign key",
      name: "user_fk_comment",
      references: {
        table: "User",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("Comment", {
      fields: ["PhotoId"],
      type: "foreign key",
      name: "photo_fk_comment",
      references: {
        table: "Photo",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Comment", "user_fk_comment");
    await queryInterface.removeConstraint("Comment", "photo_fk_comment");
    await queryInterface.dropTable("Comment");
  },
};
