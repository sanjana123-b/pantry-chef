import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'pantrychef_uid';
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

export const sessionUser = (req, res, next) => {
  let userId = req.cookies?.[COOKIE_NAME] || req.headers['x-user-id'];

  if (!userId) {
    userId = uuidv4();
    res.cookie(COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: ONE_YEAR,
      path: '/',
    });
  }

  req.userId = userId;
  next();
};
