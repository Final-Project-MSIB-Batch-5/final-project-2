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
      "SocialMedia",
      [
        {
          name: "Instagram 1",
          social_media_url: "https://www.instagram.com/",
          UserId: 1,
        },
        {
          name: "Instagram 2",
          social_media_url: "https://www.instagram.com/1",
          UserId: 1,
        },
        {
          name: "Instagram 3",
          social_media_url: "https://www.instagram.com/2",
          UserId: 1,
        },
        {
          name: "Facebook 1",
          social_media_url: "https://www.facebook.com/",
          UserId: 2,
        },
        {
          name: "Facebook 2",
          social_media_url: "https://www.facebook.com/1",
          UserId: 2,
        },
        {
          name: "Facebook 3",
          social_media_url: "https://www.facebook.com/2",
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
    await queryInterface.bulkDelete("SocialMedia", null, {});
  },
};
