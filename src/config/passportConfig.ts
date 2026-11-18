import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import pool from './dbConnect';
import { UserType } from '../types/types';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const [rows] = await pool.execute<UserType[]>(
          'SELECT * FROM users WHERE email = ?',
          [email],
        );

        // Check whether the user exists
        if (rows.length === 0) {
          return done(null, false, {
            message: 'Invalid email or password!',
          });
        }

        const user = rows[0];

        // Compare submitted password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, {
            message: 'Invalid email or password!',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user.user_id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user_id = Number(id);
    const [rows] = await pool.execute<UserType[]>(
      `SELECT user_id, email, firstname, lastname, phone
       FROM users
       WHERE user_id = ?`,
      [user_id],
    );

    if (rows.length === 0) {
      return done(null, false);
    }

    return done(null, rows[0]);
  } catch (error) {
    return done(error);
  }
});
