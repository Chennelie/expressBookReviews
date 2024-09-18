const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
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
public_users.get('/',function (req, res) {
    if (books) {
        return res.status(200).send(JSON.stringify(books, null, 4));
    } else {
        return res.status(404).json({ message: "No books found" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(books[isbn]);
    } else {
        return res.status(404).json({ message: "No books found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];
    if (books) {
        for(let isbn in books) {
            if(books[isbn].author == author) {
                booksByAuthor.push(books[isbn])
            }
        }
        return res.status(200).send(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    if (books) {
        for(let isbn in books) {
            if(books[isbn].title == title) {
                booksByTitle.push(books[isbn])
            }
        }
        return res.status(200).send(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found" });
    }
});

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
