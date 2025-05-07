-- Create database if not exists
-- Note: This is already created in your configuration as 'event_management_db'

-- Table structure for bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    guests INT NOT NULL,
    message TEXT,
    submission_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    submission_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    response TEXT,
    response_date DATETIME,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    subscription_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for portfolio items/events
CREATE TABLE IF NOT EXISTS portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE,
    image_path VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    event_type VARCHAR(50),
    testimonial_text TEXT NOT NULL,
    rating INT,
    display_order INT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for services
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    display_order INT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for team members
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    bio TEXT,
    image_path VARCHAR(255),
    display_order INT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample services
INSERT INTO services (name, description, icon, display_order, is_visible) VALUES
('Wedding Planning', 'Your perfect day deserves perfect planning. From intimate ceremonies to grand celebrations.', 'wedding', 1, TRUE),
('Party Planning', 'Let us handle your celebration while you focus on having fun with your guests.', 'party', 2, TRUE),
('Birthday Planning', 'Milestone celebrations that create lifelong memories for you and your loved ones.', 'birthday', 3, TRUE),
('Corporate Events', 'Impressive and professional corporate gatherings that achieve your business objectives.', 'corporate', 4, TRUE);

-- Insert sample team members
INSERT INTO team_members (name, position, bio, display_order, is_visible) VALUES
('Emily Richards', 'Founder & Lead Planner', 'Emily has over 10 years of experience in event planning and a passion for creating memorable experiences.', 1, TRUE),
('David Cohen', 'Creative Director', 'David brings artistic vision and innovative design to every event we plan.', 2, TRUE),
('Michelle Lee', 'Logistics Manager', 'Michelle ensures every detail is perfectly executed, from vendor coordination to day-of management.', 3, TRUE);
