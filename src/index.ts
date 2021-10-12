require("dotenv").config();

import { container, TYPES } from "lib/inversify";
import { Bot } from "classes";

const bot = container.get<Bot>(TYPES.Bot);

bot
  .listen()
  .then(() => {
    console.log("Logged in!");
  })
  .catch((error) => {
    console.log("Oh no! ", error);
  });
