import passport from 'passport';
import { Router } from 'express';
import { generateAuthToken } from '../util/jwt.js';
import { current } from '../controllers/session.controler.js';

const sessionsRoute = Router();

sessionsRoute.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req, res) => {})

sessionsRoute.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    const user = req.user;
    const accessToken = generateAuthToken(user);
    res
      .cookie("authToken", accessToken, { httpOnly: true })
      .redirect("../../api/products/list");

    res.redirect('/')
})

sessionsRoute.get(
    "/current",
    passport.authenticate("current", { session: false }),
    current
  );

export default sessionsRoute;