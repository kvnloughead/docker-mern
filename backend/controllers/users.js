const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");

// GET /users/me
const getUserData = (req, res) => {
  if (req.user) {
    User.findById(req.user._id)
      .orFail(() => {
        const error = new Error("User ID not found");
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      })
      .then((user) => res.send(user))
      .catch((err) => {
        console.error(err);
        // 400 — invalid data passed to the methods for creating a card/user or
        // updating a user's profile or avatar
        if (err.name === "CastError") {
          res
            .status(BAD_REQUEST_ERROR_CODE)
            .send({ message: "Invalid user ID" });
          // 404 — there is no user or card with the requested id or
          // the request is sent to a non-existent address
        } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
          res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
          // 500 — default error. Accompanied by the message: "An error has occurred on the server";
        } else {
          res
            .status(INTERNAL_SERVER_ERROR_CODE)
            .send({ message: "An error has occurred on the server" });
        }
      });
  }
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar, password, email } = req.body;

  if (!email || !password) {
    res.status(BAD_REQUEST_ERROR_CODE).send({
      message: "The 'email' and 'password' fields are required",
    });

    return;
  }

  // The previous approach (commented out was to use findOne, then manually
  // check if the email is a duplicate before creating a new document. I think
  // the current implementation is cleaner.
  //
  // User.findOne({ email })
  //   .then((user) => {
  //     if (user) {
  //       const error = new Error(
  //         "The user with the provided email already exists"
  //       );
  //       error.statusCode = CONFLICT_ERROR_CODE;
  //       throw error;
  //     }
  //     return bcrypt.hash(password, 10)
  //
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      // Remove password before sending. Optionally, a static method could be
      // defined. See models/user.
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      console.error(err);
      // 409 - conflict error if email is a duplicate.
      if (err.code === 11000) {
        res
          .status(CONFLICT_ERROR_CODE)
          .send({ message: "Email already exists" });
        // 400 - invalid data passed to the methods for creating a card/user or
        // updating a user's profile or avatar
      } else if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
        // 409 - conflict error
      } else if (err.statusCode === CONFLICT_ERROR_CODE) {
        res.status(CONFLICT_ERROR_CODE).send({ message: err.message });
        // 500 — default error. Accompanied by the message: "An error has occurred on the server";
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// POST /signin
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      // Students can save jwt in the cookie, or send it in the body of the response.
      // Both options are ok
      res
        // .cookie('jwt', token, {
        //  // jwt token lives for a specific period (for example, 7 days),
        //  // and is not given indefinitely
        //   maxAge: 3600000,
        //   httpOnly: true,
        //   sameSite: true,
        // })
        .send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_ERROR_CODE)
          .send({ message: "Incorrect email or password" });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "An error has occurred on the server",
      });
    });
};

// PATCH /users/me
const updateUserData = (req, res) => {
  // When updating a user or cards, `new: true` is passed to options.
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      // 400 — invalid data passed to the methods for creating a card/user or
      // updating a user's profile or avatar
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
        // 404 — there is no user or card with the requested id or
        // the request is sent to a non-existent address
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
        // 500 — default error. Accompanied by the message: "An error has occurred on the server";
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = {
  createUser,
  login,
  getUserData,
  updateUserData,
};
