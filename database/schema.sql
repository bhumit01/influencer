-- InfluenceHub Database Schema
-- MySQL 8.0+ / MariaDB 10.3+

CREATE DATABASE IF NOT EXISTS influencehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE influencehub;

-- Users table (shared for Brand, Influencer, Admin)
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('brand', 'influencer', 'admin') NOT NULL DEFAULT 'influencer',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Password reset tokens
CREATE TABLE password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Brand profiles
CREATE TABLE brand_profiles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    logo VARCHAR(255) NULL,
    description TEXT NULL,
    location VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Categories
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    icon VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Influencer profiles
CREATE TABLE influencer_profiles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL UNIQUE,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    bio TEXT NULL,
    profile_photo VARCHAR(255) NULL,
    cover_photo VARCHAR(255) NULL,
    country VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    languages JSON NULL,
    followers BIGINT UNSIGNED DEFAULT 0,
    engagement_rate DECIMAL(5,2) NULL,
    pricing_min DECIMAL(12,2) NULL,
    pricing_max DECIMAL(12,2) NULL,
    pricing_currency VARCHAR(3) DEFAULT 'USD',
    availability ENUM('available', 'busy', 'unavailable') DEFAULT 'available',
    experience_years TINYINT UNSIGNED NULL,
    accepts_barter TINYINT(1) DEFAULT 0,
    barter_description TEXT NULL,
    contact_email VARCHAR(255) NULL,
    contact_phone VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Influencer categories (many-to-many)
CREATE TABLE influencer_categories (
    influencer_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (influencer_id, category_id),
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Social media links
CREATE TABLE social_links (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    influencer_id INT UNSIGNED NOT NULL,
    platform ENUM('instagram', 'youtube', 'tiktok', 'linkedin', 'twitter', 'facebook', 'website', 'other') NOT NULL,
    url VARCHAR(500) NOT NULL,
    handle VARCHAR(255) NULL,
    followers BIGINT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    INDEX idx_platform (platform)
) ENGINE=InnoDB;

-- Gallery items
CREATE TABLE gallery_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    influencer_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(255) NULL,
    description TEXT NULL,
    sort_order INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- Past collaborations
CREATE TABLE past_collaborations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    influencer_id INT UNSIGNED NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Enquiries (Brand -> Influencer, goes to Admin)
CREATE TABLE enquiries (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    brand_id INT UNSIGNED NULL,
    influencer_id INT UNSIGNED NOT NULL,
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    budget_range VARCHAR(100) NULL,
    campaign_details TEXT NULL,
    contact_name VARCHAR(255) NULL,
    contact_email VARCHAR(255) NULL,
    status ENUM('pending', 'read', 'replied', 'closed') NOT NULL DEFAULT 'pending',
    admin_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Contact form submissions
CREATE TABLE contact_submissions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Fashion & Beauty', 'fashion-beauty', 'Fashion, style, makeup, and beauty influencers'),
('Travel & Lifestyle', 'travel-lifestyle', 'Travel vloggers, lifestyle content creators'),
('Food & Cooking', 'food-cooking', 'Chefs, food bloggers, cooking enthusiasts'),
('Fitness & Health', 'fitness-health', 'Fitness trainers, wellness coaches, health advocates'),
('Tech & Gaming', 'tech-gaming', 'Tech reviewers, gamers, software developers'),
('Music & Entertainment', 'music-entertainment', 'Musicians, comedians, entertainers'),
('Business & Finance', 'business-finance', 'Entrepreneurs, investors, financial advisors'),
('Education & Science', 'education-science', 'Teachers, scientists, educational content'),
('Sports & Outdoors', 'sports-outdoors', 'Athletes, outdoor adventurers, sports coaches'),
('Photography & Art', 'photography-art', 'Photographers, digital artists, illustrators');

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, role, status) VALUES
('admin@influencehub.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active');
