import connectDB from "./DB/connection.js";
import { authRouter, messagesRouter, userRouter } from "./Modules/index.js";
import { globalErrorHandler, NotFoundException } from "./Utils/response/error.response.js";
import cors from "cors";

const bootstrap = async (app, express) => {
    await connectDB();
    app.use(express.json(), cors());

    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/message", messagesRouter);
    app.all("/*dummy", (req, res)=>{
        NotFoundException("Not Found Handler");
    });
    app.use(globalErrorHandler);
};

export default bootstrap;