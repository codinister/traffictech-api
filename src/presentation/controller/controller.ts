import { Request, Response } from 'express';
import pool from '../../config/dbConnect';
const bcrypt = require('bcryptjs');
import { fromZodError } from 'zod-validation-error';
import schemaTypes from '../../types/schemaTypes';

export const logInController = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'You are logged in',
  });
};

export const logOutController = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(401).json({
      error: 'unauthorized user!',
    });

  req.logout((err) => {
    if (err)
      return res.status(400).json({
        message: 'User is not logged in!',
      });

    res.status(200).json({
      message: 'Logout successfull!',
    });
  });
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const schema = schemaTypes.safeParse(req.body);

    if (!schema.success) {
      const error = fromZodError(schema.error);
      return res.status(401).json({
        message: error.message,
      });
    }

    const { firstname, lastname, email, password, phone } = schema.data;

    const pass = await bcrypt.hash(password, 10);

    const [rows] = await pool.execute(
      'INSERT INTO users(firstname, lastname, email, password, phone) VALUES(?,?,?,?,?)',
      [firstname, lastname, email, pass, phone],
    );

    res.status(200).json({
      message: 'User added successfully!',
    });
  } catch (error) {
    res.status(401).json({
      message: error,
    });
  }
};

export const loginStatusController = async (req: Request, res: Response) => {
  res.status(200).json({
    message: req.user,
  });
};
