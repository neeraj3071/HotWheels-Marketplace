import type { Prisma } from "@prisma/client";

import { HttpError } from "../../utils/httpError";
import { prisma } from "../../utils/prisma";

const messageSelect = {
  id: true,
  body: true,
  senderId: true,
  createdAt: true
} satisfies Prisma.MessageSelect;

const threadInclude = {
  listing: {
    select: {
      id: true,
      title: true,
      priceCents: true,
      images: true
    }
  },
  participants: {
    select: {
      id: true,
      displayName: true,
      avatarUrl: true
    }
  }
} satisfies Prisma.MessageThreadInclude;

const ensureThreadParticipant = async (threadId: string, userId: string) => {
  const thread = await prisma.messageThread.findFirst({
    where: {
      id: threadId,
      participants: {
        some: { id: userId }
      }
    },
    select: { id: true }
  });

  if (!thread) {
    throw new HttpError(403, "You do not have access to this conversation");
  }
};

export const listThreadsForUser = async (userId: string) => {
  const threads = await prisma.messageThread.findMany({
    where: {
      participants: {
        some: { id: userId }
      }
    },
    include: {
      ...threadInclude,
      messages: {
        select: messageSelect,
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return threads.map(({ messages, ...rest }) => ({
    ...rest,
    lastMessage: messages[0] ?? null
  }));
};

export const createThread = async (
  creatorId: string,
  participantId: string,
  listingId?: string
) => {
  if (creatorId === participantId) {
    throw new HttpError(400, "Cannot start a conversation with yourself");
  }

  const participant = await prisma.user.findUnique({
    where: { id: participantId },
    select: { id: true }
  });

  if (!participant) {
    throw new HttpError(404, "Participant not found");
  }

  if (listingId) {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing) {
      throw new HttpError(404, "Listing not found");
    }
  }

  const existingThread = await prisma.messageThread.findFirst({
    where: {
      listingId: listingId ?? null,
      participants: {
        some: { id: creatorId }
      },
      AND: {
        participants: {
          some: { id: participantId }
        }
      }
    },
    include: threadInclude
  });

  if (existingThread) {
    return existingThread;
  }

  const thread = await prisma.messageThread.create({
    data: {
      listingId: listingId ?? null,
      participants: {
        connect: [{ id: creatorId }, { id: participantId }]
      }
    },
    include: threadInclude
  });

  return thread;
};

export const listMessagesForThread = async (
  threadId: string,
  userId: string,
  limit?: number
) => {
  await ensureThreadParticipant(threadId, userId);

  return prisma.message.findMany({
    where: { threadId },
    select: messageSelect,
    orderBy: { createdAt: "asc" },
    take: limit
  });
};

export const createMessageInThread = async (
  threadId: string,
  senderId: string,
  body: string
) => {
  await ensureThreadParticipant(threadId, senderId);

  const message = await prisma.message.create({
    data: {
      threadId,
      senderId,
      body
    },
    select: messageSelect
  });

  await prisma.messageThread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() }
  });

  return message;
};
