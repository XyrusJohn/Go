import { body, validationResult } from "express-validator";

const allowedRoles = ["staff", "driver", "admin", "super_admin"];

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidationRules = [
  body("role")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Please Select Role.")
    .isIn(allowedRoles)
    .withMessage(
      `Invalid Role. Please Select Between: ${allowedRoles
        .map(
          (role) =>
            role
              .split("_") // Splits "super_admin" into ["super", "admin"]
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizes first letter of each word
              .join(" "), // Joins them back with a space
        )
        .join(", ")}`, // Joins all roles with a comma}`,
    ),
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid Email Format"),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name is Required")
    .customSanitizer((value) => {
      if (!value) return value;

      return value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last Name is Required")
    .customSanitizer((value) => {
      if (!value) return value;

      return value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }),
  body("middleInitial")
    .optional({ nullable: true })
    .trim()
    .isUppercase()
    .customSanitizer((value) => {
      if (value && value.length === 1) {
        return `${value}.`;
      }
      return value;
    }), // the output must e.g.: M.
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .toLowerCase()
    .withMessage("Username is Required"),
  body("password").trim().notEmpty().withMessage("Password is Required"),
];

export const updateProfileDetails = [
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last Name is Required")
    .customSanitizer((value) => {
      if (!value) return value;

      return value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name is Required")
    .customSanitizer((value) => {
      if (!value) return value;

      return value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }),
  body("middleInitial")
    .optional({ nullable: true })
    .trim()
    .isUppercase()
    .customSanitizer((value) => {
      if (value && value.length === 1) {
        return `${value}.`;
      }
      return value;
    }),
];

export const changePasswordValidationRules = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current Password is Required"),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New Password cannot be the same as Current Password");
      }
      return true;
    }),
];
