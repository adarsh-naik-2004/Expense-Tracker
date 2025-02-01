import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 4. Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    // 5. Set HTTP-only cookie for refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 6. Send response
    res.status(201).json({
      accessToken,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Validate password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    // 3. Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    
    // 4. Update refresh token in DB
    await User.findByIdAndUpdate(user._id, { refreshToken });

    // 5. Set HTTP-only cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 6. Send response
    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  
  const refreshToken = cookies.jwt;
  
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) return res.sendStatus(403);
        
        const accessToken = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );
        
        res.json({ 
          accessToken,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};
