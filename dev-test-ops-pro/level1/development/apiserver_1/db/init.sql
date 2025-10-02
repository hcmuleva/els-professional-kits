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
  'User1',
  'user1@emeelan.com',
  'scrypt:32768:8:1$Ie7j9y2W6QaBSGMf$9409a2c25af67f91edcdb50074b1454603ddd2e0a98e5683b0153b74818101fe857d01f49afbecec9c16a4ae43cd2721f93ecd93f3b396bba187c7639f1c3df8',
  'student'
)
ON CONFLICT (email) DO NOTHING;

