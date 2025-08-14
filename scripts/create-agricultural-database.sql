-- Create database schema for KrishiGPT agricultural data
-- This script sets up tables for weather, market prices, schemes, and user interactions

-- Weather data table
CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    temperature DECIMAL(5,2),
    humidity INTEGER,
    rainfall DECIMAL(6,2),
    forecast TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(location, date)
);

-- Market prices table
CREATE TABLE IF NOT EXISTS market_prices (
    id SERIAL PRIMARY KEY,
    crop_name VARCHAR(50) NOT NULL,
    market_name VARCHAR(100) NOT NULL,
    price_per_quintal DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    trend VARCHAR(10) CHECK (trend IN ('up', 'down', 'stable')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(crop_name, market_name, date)
);

-- Government schemes table
CREATE TABLE IF NOT EXISTS government_schemes (
    id SERIAL PRIMARY KEY,
    scheme_code VARCHAR(20) UNIQUE NOT NULL,
    scheme_name VARCHAR(200) NOT NULL,
    description TEXT,
    eligibility_criteria TEXT,
    benefits TEXT,
    application_process TEXT,
    official_website VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop advisory table
CREATE TABLE IF NOT EXISTS crop_advisory (
    id SERIAL PRIMARY KEY,
    season VARCHAR(20) NOT NULL CHECK (season IN ('kharif', 'rabi', 'zaid')),
    crop_name VARCHAR(50) NOT NULL,
    region VARCHAR(100),
    advisory_text TEXT NOT NULL,
    fertilizer_recommendation TEXT,
    pest_management TEXT,
    irrigation_advice TEXT,
    valid_from DATE,
    valid_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User interactions table for feedback and analytics
CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    query_text TEXT NOT NULL,
    response_text TEXT,
    language VARCHAR(10),
    location VARCHAR(100),
    feedback VARCHAR(10) CHECK (feedback IN ('positive', 'negative', 'neutral')),
    confidence_score DECIMAL(3,2),
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weather_location_date ON weather_data(location, date);
CREATE INDEX IF NOT EXISTS idx_market_prices_crop_date ON market_prices(crop_name, date);
CREATE INDEX IF NOT EXISTS idx_crop_advisory_season_crop ON crop_advisory(season, crop_name);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at);
