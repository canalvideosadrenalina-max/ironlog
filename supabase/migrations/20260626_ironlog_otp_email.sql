ALTER TABLE ironlog_otp_codes ADD COLUMN IF NOT EXISTS email VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_ironlog_otp_email ON ironlog_otp_codes (email);
ALTER TABLE ironlog_otp_codes ALTER COLUMN phone DROP NOT NULL;
