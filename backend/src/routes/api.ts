import { Router } from "express";

import { adminRouter } from "../modules/admin/router";
import { authRouter } from "../modules/auth/router";
import { listingsRouter } from "../modules/listings/router";
import { messagesRouter } from "../modules/messages/router";
import { usersRouter } from "../modules/users/router";
import { wishlistRouter } from "../modules/wishlist/router";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/listings", listingsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/wishlist", wishlistRouter);
