import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import cors from "cors";
import { MONGODB_URI, SESSION_SECRET, CLIENT_URL } from "./util/secrets";
import {issueJWT} from "./util/issue-jwt";
import socketIO from "socket.io";
import httpServer from "http";

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";
import * as opportunityController from "./controllers/opportunity";
import * as chatController from "./controllers/chat";
import {initSocketIO, getIO} from "./socket";
//import {initSocket} from "./socket";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";


const MongoStore = mongo(session);

const app: any  = express();
const http = httpServer.createServer(app);

// Init socket io
initSocketIO(http);

/*
*  Socket handlers
*/
chatController.setupChatSockets();

app.use(cors({credentials: true, origin: "*"}));



// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

// Express configuration
//app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
    req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);



/**
 * Primary app routes.
 */
app.get("/", homeController.index);
app.get("/login", userController.getLogin);
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);
app.get("/forgot", userController.getForgot);
app.post("/forgot", userController.postForgot);
app.get("/reset/:token", userController.getReset);
app.post("/reset/:token", userController.postReset);
app.get("/signup", userController.getSignup);
app.post("/signup", userController.postSignup);
app.get("/contact", contactController.getContact);
app.post("/contact", contactController.postContact);
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
//app.post("/api/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.get("/api/opportunity", passportConfig.isJWTAuth,opportunityController.getOpportunitys);
app.post("/api/opportunity",passportConfig.isJWTAuth, opportunityController.createOpportunity);
app.put("/api/opportunity/:id", opportunityController.editOpportunity);
app.get("/api/opportunity/:id/chat", passportConfig.isJWTAuth, chatController.getChat);

app.get("/api/auth/", passportConfig.isAuthenticated, userController.getAuth);
app.get("/api/users/", passportConfig.isAuthenticated, userController.getUsers);
app.get("/api/user/", passportConfig.isJWTAuth, userController.getUser);
app.post("/api/profile", passportConfig.isJWTAuth, userController.updateProfile);

app.post("/api/chat",passportConfig.isJWTAuth, chatController.createChat);
app.get("/api/chat", passportConfig.isJWTAuth, chatController.getChats);



/**
 * OAuth authentication routes. (Sign in)
 */
//app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
    res.redirect(req.session.returnTo || "/");
});



app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"]}));

app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    const token = issueJWT(req.user);
    const urlPath = ("authed?token="+encodeURIComponent(token.token)+ "&expires="+encodeURIComponent(token.expires));
    res.redirect(CLIENT_URL + "/"+ urlPath);
  });


  http.listen(8080);

  export default app;
