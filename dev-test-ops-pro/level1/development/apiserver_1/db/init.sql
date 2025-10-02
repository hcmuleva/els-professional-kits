CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed demo user: email: hcm1@a.com, password: test123
INSERT INTO users (username, email, password_hash, role)
VALUES (
  'Demo Student',
  'hcm1@a.com',
  '$pbkdf2-sha256$600000$VJ4/8pQWQWf4sH3k1Va8eA$17c9m7Vv3CzGgGQkJ4a7w7It7D3m6sH0GmJpTQj1fAg', -- hash placeholder
  'student'
)
ON CONFLICT (email) DO NOTHING;
