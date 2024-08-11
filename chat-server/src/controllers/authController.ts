import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, addUser, findUserByUsername } from '../models/user';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).json({ message: 'שם משתמש וסיסמא חובה'})
  }
  if (findUserByUsername(username)) {
    return res.status(400).json({ message: 'שם משתמש כבר קיים' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { id: uuidv4(), username, password: hashedPassword };
  addUser(newUser);
  res.status(201).json({ message: 'משתמש נרשם בהצלחה' });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = findUserByUsername(username);
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ userId: user.id, message: 'התחברת בהצלחה' });
  } else {
    res.status(400).json({ message: 'שם משתמש או סיסמה שגויים' });
  }
};
