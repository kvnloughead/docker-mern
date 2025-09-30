const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItemRouter);

router.use(auth);

router.use("/users", userRouter);

// 404 — there is no user with the requested id or the request is sent to a non-existent address
router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
