import http from "node:http";

import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import * as mongoose from "mongoose";
import { Server } from "socket.io";
import * as swaggerUi from "swagger-ui-express";

import { configs } from "./configs/configs";
import { cronRunner } from "./crons";
import { ApiError } from "./errors/api.error";
import { advertRouter } from "./routers/advert.router";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import * as swaggerJson from "./utils/swagger.json";

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("message:created", () => {
    //  socket.emit("message:received", { received: true });
  });

  socket.on("room:writeToSeller", ({ roomId }) => {
    socket.join(roomId);

    socket.to(roomId).emit("room:newBuyerJoined", socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/users", userRouter);
app.use("/adverts", advertRouter);
app.use("/auth", authRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;

  res.status(status).json({
    message: error.message,
    status: error.status,
  });
});

server.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  cronRunner();
  console.log(`Server has successfully started on PORT ${configs.PORT}`);
});

// CRUD c - create, r - read, u - update, d - delete
