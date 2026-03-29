-- stdmanager/src/main/resources/db/migration/V6__Init_Registration_Group_VI.sql

USE stdmanager_db
GO

-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS course_registrations;
GO

CREATE TABLE course_registrations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính 
    student_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng students 
    course_class_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng course_classes 
    registration_period_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng registration_periods 
    registration_type TINYINT NOT NULL, -- 1: Học mới; 2: Học lại; 3: Cải thiện 
    replaced_grade_id UNIQUEIDENTIFIER NULL, -- ID điểm cũ nếu học lại/cải thiện 
    registered_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm thực hiện đăng ký 
    status TINYINT DEFAULT 1, -- 1: Thành công; 2: Chờ thanh toán; 3: Đã hủy [cite: 22]
    is_paid BIT DEFAULT 0, -- Trạng thái thanh toán [cite: 22]
    row_version ROWVERSION, -- Xử lý tranh chấp dữ liệu (concurrency) [cite: 22]

    -- Các trường thông tin hệ thống [cite: 22]
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER
);


INSERT INTO course_registrations (student_id, course_class_id, registration_period_id, registration_type, status, is_paid)
VALUES 
(
    'B1111111-DDDD-1111-DDDD-111111111111', -- Đã sửa 'ST' thành 'B1'
    'E1111111-EEEE-1111-EEEE-111111111111', -- Đã sửa 'CL' thành 'E1'
    'A1111111-AAAA-1111-AAAA-111111111111', 
    1, 
    1, 
    1
),
(
    'B2222222-DDDD-2222-DDDD-222222222222', 
    'E2222222-EEEE-2222-EEEE-222222222222', 
    'A2222222-AAAA-2222-AAAA-222222222222', 
    2, 
    2, 
    0
);


-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS equivalent_courses;
GO


CREATE TABLE equivalent_courses (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính 
    original_course_id UNIQUEIDENTIFIER NOT NULL, -- FK môn cũ/gốc 
    equivalent_course_id UNIQUEIDENTIFIER NOT NULL, -- FK môn mới/thay thế 
    equivalence_type TINYINT NOT NULL, -- 1: Thay thế hoàn toàn; 2: Tương đương song song 
    effect_date DATE DEFAULT GETDATE(), -- Ngày bắt đầu áp dụng 
    note NVARCHAR(500), -- Lý do tương đương 
    
    -- Các trường thông tin hệ thống 
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,

    -- Ràng buộc tránh trùng lặp môn gốc và môn tương đương
    CONSTRAINT CHK_NotSameCourse CHECK (original_course_id <> equivalent_course_id)
);


INSERT INTO equivalent_courses (original_course_id, equivalent_course_id, equivalence_type, effect_date, note)
VALUES 
(
    'C1111111-CCCC-1111-CCCC-111111111111', 
    'C2222222-CCCC-2222-CCCC-222222222222', 
    1, 
    '2025-09-01', 
    N'Thay thế theo lộ trình đổi mới chương trình đào tạo 2025'
),
(
    'C3333333-CCCC-3333-CCCC-333333333333', 
    'C4444444-CCCC-4444-CCCC-444444444444', 
    2, 
    '2025-09-01', 
    N'Hai môn có nội dung tương đồng 90%'
);


-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS registration_periods;
GO

CREATE TABLE registration_periods (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính [cite: 16]
    name NVARCHAR(200) NOT NULL, -- Tên đợt đăng ký [cite: 16]
    semester_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng semesters [cite: 16]
    start_time DATETIME2 NOT NULL, -- Thời điểm bắt đầu [cite: 17]
    end_time DATETIME2 NOT NULL, -- Thời điểm kết thúc [cite: 17]
    target_config NVARCHAR(MAX), -- Cấu hình đối tượng dạng JSON (Khóa, Khoa...) [cite: 18]
    max_credits TINYINT DEFAULT 25, -- Số tín chỉ tối đa [cite: 18]
    min_credits TINYINT DEFAULT 12, -- Số tín chỉ tối thiểu [cite: 19]
    allow_retake BIT DEFAULT 1, -- Cho phép học lại/cải thiện [cite: 19]
    
    -- Các trường thông tin hệ thống [cite: 20]
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,

    -- Ràng buộc logic thời gian
    CONSTRAINT CHK_RegistrationTime CHECK (end_time > start_time)
);



INSERT INTO registration_periods (id, name, semester_id, start_time, end_time, target_config, max_credits, min_credits, allow_retake, is_active)
VALUES 
(
    CAST('A1111111-AAAA-1111-AAAA-111111111111' AS UNIQUEIDENTIFIER), 
    N'Đăng ký chính thức Học kỳ 2 - Năm học 2025-2026', 
    NEWID(), -- Sử dụng NEWID() để tránh lỗi nếu không có ID Semester thực tế
    '2026-01-05 08:00:00', 
    '2026-01-15 17:00:00', 
    N'{"khóa": ["K22", "K23", "K24"], "khoa": ["IT", "ECON"]}', 
    25, 12, 1, 1
),
(
    CAST('A2222222-AAAA-2222-AAAA-222222222222' AS UNIQUEIDENTIFIER), 
    N'Đợt bổ sung & Đăng ký học lại - Học kỳ 2', 
    NEWID(), 
    '2026-01-20 08:00:00', 
    '2026-01-25 17:00:00', 
    N'{"khóa": ["ALL"]}', 
    15, 0, 1, 1
);