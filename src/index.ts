import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import allRoutes from './presentation/routes/routes';
import session from 'express-session'
import passport from 'passport'
import './config/passportConfig'

const app = express();

dotenv.config({
  path: './config.env',
});

const PORT = process.env.PORT || 5000;
const originUrl = process.env.ORIGIN || '';

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || originUrl.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(session({
    secret: process.env.SESSION_SECRETE || 'secret',
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(passport.initialize())
app.use(passport.session())



app.use('/api', allRoutes)

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is working',
  });
});

const server = app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

server.on('UnhandledRejection', (err) => {
  console.log(err);
  server.close(() => process.exit(1));
});
