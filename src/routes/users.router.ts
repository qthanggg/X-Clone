import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getUserProfileController,
  followUserController,
  unfollowUserController,
  changePasswordController,
  loginWithGoogleController
} from '~/controllers/users.controllers'
import { fillterMiddleware } from '~/middlewares/common.middleware'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followUserValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowUserValidator,
  updateMeValidator,
  verifyForgotPasswordValidator,
  verifyUserValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeRequestBody } from '~/models/request/User.request'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()
/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: { email, password }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description: Register
 * Path: /register
 * Method: POST
 * Body: { email, password, confirm_password, date_of_birth }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/**
 * Description: Logout
 * Path: /logout
 * Method: POST
 * Body: { refresh_token }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
/**
 * Description: Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
/**
 * Description: Verify email when user click on link in email
 * Path: /verify-email
 * Method: GET
 * Body: { email_verify_token }
 */
usersRouter.get('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))
/**
 * Description: Resend verify email
 * Path: /resend-verify-email
 * Method: POST
 * Body: { }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))
/**
 * Description: Forgot password
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))
/**
 * Description: Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)
/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
/**
 * Description: Change password
 * Path: /change-password
 * Method: POST
 * Body: { password: string, new_password: string, confirm_new_password: string }
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifyUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)
/**
 * Description: Get user profile
 * Path: /me
 * Method: GET
 * Body:  { Authozation: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
/**
 * Description: Get user profile
 * Path: /me
 * Method: GET
 * Body: { Authozation: Bearer <access_token> }
 * Body: User schema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifyUserValidator,
  updateMeValidator,
  fillterMiddleware<UpdateMeRequestBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)
/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 * Body: { Authozation: Bearer <access_token> }
 * Body: User schema
 */
usersRouter.get('/:username', wrapRequestHandler(getUserProfileController))
/**
 * Description: Follow user
 * Path: /follow
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { followed_user_id: string }
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifyUserValidator,
  followUserValidator,
  wrapRequestHandler(followUserController)
)
/**
 * Description: Unfollow user
 * Path: /unfollow/user_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Body: { followed_user_id: string }
 */
usersRouter.delete(
  '/unfollow/:followed_user_id',
  accessTokenValidator,
  verifyUserValidator,
  unfollowUserValidator,
  wrapRequestHandler(unfollowUserController)
)
/**
 * Description: Login with Google
 * Path: /login/oauth
 * Method: GET
 * Query: {code: string}
 */
usersRouter.get('/login/oauth', wrapRequestHandler(loginWithGoogleController))
/**
 * Description: Verify email for OAuth users
 * Path: /login/oauth/verify-email
 * Method: GET
 * Query: { email_verify_token: string }
 */
usersRouter.get('/login/oauth/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

export default usersRouter
