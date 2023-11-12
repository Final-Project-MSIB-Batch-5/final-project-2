"use strict";
const { comparePassword } = require("../helpers/bcrypt");

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
      "User",
      [
        {
          email: "ravi123@gmail.com",
          full_name: "Ravi",
          username: "ravi123",
          password: comparePassword("123"),
          profile_image_url: "https://source.unsplash.com/3tYZjGSBwbk",
          age: 21,
          phone_number: "08273861921",
        },
        {
          email: "touka@gmail.com",
          full_name: "Touka",
          username: "touka123",
          password: comparePassword("123"),
          profile_image_url: "https://source.unsplash.com/Nhkc6X3XVcI",
          age: 18,
          phone_number: "0838991091334",
        },
        {
          email: "kaneki@gmail.com",
          full_name: "Kaneki",
          username: "kaneki123",
          password: comparePassword("123"),
          profile_image_url: "https://source.unsplash.com/wDJ80Pl66mg",
          age: 20,
          phone_number: "081273847828",
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
    await queryInterface.bulkDelete("User", null, {});
  },
};
