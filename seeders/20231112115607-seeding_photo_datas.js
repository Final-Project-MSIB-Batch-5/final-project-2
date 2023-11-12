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
      "Photo",
      [
        {
          poster_image_url: "https://source.unsplash.com/E49mqfvZOi4",
          title: "Pemandangan",
          caption: "Foto pemandangan di distrik 2",
          UserId: 1,
        },
        {
          poster_image_url: "https://source.unsplash.com/WBk4hrWKPA8",
          title: "Pemandangan di kota",
          caption: "Foto pemandangan di kota",
          UserId: 1,
        },
        {
          poster_image_url: "https://source.unsplash.com/1ctOFoMgGls",
          title: "Pemandangan di jalan",
          caption: "Foto pemandangan di jalan distrik 2",
          UserId: 2,
        },
        {
          poster_image_url: "https://source.unsplash.com/4KSqp_5aYXw",
          title: "Winter Night",
          caption: "Foto keadaan jalan dimalam hari 2",
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
    await queryInterface.bulkDelete("Photo", null, {});
  },
};
