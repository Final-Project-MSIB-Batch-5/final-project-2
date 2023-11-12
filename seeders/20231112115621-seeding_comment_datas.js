"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Comment",
      [
        {
          comment: "Nice",
          PhotoId: 1,
          UserId: 1,
        },
        {
          comment: "Beautiful",
          PhotoId: 1,
          UserId: 1,
        },
        {
          comment: "Not bad",
          PhotoId: 2,
          UserId: 2,
        },
        {
          comment: "Awesome",
          PhotoId: 2,
          UserId: 2,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Comment", null, {});
  },
};
