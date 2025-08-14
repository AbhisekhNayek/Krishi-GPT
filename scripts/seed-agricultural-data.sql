-- Seed data for KrishiGPT agricultural database
-- This script populates the database with sample data

-- Insert weather data
INSERT INTO weather_data (location, date, temperature, humidity, rainfall, forecast) VALUES
('Bareilly, UP', CURRENT_DATE, 28.5, 65, 12.0, 'Light rain expected tomorrow'),
('Nagpur, Maharashtra', CURRENT_DATE, 32.0, 58, 8.0, 'Clear skies for next 3 days'),
('Kolkata, West Bengal', CURRENT_DATE, 30.0, 78, 25.0, 'Heavy rain expected in 2 days'),
('Ludhiana, Punjab', CURRENT_DATE, 26.0, 70, 5.0, 'Partly cloudy with light winds'),
('Coimbatore, Tamil Nadu', CURRENT_DATE, 29.0, 72, 15.0, 'Scattered showers possible')
ON CONFLICT (location, date) DO NOTHING;

-- Insert market prices
INSERT INTO market_prices (crop_name, market_name, price_per_quintal, date, trend) VALUES
('Wheat', 'Bareilly Mandi', 2150.00, CURRENT_DATE, 'up'),
('Rice', 'Bareilly Mandi', 1850.00, CURRENT_DATE, 'stable'),
('Soybean', 'Nagpur Mandi', 4200.00, CURRENT_DATE, 'down'),
('Cotton', 'Nagpur Mandi', 5800.00, CURRENT_DATE, 'up'),
('Sugarcane', 'Kolhapur Mandi', 280.00, CURRENT_DATE, 'stable'),
('Maize', 'Ludhiana Mandi', 1650.00, CURRENT_DATE, 'up'),
('Mustard', 'Jaipur Mandi', 4500.00, CURRENT_DATE, 'down'),
('Gram', 'Indore Mandi', 4800.00, CURRENT_DATE, 'stable')
ON CONFLICT (crop_name, market_name, date) DO NOTHING;

-- Insert government schemes
INSERT INTO government_schemes (scheme_code, scheme_name, description, eligibility_criteria, benefits, application_process, official_website) VALUES
('PM-KISAN', 'Pradhan Mantri Kisan Samman Nidhi', 'Direct income support scheme for farmers', 'All landholding farmers families', '₹6000 per year in 3 equal installments', 'Online registration at pmkisan.gov.in or through CSC', 'https://pmkisan.gov.in'),
('PMKSY', 'Pradhan Mantri Krishi Sinchayee Yojana', 'Irrigation support and water conservation scheme', 'All farmers', 'Up to 55% subsidy on drip irrigation systems', 'Apply through state agriculture department', 'https://pmksy.gov.in'),
('PMFBY', 'Pradhan Mantri Fasal Bima Yojana', 'Crop insurance scheme', 'All farmers growing notified crops', 'Insurance coverage against crop loss', 'Through banks, CSCs, or insurance companies', 'https://pmfby.gov.in'),
('KCC', 'Kisan Credit Card', 'Credit support for agricultural activities', 'All farmers including tenant farmers', 'Credit limit based on land holding and cropping pattern', 'Apply at any bank branch', 'https://www.nabard.org'),
('SOIL-HEALTH', 'Soil Health Card Scheme', 'Soil testing and health monitoring', 'All farmers', 'Free soil testing and nutrient recommendations', 'Through state agriculture departments', 'https://soilhealth.dac.gov.in')
ON CONFLICT (scheme_code) DO NOTHING;

-- Insert crop advisory data
INSERT INTO crop_advisory (season, crop_name, region, advisory_text, fertilizer_recommendation, pest_management, irrigation_advice, valid_from, valid_to) VALUES
('kharif', 'Rice', 'All India', 'Transplant 25-30 day old seedlings with proper spacing', 'Apply NPK 120:60:40 kg/ha. Split nitrogen application', 'Monitor for stem borer and leaf folder. Use pheromone traps', 'Maintain 2-3 cm water level during vegetative stage', '2024-06-01', '2024-10-31'),
('kharif', 'Cotton', 'Central India', 'Sow cotton seeds with proper seed treatment', 'Apply NPK 120:60:60 kg/ha with micronutrients', 'Regular monitoring for bollworm. Use IPM practices', 'Critical irrigation at flowering and boll development', '2024-06-01', '2024-10-31'),
('kharif', 'Soybean', 'Central India', 'Sow soybean with rhizobium seed treatment', 'Apply NPK 20:60:40 kg/ha. Avoid excess nitrogen', 'Monitor for pod borer and defoliators', 'Irrigation at flowering and pod filling stages', '2024-06-01', '2024-10-31'),
('rabi', 'Wheat', 'North India', 'Sow wheat in November for optimal yield', 'Apply NPK 120:60:40 kg/ha. Top dress nitrogen', 'Monitor for aphids and rust diseases', 'Irrigation at crown root initiation and grain filling', '2024-11-01', '2025-04-30'),
('rabi', 'Mustard', 'North India', 'Sow mustard seeds with proper spacing', 'Apply NPK 80:40:40 kg/ha with sulfur', 'Monitor for aphids and white rust', 'Light irrigation at branching and siliqua formation', '2024-11-01', '2025-04-30'),
('rabi', 'Gram', 'Central India', 'Sow gram with seed treatment for wilt resistance', 'Apply NPK 20:40:20 kg/ha with rhizobium', 'Monitor for pod borer and wilt disease', 'Avoid irrigation during flowering', '2024-11-01', '2025-04-30')
ON CONFLICT DO NOTHING;

-- Insert sample user interactions for analytics
INSERT INTO user_interactions (session_id, query_text, response_text, language, location, feedback, confidence_score, response_time_ms) VALUES
('session_001', 'Kal baarish hogi kya?', 'Weather forecast shows light rain expected tomorrow in your area.', 'hi-en', 'Bareilly, UP', 'positive', 0.95, 1200),
('session_002', 'Wheat ka rate kya hai?', 'Current wheat price is ₹2150 per quintal at Bareilly Mandi with upward trend.', 'hi-en', 'Bareilly, UP', 'positive', 0.92, 800),
('session_003', 'PM-KISAN scheme kaise apply kare?', 'You can apply for PM-KISAN online at pmkisan.gov.in or visit your nearest CSC.', 'hi-en', 'Nagpur, Maharashtra', 'positive', 0.98, 1500)
ON CONFLICT DO NOTHING;
