-- Вставка пользователей (уже есть админ из миграции)
INSERT INTO users (username, password, name, role) VALUES
('test.user', 'testpass123', 'Тестовый Пользователь', 'tester'),
('project.manager', 'pm123456', 'Менеджер Проектов', 'manager'),
('qa.lead', 'qalead789', 'Ведущий Тестировщик', 'lead'),
('dev.user', 'devpass321', 'Разработчик Приложения', 'developer')
ON CONFLICT (username) DO NOTHING;

-- Вставка проектов
INSERT INTO projects (rodik_project_id, name, description, responsible_name, status, completion_date, is_archived) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Мобильное приложение "Банк Онлайн"', 'Разработка мобильного банкинга', 'Иванов Иван Иванович', 'active', '2024-12-31', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Веб-портал госуслуг', 'Обновление интерфейса портала', 'Петрова Мария Сергеевна', 'active', '2024-10-15', false),
('c2aebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Система аналитики', 'Сбор и визуализация метрик', 'Сидоров Алексей Петрович', 'completed', '2024-06-30', false),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Старый проект поддержки', 'Поддержка legacy системы', 'Козлова Анна Дмитриевна', 'on_hold', NULL, true);

-- Вставка требований
INSERT INTO requirements (id, name, description) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'FR-001', 'Пользователь должен иметь возможность авторизации по логину и паролю'),
('550e8400-e29b-41d4-a716-446655440000', 'FR-002', 'Система должна отправлять email-уведомления'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'NFR-001', 'Время отклика системы не более 2 секунд'),
('6ba7b811-9dad-11d1-80b4-00c04fd430c9', 'FR-003', 'Возможность экспорта отчетов в PDF'),
('6ba7b812-9dad-11d1-80b4-00c04fd430c0', 'SEC-001', 'Пароль должен соответствовать политике безопасности');

-- Вставка тестовых планов
INSERT INTO test_plans (project_id, name, description, goal, deadline) VALUES
(1, 'План тестирования авторизации', 'Полное тестирование модуля авторизации', 'Проверить все сценарии входа в систему', '2024-11-30'),
(1, 'Регрессионное тестирование v2.0', 'Тестирование после обновления', 'Убедиться в отсутствии регрессии', '2024-12-15'),
(2, 'Тестирование UI/UX', 'Проверка пользовательского интерфейса', 'Оценка удобства использования', '2024-09-20'),
(3, 'Нагрузочное тестирование', 'Тестирование под нагрузкой', 'Проверить стабильность при пиковых нагрузках', '2024-05-30');

-- Вставка тестовых наборов
INSERT INTO test_suites (name, description, project_id) VALUES
('Авторизация и безопасность', 'Тесты связанные с входом в систему и безопасностью', 1),
('Основной функционал', 'Базовые функции приложения', 1),
('Отчетность и аналитика', 'Генерация отчетов и аналитических данных', 2),
('Интеграционные тесты', 'Тесты взаимодействия с внешними системами', 3);

-- Вставка тест-кейсов
INSERT INTO test_cases (project_id, name, description, status, data) VALUES
-- Проект 1
(1, 'TC-001', 'Успешная авторизация с валидными данными', 'passed', '{"login": "testuser", "password": "Qwerty123!", "expected": "success"}'),
(1, 'TC-002', 'Авторизация с неверным паролем', 'failed', '{"login": "testuser", "password": "wrong", "expected": "invalid_credentials"}'),
(1, 'TC-003', 'Авторизация с пустыми полями', 'not_run', '{"login": "", "password": "", "expected": "validation_error"}'),
(1, 'TC-004', 'Восстановление пароля', 'passed', '{"email": "user@example.com", "expected": "recovery_email_sent"}'),
(1, 'TC-005', 'Смена пароля', 'blocked', '{"old_password": "OldPass123", "new_password": "NewPass456", "expected": "password_changed"}'),

-- Проект 2
(2, 'TC-101', 'Генерация PDF отчета', 'passed', '{"report_type": "monthly", "format": "pdf", "expected": "file_downloaded"}'),
(2, 'TC-102', 'Экспорт в Excel', 'passed', '{"report_type": "daily", "format": "excel", "expected": "file_downloaded"}'),
(2, 'TC-103', 'Фильтрация данных в отчете', 'not_run', '{"filters": ["date_range", "category"], "expected": "filtered_data"}'),

-- Проект 3
(3, 'TC-201', 'Нагрузка 100 пользователей', 'passed', '{"users_count": 100, "duration": "10m", "expected_rps": 50}'),
(3, 'TC-202', 'Нагрузка 1000 пользователей', 'failed', '{"users_count": 1000, "duration": "30m", "expected_rps": 200}');

-- Связь тест-кейсов с требованиями
INSERT INTO test_case_requirements (test_case_id, requirement_id) VALUES
(1, 'f47ac10b-58cc-4372-a567-0e02b2c3d479'), -- TC-001 -> FR-001
(1, '6ba7b812-9dad-11d1-80b4-00c04fd430c0'), -- TC-001 -> SEC-001
(2, 'f47ac10b-58cc-4372-a567-0e02b2c3d479'), -- TC-002 -> FR-001
(4, '550e8400-e29b-41d4-a716-446655440000'), -- TC-004 -> FR-002
(6, '6ba7b811-9dad-11d1-80b4-00c04fd430c9'), -- TC-101 -> FR-003
(9, '6ba7b810-9dad-11d1-80b4-00c04fd430c8'); -- TC-201 -> NFR-001

-- Связь тест-кейсов с тестовыми наборами
INSERT INTO test_case_suites (test_case_id, test_suite_id) VALUES
(1, 1), -- TC-001 -> Авторизация и безопасность
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(1, 2), -- TC-001 также в Основной функционал
(6, 3), -- TC-101 -> Отчетность и аналитика
(7, 3),
(8, 3),
(9, 4), -- TC-201 -> Интеграционные тесты
(10, 4);

-- Вставка тестовых отчетов
INSERT INTO test_reports (project_id, test_plan_id, test_suite_id, passed_percent, duration) VALUES
(1, 1, 1, 75, 3600),  -- 1 час выполнения
(1, 1, 2, 90, 1800),  -- 30 минут
(2, 3, 3, 100, 1200), -- 20 минут
(3, 4, 4, 50, 7200);  -- 2 часа