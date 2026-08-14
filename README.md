# Shared Workspace

==================================================

🔄 MODIFIED ENTRY & TERMINAL CREATION FLOW

==================================================

IMPORTANT:

Replace the previous authentication/entry flow with the following two-path terminal system.

The website should NOT immediately show a username/password login form when the URL is opened.

Instead, the first screen must be a premium, attractive "Welcome / Terminal Access" screen with TWO clear options:

┌──────────────────────────────────────────────┐

│              Welcome to the Workspace        │

│                                              │

│  Choose how you want to continue:            │

│                                              │

│  [ 🔗 JOIN EXISTING TERMINAL ]               │

│  Connect to a terminal already created       │

│  by your friend/classmate.                   │

│                                              │

│  [ ➕ CREATE NEW TERMINAL ]                  │

│  Create your own private terminal for        │

│  file sharing and collaboration.             │

└──────────────────────────────────────────────┘

Use attractive cards, icons, subtle gradients, hover effects, smooth transitions,

and clear visual hierarchy.

==================================================

🔗 OPTION 1 — JOIN EXISTING TERMINAL

==================================================

When the user selects:

"Join Existing Terminal"

Open a dedicated terminal-access interface.

Ask for:

1. Username

2. Password

The username + password combination represents the identity/credentials

of the existing terminal.

The system must verify the credentials against the stored terminal/user

records.

SUCCESS:

If the username and password match an existing terminal:

→ Authenticate the user

→ Connect the user to that existing terminal

→ Open the shared workspace/chat interface

→ Allow the user to communicate with other connected users

→ Allow file uploads

→ Display the existing terminal's shared files/messages

The user must NOT create another terminal.

The UI should clearly show:

🟢 Connected to existing terminal

and display the terminal/workspace name or identifier.

FAILURE:

If the username/password combination does not match:

Show a clear error state:

❌ "Terminal not found or credentials are incorrect."

Provide:

[ Try Again ]

[ Create New Terminal ]

Do NOT silently create a new terminal.

==================================================

➕ OPTION 2 — CREATE NEW TERMINAL

==================================================

When the user selects:

"Create New Terminal"

Open a dedicated terminal creation form.

Required fields:

• Username

• Password

• Confirm Password

• Terminal Name

PASSWORD REQUIREMENTS:

Password must:

✓ Contain at least 6 characters

✓ Contain at least one uppercase character

✓ Contain at least one numeric value

Display password requirements dynamically while the user types.

Example:

Password requirements

✓ At least 6 characters

✓ One uppercase character

✗ One numeric value

If the user attempts to submit an invalid password:

Show a clear inline validation message and an attractive alert/toast.

Examples:

"Password must contain at least one uppercase character."

"Password must contain at least one numeric value."

"Password must contain at least 6 characters."

"Passwords do not match."

Do not allow terminal creation until all validation requirements are satisfied.

==================================================

🔐 UNIQUE USER / TERMINAL VALIDATION

==================================================

THIS IS A CRITICAL BUSINESS RULE.

Before creating a new terminal, the system MUST check whether the

username already exists.

The username must be UNIQUE.

The system must perform this validation against the persistent database,

NOT only against frontend/local state.

FLOW:

User enters username

↓

System checks database

↓

IF username already exists:

❌ DO NOT create terminal

Show:

"Username already exists. Please choose another username or join

your existing terminal."

Provide:

[ Choose Another Username ]

[ Join Existing Terminal ]

↓

IF username does NOT exist:

✓ Continue validation

↓

Validate password

↓

Validate confirm password

↓

Create the new terminal

↓

Create the user/owner record

↓

Automatically connect the user to the newly created terminal

↓

Open the workspace

==================================================

🧠 TERMINAL IDENTITY MODEL

==================================================

Treat each terminal as an independent collaboration workspace.

Each terminal should have:

• Unique Terminal ID

• Terminal Name

• Owner Username

• Creation Timestamp

• Connected Users

• Shared Messages

• Shared Files

A user who creates a terminal becomes the owner/creator of that terminal.

Other users can join that terminal only through the correct existing

terminal credentials.

Do NOT allow duplicate usernames.

Do NOT create duplicate terminals for an existing username.

Do NOT automatically connect users to unrelated terminals.

==================================================

👥 COLLABORATION LOGIC

==================================================

Example scenario:

USER A:

Username: student01

Password: ********

Creates:

Terminal: Practical-01

↓

USER A enters the workspace.

↓

USER B wants to work with USER A.

USER B selects:

"Join Existing Terminal"

and enters the credentials associated with the existing terminal.

↓

System validates the credentials.

↓

USER B joins the same terminal.

↓

Both users can see:

💬 Shared chat messages

📁 Uploaded files

📄 PDFs

📝 Shared text/code

👥 Connected users

Changes made inside the shared workspace should be reflected for all

connected users.

==================================================

🚫 INVALID CONNECTION SCENARIO

==================================================

Example:

Existing terminal:

Username: student01

Password: ********

New user enters:

Username: student02

Password: ********

If student02 does not have a valid existing terminal:

→ Do NOT connect them to student01's terminal.

Instead show:

"These credentials do not belong to an existing terminal."

Then provide:

[ Create New Terminal ]

[ Try Again ]

This prevents accidental connections between unrelated users.

==================================================

🛡️ SECURITY & VALIDATION RULES

==================================================

Never determine username uniqueness only on the frontend.

The backend/database must enforce a UNIQUE constraint on usernames.

Prevent duplicate terminal creation caused by:

• Double-clicking the Create button

• Refreshing during submission

• Multiple simultaneous requests

Disable the submit button while creation is processing.

Show:

⏳ Checking username...

then:

⏳ Creating terminal...

then:

✅ Terminal created successfully.

Passwords must never be displayed in plaintext after submission.

Store passwords securely using proper password hashing.

Never expose passwords in API responses, logs, frontend state,

URLs, or browser storage.

==================================================

🎨 USER EXPERIENCE

==================================================

Make the entry experience extremely simple for students.

The first screen should visually communicate:

"Work together without repeatedly logging into separate platforms."

Use two large interactive cards:

🔗 JOIN EXISTING TERMINAL

"Connect with your friend and continue working together."

➕ CREATE NEW TERMINAL

"Start a new workspace for your practical, files and collaboration."

Use:

• Blue/white gradient-based interface

• Glass-style cards

• Soft shadows

• Rounded components

• Smooth hover effects

• Micro-interactions

• Loading states

• Toast notifications

• Inline validation

• Responsive design

Do not overload the entry screen.

The two choices must be immediately understandable.

==================================================

🔄 IMPORTANT CHANGE FROM THE PREVIOUS FLOW

==================================================

The application must NOT force every user through the same login page.

The new primary flow is:

URL OPENED

      ↓

WELCOME / TERMINAL ACCESS

      ↓

 ┌─────────────────────────────┐

 │                             │

 ▼                             ▼

JOIN EXISTING             CREATE NEW

TERMINAL                   TERMINAL

 │                             │

 ▼                             ▼

Validate credentials      Check username

 │                             │

 │                       ┌─────┴─────┐

 │                       │           │

 │                    EXISTS      UNIQUE

 │                       │           │

 │                       ❌           ✓

 │                       │           │

 │                  Reject       Validate

 │                                   │

 │                                   ▼

 │                              Create Terminal

 │                                   │

 └───────────────┬───────────────────┘

                 ▼

          SHARED WORKSPACE

                 │

       ┌─────────┼─────────┐

       ▼         ▼         ▼

     CHAT      FILES     SHARED DATA

==================================================

🎯 CORE PRODUCT PRINCIPLE

==================================================

The terminal is the main concept of the application.

Think of it as a lightweight temporary digital room for college practical

work.

A student can:

• Create a terminal

• Share the terminal credentials with friends

• Allow friends to join the same workspace

• Chat with connected users

• Upload PDFs and other files

• Share practical-related text/data

• Access shared resources without repeatedly logging into separate

  communication platforms

The experience should feel like:

"Create a room → Share access → Collaborate → Upload → Chat → Finish"

Keep the system simple, intelligent, and student-friendly.

Do NOT add unnecessary enterprise features.

The primary goal is to solve the repeated-login and practical-file-sharing

problem in a fast and intuitive way.




use the uploaded image as an logo of the website

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0ba3b46c-9eb8-4918-b408-7a3fceebb56b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
