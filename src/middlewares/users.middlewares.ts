import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'

import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({
      error: 'Email and password are required'
    })
    return
  }
  next()
}
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 6, max: 100 }
      },
      trim: true
    },

    email: {
      notEmpty: true,
      isEmail: true,
      normalizeEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const isEmailExist = await usersService.checkEmailExist(value)
          if (isEmailExist) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },

    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 6, max: 50 }
      },
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      },
      errorMessage:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol'
    },

    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 6, max: 50 }
      },
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      },
      errorMessage:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol',
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm password must be same as password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true }
      }
    }
  })
)
