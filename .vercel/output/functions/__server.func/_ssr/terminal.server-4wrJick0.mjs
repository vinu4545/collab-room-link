//#region node_modules/.nitro/vite/services/ssr/assets/terminal.server-4wrJick0.js
var ITERATIONS = 1e5;
function toHex(buf) {
	return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex) {
	const out = new Uint8Array(hex.length / 2);
	for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	return out;
}
async function derive(password, salt) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
	return toHex(await crypto.subtle.deriveBits({
		name: "PBKDF2",
		salt,
		iterations: ITERATIONS,
		hash: "SHA-256"
	}, key, 256));
}
async function hashPassword(password) {
	const salt = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	const hash = await derive(password, salt);
	return `pbkdf2$${ITERATIONS}$${toHex(salt.buffer)}$${hash}`;
}
async function verifyPassword(password, stored) {
	const [, , saltHex, hash] = stored.split("$");
	if (!saltHex || !hash) return false;
	const candidate = await derive(password, fromHex(saltHex));
	if (candidate.length !== hash.length) return false;
	let diff = 0;
	for (let i = 0; i < hash.length; i++) diff |= candidate.charCodeAt(i) ^ hash.charCodeAt(i);
	return diff === 0;
}
function validatePassword(password) {
	const errors = [];
	if (password.length < 6) errors.push("Password must contain at least 6 characters.");
	if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase character.");
	if (!/[0-9]/.test(password)) errors.push("Password must contain at least one numeric value.");
	return errors;
}
async function requireMember(terminalId, memberId) {
	const { getMember } = await import("./localStorage.server-DgrQmuv2.mjs");
	const member = await getMember(terminalId, memberId);
	if (!member) throw new Error("Not connected to this terminal.");
	return { member };
}
//#endregion
export { hashPassword, requireMember, validatePassword, verifyPassword };
