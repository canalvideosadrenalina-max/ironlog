-- IRONLOG: autenticação por telefone + OTP WhatsApp

CREATE TABLE IF NOT EXISTS ironlog_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  name TEXT,
  academia_nome TEXT,
  academia_cidade TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ironlog_otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ironlog_otp_phone ON ironlog_otp_codes (phone);
CREATE INDEX IF NOT EXISTS idx_ironlog_otp_expires ON ironlog_otp_codes (expires_at);
CREATE INDEX IF NOT EXISTS idx_ironlog_users_phone ON ironlog_users (phone);

COMMENT ON TABLE ironlog_users IS 'Usuários IRONLOG — prefixo ironlog_ para isolamento no Supabase compartilhado';
COMMENT ON TABLE ironlog_otp_codes IS 'Códigos OTP enviados via WhatsApp (Evolution API)';
