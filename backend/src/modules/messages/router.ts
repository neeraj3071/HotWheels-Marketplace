import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { validateRequest } from "../../middleware/validateRequest";
import { catchAsync } from "../../utils/catchAsync";

import {
  createMessageSchema,
  createThreadSchema,
  listMessagesQuerySchema
} from "./schemas";
import {
  createMessageInThread,
  createThread,
  listMessagesForThread,
  listThreadsForUser
} from "./service";

export const messagesRouter = Router();

messagesRouter.use(authenticate);

messagesRouter.get(
  "/threads",
  catchAsync(async (req, res) => {
    const threads = await listThreadsForUser(req.user!.id);
    res.status(200).json(threads);
  })
);

messagesRouter.post(
  "/threads",
  validateRequest(createThreadSchema),
  catchAsync(async (req, res) => {
    const thread = await createThread(
      req.user!.id,
      req.body.participantId,
      req.body.listingId
    );
    res.status(201).json(thread);
  })
);

messagesRouter.get(
  "/threads/:id/messages",
  validateRequest(listMessagesQuerySchema),
  catchAsync(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const messages = await listMessagesForThread(
      req.params.id,
      req.user!.id,
      limit
    );
    res.status(200).json(messages);
  })
);

messagesRouter.post(
  "/threads/:id/messages",
  validateRequest(createMessageSchema),
  catchAsync(async (req, res) => {
    const message = await createMessageInThread(
      req.params.id,
      req.user!.id,
      req.body.body
    );
    res.status(201).json(message);
  })
);
