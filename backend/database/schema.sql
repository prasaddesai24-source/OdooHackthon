-- ExpensePro Database Schema
CREATE DATABASE IF NOT EXISTS expense_pro_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE expense_pro_db;

-- Companies Table: Stores the base info for each organization
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    country_code VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table: Admin, Manager, and Employee
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
    company_id INT NOT NULL,
    manager_id INT NULL,
    team VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Expenses Table: Expense claims
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    amount_in_base_currency DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    receipt_url TEXT,
    status ENUM('pending', 'approved', 'rejected', 'in_progress') NOT NULL DEFAULT 'pending',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Approval Rules Table: Strategy for approval (Percentage, Specific, Hybrid)
CREATE TABLE IF NOT EXISTS approval_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    type ENUM('percentage', 'specific', 'hybrid') NOT NULL,
    threshold_percentage INT DEFAULT 100,
    is_manager_approver BOOLEAN DEFAULT TRUE,
    config JSON NULL, -- Stores specific approver user IDs or roles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Approval Sequence/Steps: The actual list of steps
CREATE TABLE IF NOT EXISTS approval_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    step_number INT NOT NULL,
    approver_id INT NULL, -- Specific user if needed
    role_target ENUM('manager', 'finance', 'director') NULL, -- Role target if needed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Expense Approvals: Logs of who approved what at which step
CREATE TABLE IF NOT EXISTS expense_approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    approver_id INT NOT NULL,
    status ENUM('approved', 'rejected') NOT NULL,
    comment TEXT,
    step_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Constraints
-- Ensure unique sequence steps per company
CREATE UNIQUE INDEX idx_company_step ON approval_steps (company_id, step_number);

-- SEED DATA
-- Password for all: "password123" ($2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLMZ8NDjRbrKsPy)

INSERT INTO companies (name, base_currency, country_code) VALUES 
('Demo Corp', 'USD', 'US');

INSERT INTO users (name, email, password_hash, role, company_id, manager_id) VALUES 
('Admin User', 'admin@demo.com', '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLMZ8NDjRbrKsPy', 'admin', 1, NULL),
('Alice Manager', 'alice@demo.com', '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLMZ8NDjRbrKsPy', 'manager', 1, 1),
('Bob Employee', 'bob@demo.com', '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLMZ8NDjRbrKsPy', 'employee', 1, 2);

INSERT INTO approval_rules (company_id, type, threshold_percentage, is_manager_approver) VALUES 
(1, 'percentage', 60, true);

INSERT INTO approval_steps (company_id, step_number, approver_id, role_target) VALUES 
(1, 1, 2, 'manager');

INSERT INTO expenses (user_id, amount, currency, amount_in_base_currency, category, description, status, date) VALUES 
(3, 150.00, 'USD', 150.00, 'Travel', 'Flight to NY', 'pending', '2026-03-20'),
(3, 45.50, 'INR', 0.55, 'Meals', 'Lunch with client', 'approved', '2026-03-21');

