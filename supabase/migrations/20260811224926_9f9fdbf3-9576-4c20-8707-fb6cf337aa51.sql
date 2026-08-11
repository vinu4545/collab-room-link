CREATE TABLE public.terminals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_username text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX terminals_owner_username_key ON public.terminals (lower(owner_username));
GRANT ALL ON public.terminals TO service_role;
ALTER TABLE public.terminals ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.terminal_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  terminal_id uuid NOT NULL REFERENCES public.terminals(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  is_owner boolean NOT NULL DEFAULT false,
  last_seen timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX terminal_members_terminal_idx ON public.terminal_members (terminal_id);
GRANT ALL ON public.terminal_members TO service_role;
ALTER TABLE public.terminal_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.terminal_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  terminal_id uuid NOT NULL REFERENCES public.terminals(id) ON DELETE CASCADE,
  author text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX terminal_messages_terminal_idx ON public.terminal_messages (terminal_id, created_at);
GRANT ALL ON public.terminal_messages TO service_role;
ALTER TABLE public.terminal_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.terminal_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  terminal_id uuid NOT NULL REFERENCES public.terminals(id) ON DELETE CASCADE,
  uploader text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL DEFAULT 'application/octet-stream',
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX terminal_files_terminal_idx ON public.terminal_files (terminal_id, created_at);
GRANT ALL ON public.terminal_files TO service_role;
ALTER TABLE public.terminal_files ENABLE ROW LEVEL SECURITY;