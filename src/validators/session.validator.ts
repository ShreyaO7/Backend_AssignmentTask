import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid id");

export const createSessionSchema = z.object({
  body: z.object({
    teacherId: objectId,
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  }),
});

export const sessionIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const bookSessionSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    userId: objectId,
  }),
});

export const availableSessionsQuerySchema = z.object({
  query: z.object({
    dateTimestamp: z.string().regex(/^\d+$/, "dateTimestamp must be a valid timestamp"),
  }),
});
