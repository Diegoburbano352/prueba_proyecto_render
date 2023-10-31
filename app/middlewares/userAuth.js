// Importing modules
const express = require("express");
const db = require("../models");

// Assigning db.users to User variable
const User = db.users;

// Function to check if username or email already exist in the database
// This is to avoid having two users with the same username and email
const saveUser = async (req, res, next) => {
  // Search the database to see if the username exists
  try {
    const username = await User.findOne({
      where: {
        userName: req.body.userName,
      },
    });

    // If username exists in the database, respond with a status of 409
    if (username) {
      return res.status(409).json({ error: "El nombre de usuario ya esta en uso" });
    }

    // Checking if the email already exists
    const emailCheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // If email exists in the database, respond with a status of 409
    if (emailCheck) {
      return res.status(409).json({ error: "El correo ya esta en uso" });
    }

    // If neither the username nor email exists, proceed to the next middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Exporting the module
module.exports = {
  saveUser,
};
