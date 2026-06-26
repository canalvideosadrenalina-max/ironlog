CREATE TABLE IF NOT EXISTS ironlog_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  academia_nome VARCHAR(100),
  academia_cidade VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ironlog_otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ironlog_workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES ironlog_users(id),
  ficha VARCHAR(1) NOT NULL,
  data DATE DEFAULT CURRENT_DATE,
  duracao_minutos INTEGER,
  volume_total_kg DECIMAL,
  exercicios JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
