import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terminal.schemas-BU5-cy6k.js
var credentialsSchema = objectType({
	username: stringType().trim().min(3).max(40),
	password: stringType().min(1).max(200)
});
var joinSchema = credentialsSchema.extend({ displayName: stringType().trim().max(40).optional() });
var createSchema = credentialsSchema.extend({
	confirmPassword: stringType().min(1).max(200),
	terminalName: stringType().trim().min(2).max(60),
	displayName: stringType().trim().max(40).optional()
});
var sessionSchema = objectType({
	terminalId: stringType().uuid(),
	memberId: stringType().uuid()
});
var messageSchema = sessionSchema.extend({ body: stringType().trim().min(1).max(2e3) });
var uploadSchema = sessionSchema.extend({
	fileName: stringType().trim().min(1).max(200),
	mimeType: stringType().max(120).default("application/octet-stream"),
	content: stringType().max(14e6)
});
var fileLinkSchema = sessionSchema.extend({ fileId: stringType().uuid() });
var usernameSchema = objectType({ username: stringType().trim().min(1).max(40) });
//#endregion
export { sessionSchema as a, messageSchema as i, fileLinkSchema as n, uploadSchema as o, joinSchema as r, usernameSchema as s, createSchema as t };
