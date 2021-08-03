import express from "express";
import cookieParser from "cookie-parser";
import auth from "./routes/auth";
import groups from "./routes/groups";
import triggers from "./routes/triggers";
import stats from "./routes/stats";
import { middleware, config } from "./utils";
import bot from "./bot";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());

app.use("/auth", auth);
app.use("/groups", middleware.requireAuthentication, groups);
app.use(
  "/triggers",
  [middleware.requireAuthentication, middleware.checkGroupId],
  triggers
);
app.use(
  "/stats",
  [middleware.requireAuthentication, middleware.checkGroupId],
  stats
);

app.get("/test", function(req, res) {
  res.send("hello world!");
});
app.get("/testAuth", [middleware.requireAuthentication], function(req, res) {
  res.send("secure message: hello world");
});

if (config.bot_token) {
  bot.launch();
} else {
  console.log("Bot disabled because bot_token not defined");
}

export default {
  path: "/api",
  handler: app,
};
