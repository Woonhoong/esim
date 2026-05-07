CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS esim_packages (
  package_code VARCHAR(100) PRIMARY KEY,
  location_code VARCHAR(100),
  name VARCHAR(255),
  provider_price DECIMAL(10, 2),
  selling_price DECIMAL(10, 2),
  data_limit INT,
  validity_days INT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS esim_orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  order_no VARCHAR(100),
  package_code VARCHAR(100) REFERENCES esim_packages(package_code),
  status VARCHAR(50) DEFAULT 'PENDING',
  iccid VARCHAR(50),
  qr_code TEXT,
  smdp_address VARCHAR(255),
  activation_code VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  notify_id VARCHAR(100) UNIQUE NOT NULL,
  notify_type VARCHAR(50),
  order_no VARCHAR(100),
  payload JSONB,
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id SERIAL PRIMARY KEY,
  order_no VARCHAR(100),
  iccid VARCHAR(50),
  total_data BIGINT,
  used_data BIGINT,
  remaining_data BIGINT,
  usage_percentage DECIMAL(5, 2),
  status VARCHAR(50),
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricing_history (
  id SERIAL PRIMARY KEY,
  package_code VARCHAR(100) REFERENCES esim_packages(package_code),
  old_price DECIMAL(10, 2),
  new_price DECIMAL(10, 2),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
