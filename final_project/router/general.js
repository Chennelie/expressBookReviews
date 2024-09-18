const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    try {
      const response = await axios.get("http://localhost:5000/books");
      res.status(200).json(response.data);
    } catch (error) {
      res.status(404).send("Can't get books " + error);
    }
  });

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
      let isbn = req.params.isbn;
      try {
        const response = await axios.get("http://localhost:5000/books");
        if (response.data[isbn]) {
          return res
            .status(200)
            .json(response.data[isbn]);
        } else {
          return res
            .status(404)
            .send("No book found with ISBN " + isbn);
        }
      } catch (error) {
        return res
          .status(500)
          .send("Internal Server Error");
      }
    }
  );
  
// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
      let author = req.params.author;
      let booksByAuthor = [];
      try {
        const response = await axios.get("http://localhost:5000/books");
        for (let isbn in response.data) {
          if (response.data[isbn].author == author) {
            booksByAuthor.push(response.data[isbn]);
          }
        }
        if (booksByAuthor.length > 0) {
          return res
            .status(200)
            .json(booksByAuthor);
        } else {
          return res
            .status(404)
            .send("No book found with author " + author);
        }
      } catch (error) {
        return res
          .status(500)
          .send("Internal Server Error");
      }
    }
  );

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
      let title = req.params.title;
      let booksByTitle = [];
      try {
        const response = await axios.get("http://localhost:5000/books");
        for (let isbn in response.data) {
          if (response.data[isbn].title == title) {
            booksByTitle.push(response.data[isbn]);
          }
        }
        if (booksByTitle.length > 0) {
          return res.status(200).json(booksByTitle);
        } else {
          return res
            .status(404)
            .send("No book found with title " + title);
        }
      } catch (error) {
        return res
          .status(500)
          .send("Internal Server Error");
      }
    }
  );

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "No books found" });
    }
});

module.exports.general = public_users;
