-- =====================================================
-- PRODUCTION DATABASE IMPORT
-- Copy all statements below and run them in your production database
-- =====================================================

-- STEP 1: Users (including admin and stylist accounts with passwords)
INSERT INTO users (id, replit_auth_id, username, password_hash, email, first_name, last_name, phone, role, stylist_id, provider) 
VALUES ('401950fd-455b-473d-9387-aab6edfe85ec', NULL, 'admin', '$2b$10$wZR0OF0HnU4tCx8ADlw0M..LhctHKO.Tu4UAnbjTFXj4qjsQjwXyC', 'admin@salon.com', 'Admin', 'User', NULL, 'admin', NULL, 'local');

INSERT INTO users (id, replit_auth_id, username, password_hash, email, first_name, last_name, phone, role, stylist_id, provider) 
VALUES ('9e9f5558-e1e5-48cf-a549-a0d80a410d99', NULL, 'emma', '$2b$10$Y7tzop2aBujzwPCSYzIRg.iWmevM9L4g2noCytMYOfKzEDwrgxRvi', 'emma@salon.com', 'Emma', 'Rodriguez', NULL, 'stylist', '2ad50aef-0970-47c3-bcbd-a6207a892bff', 'local');

INSERT INTO users (id, replit_auth_id, username, password_hash, email, first_name, last_name, phone, role, stylist_id, provider) 
VALUES ('cebfe12c-2e20-49b0-9108-4c69b4d5858e', NULL, 'sophia', '$2b$10$KGhyOKCLzcJBJeRpZiB1qe2VHlmqDoKQFOOZ45GMqmZsPM8BB6/sC', 'sophia@salon.com', 'Sophia', 'Chen', NULL, 'stylist', 'd3b4d006-6490-447d-be49-7a79ea49c975', 'local');

INSERT INTO users (id, replit_auth_id, username, password_hash, email, first_name, last_name, phone, role, stylist_id, provider) 
VALUES ('3b143cc9-0b48-40c6-a399-c03be94be596', NULL, 'isabella', '$2b$10$COQ1f6W0OA0a96FMe8Br0Ote8FZG1hDKgyZrWyhq5IxSFZrNIQ8/O', 'isabella@salon.com', 'Isabella', 'Martinez', NULL, 'stylist', 'ede1b989-9980-4485-a80c-4a308eb1a899', 'local');

-- STEP 2: Services
INSERT INTO services (id, name, description, category, duration, price, image) 
VALUES ('c200e8a9-7637-402f-8ba3-b64ad640420e', 'Classic Haircut', 'A timeless cut tailored to your face shape and personal style', 'Haircut', 45, 65, NULL);

INSERT INTO services (id, name, description, category, duration, price, image) 
VALUES ('74be2588-70d5-4731-a9d8-1f85c01e93b3', 'Color & Highlights', 'Full color service or expertly placed highlights for dimension', 'Color', 120, 150, NULL);

INSERT INTO services (id, name, description, category, duration, price, image) 
VALUES ('d2f9b6b5-803a-4c02-a44c-aa692aa35d10', 'Balayage', 'Hand-painted highlights for a natural, sun-kissed look', 'Color', 180, 200, NULL);

INSERT INTO services (id, name, description, category, duration, price, image) 
VALUES ('7fbc98a7-7695-4358-a8e9-82ac9cae5c36', 'Keratin Treatment', 'Smoothing treatment that reduces frizz and adds shine', 'Treatment', 150, 250, NULL);

INSERT INTO services (id, name, description, category, duration, price, image) 
VALUES ('0c200e24-35ca-47b0-8afe-56f63bb75566', 'Blowout & Style', 'Professional blowout for smooth, voluminous hair', 'Styling', 60, 55, NULL);

INSERT INTO services (id, name, description, category, duration, price, image) 
VALUES ('bfe883c4-4a5c-470d-b65a-620168141ecd', 'Bridal Updo', 'Elegant updo styling for your special day', 'Special', 90, 120, NULL);

-- STEP 3: Stylists
INSERT INTO stylists (id, name, bio, specialization, years_experience, rating, image) 
VALUES ('2ad50aef-0970-47c3-bcbd-a6207a892bff', 'Emma Rodriguez', 'Master stylist with a passion for creating personalized looks that enhance natural beauty', 'Color & Highlights', 8, 4.9, NULL);

INSERT INTO stylists (id, name, bio, specialization, years_experience, rating, image) 
VALUES ('d3b4d006-6490-447d-be49-7a79ea49c975', 'Sophia Chen', 'Precision cutting specialist known for modern, sophisticated styles', 'Precision Cuts', 6, 4.8, NULL);

INSERT INTO stylists (id, name, bio, specialization, years_experience, rating, image) 
VALUES ('ede1b989-9980-4485-a80c-4a308eb1a899', 'Isabella Martinez', 'Wedding and special event styling expert with an eye for elegant updos', 'Bridal & Events', 10, 5.0, NULL);

INSERT INTO stylists (id, name, bio, specialization, years_experience, rating, image) 
VALUES ('cbbf87a2-26ac-432f-aa93-b46568545557', 'Olivia Thompson', 'Texture and treatment specialist focusing on hair health', 'Treatments', 7, 4.7, NULL);

-- STEP 4: Schedules (Emma Rodriguez: Mon-Sat 9am-5pm)
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('e2e8ccdf-73d5-4b25-92a7-7e14df3b94a1', '2ad50aef-0970-47c3-bcbd-a6207a892bff', 1, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('83b2d2d8-fbb1-4e3e-a85d-40c5e3a54932', '2ad50aef-0970-47c3-bcbd-a6207a892bff', 2, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('e7dcf04a-e3bf-44f4-88b0-d58c754c7bba', '2ad50aef-0970-47c3-bcbd-a6207a892bff', 3, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('a66d4a4a-9ee7-4701-9e28-3fcb48b8fa50', '2ad50aef-0970-47c3-bcbd-a6207a892bff', 4, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('ba02f33b-c0e0-446a-aa99-f42f4eb4bfa5', '2ad50aef-0970-47c3-bcbd-a6207a892bff', 5, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('87db2c4a-e51f-4757-9c01-5d72c2e4a6e8', '2ad50aef-0970-47c3-bcbd-a6207a892bff', 6, '09:00', '17:00', TRUE);

-- Schedules (Sophia Chen: Mon-Sat 9am-7pm)
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('2a3b62f5-6afd-44d4-8f72-76dbb0e46f17', 'd3b4d006-6490-447d-be49-7a79ea49c975', 1, '09:00', '19:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('cd52ed26-38dd-4cfb-aa67-48f8ccc22e3a', 'd3b4d006-6490-447d-be49-7a79ea49c975', 2, '09:00', '19:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('bc8dc19f-e7a0-4dde-a042-6c13c2e6bdcc', 'd3b4d006-6490-447d-be49-7a79ea49c975', 3, '09:00', '19:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('e15e3c5d-cd1e-4e48-9d4c-00a94bec4d3c', 'd3b4d006-6490-447d-be49-7a79ea49c975', 4, '09:00', '19:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('4394e4b4-36c9-47e0-85b1-d1737eaa2ff5', 'd3b4d006-6490-447d-be49-7a79ea49c975', 5, '09:00', '19:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('6f3ad5c1-f088-4e93-b5d2-19e0e2dc10e2', 'd3b4d006-6490-447d-be49-7a79ea49c975', 6, '09:00', '19:00', TRUE);

-- Schedules (Isabella Martinez: Tue-Sat 10am-6pm)
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('30063f52-2f03-48bc-be58-3bfc4ea8ded8', 'ede1b989-9980-4485-a80c-4a308eb1a899', 2, '10:00', '18:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('6ede66e6-b11a-450e-82c9-1a22a7e03f5c', 'ede1b989-9980-4485-a80c-4a308eb1a899', 3, '10:00', '18:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('60a42d0f-c62e-4d3e-9d95-97c8c78acc54', 'ede1b989-9980-4485-a80c-4a308eb1a899', 4, '10:00', '18:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('99c46b15-6ad4-4286-8be1-af4cbc8ac65a', 'ede1b989-9980-4485-a80c-4a308eb1a899', 5, '10:00', '18:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('d2fbad36-5009-47fb-b654-18cdee04d9a7', 'ede1b989-9980-4485-a80c-4a308eb1a899', 6, '10:00', '18:00', TRUE);

-- Schedules (Olivia Thompson: Mon-Fri 9am-5pm)
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('f959ddbb-e9c9-4e8f-b789-fa9e66beba7c', 'cbbf87a2-26ac-432f-aa93-b46568545557', 1, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('d8e9a0d1-e81d-41fa-870e-a0d8d902f03e', 'cbbf87a2-26ac-432f-aa93-b46568545557', 2, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('23bf6e96-cb4f-4ba1-b5bd-abc5a41c7a37', 'cbbf87a2-26ac-432f-aa93-b46568545557', 3, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('75fdf2f0-1fa2-4917-8e57-6c45bf5d4c1f', 'cbbf87a2-26ac-432f-aa93-b46568545557', 4, '09:00', '17:00', TRUE);
INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES ('f96e8e5c-ce25-4e0e-895f-1dc90e78f4f3', 'cbbf87a2-26ac-432f-aa93-b46568545557', 5, '09:00', '17:00', TRUE);

-- STEP 5: Stylist-Service Relationships
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('12c0e7c6-09d1-4a31-8d86-a1bcd39ee7cc', '2ad50aef-0970-47c3-bcbd-a6207a892bff', '74be2588-70d5-4731-a9d8-1f85c01e93b3');
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('38e00d60-6973-40f8-91e1-ca926285a9c1', '2ad50aef-0970-47c3-bcbd-a6207a892bff', 'd2f9b6b5-803a-4c02-a44c-aa692aa35d10');
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('04f00caa-3f9c-453c-a8f0-27cf0a9a6da5', 'd3b4d006-6490-447d-be49-7a79ea49c975', 'd2f9b6b5-803a-4c02-a44c-aa692aa35d10');
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('0b5a3cd0-90ea-4904-9ba9-4aaeb2df3933', 'd3b4d006-6490-447d-be49-7a79ea49c975', 'c200e8a9-7637-402f-8ba3-b64ad640420e');
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('e6288e70-3990-401a-9f7f-a54676fd9972', 'd3b4d006-6490-447d-be49-7a79ea49c975', '0c200e24-35ca-47b0-8afe-56f63bb75566');
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('bed073c0-7c18-4299-9346-499a917ebb9b', 'ede1b989-9980-4485-a80c-4a308eb1a899', 'bfe883c4-4a5c-470d-b65a-620168141ecd');
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('2b4e1fae-c085-4dba-89e4-8c12701aafd2', 'ede1b989-9980-4485-a80c-4a308eb1a899', '0c200e24-35ca-47b0-8afe-56f63bb75566');
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('ec7b1e3c-7143-4fef-a878-93789c6e8be2', 'cbbf87a2-26ac-432f-aa93-b46568545557', '7fbc98a7-7695-4358-a8e9-82ac9cae5c36');
INSERT INTO stylist_services (id, stylist_id, service_id) VALUES ('7ae4b4d5-228f-4154-b1b6-8cc85a70ebf6', 'cbbf87a2-26ac-432f-aa93-b46568545557', '0c200e24-35ca-47b0-8afe-56f63bb75566');

-- =====================================================
-- IMPORT COMPLETE!
-- =====================================================
-- Your production database now has:
-- ✅ Admin account (username: admin, password: admin)
-- ✅ 3 Stylist accounts (emma/emma, sophia/sophia, isabella/isabella)  
-- ✅ 6 Services
-- ✅ 4 Stylists with profiles
-- ✅ 22 Schedule entries
-- ✅ 9 Stylist-service relationships
-- =====================================================
