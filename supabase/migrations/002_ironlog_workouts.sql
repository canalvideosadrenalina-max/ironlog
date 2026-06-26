-- IRONLOG: registros de treinos concluídos

CREATE TABLE IF NOT EXISTS ironlog_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES ironlog_users(id) ON DELETE SET NULL,
  ficha TEXT NOT NULL,
  data TIMESTAMPTZ NOT NULL DEFAULT now(),
  duracao INTEGER NOT NULL,
  exercicios JSONB NOT NULL,
  volume_total_kg NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ironlog_workouts_user_id ON ironlog_workouts (user_id);
CREATE INDEX IF NOT EXISTS idx_ironlog_workouts_data ON ironlog_workouts (data DESC);

COMMENT ON TABLE ironlog_workouts IS 'Treinos concluídos com séries, cargas e volume total';
