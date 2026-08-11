import { z } from "zod";

export const credentialsSchema = z.object({
  username: z.string().trim().min(3).max(40),
  password: z.string().min(1).max(200),
});

export const joinSchema = credentialsSchema.extend({
  displayName: z.string().trim().max(40).optional(),
});

export const createSchema = credentialsSchema.extend({
  confirmPassword: z.string().min(1).max(200),
  terminalName: z.string().trim().min(2).max(60),
  displayName: z.string().trim().max(40).optional(),
});

export const sessionSchema = z.object({
  terminalId: z.string().uuid(),
  memberId: z.string().uuid(),
});

export const messageSchema = sessionSchema.extend({
  body: z.string().trim().min(1).max(2000),
});

export const uploadSchema = sessionSchema.extend({
  fileName: z.string().trim().min(1).max(200),
  mimeType: z.string().max(120).default("application/octet-stream"),
  content: z.string().max(14_000_000),
});

export const fileLinkSchema = sessionSchema.extend({ fileId: z.string().uuid() });

export const usernameSchema = z.object({ username: z.string().trim().min(1).max(40) });

export type TerminalSession = {
  terminalId: string;
  memberId: string;
  terminalName: string;
  displayName: string;
  ownerUsername: string;
  isOwner: boolean;
};
