💰 Expense Tracker

Ứng dụng quản lý chi tiêu cá nhân được xây dựng nhằm thực hành phát triển hệ thống Fullstack với NestJS và React.

🚀 Tech Stack
Backend

NestJS

TypeScript

PostgreSQL

Docker

Frontend

ReactJS

TypeScript

Tools

pgAdmin 4

Git (Feature branch workflow)

📌 Features

Tạo, cập nhật, xóa khoản chi tiêu

Lấy danh sách chi tiêu

Phân quyền User / Admin

Hiển thị thống kê dữ liệu (biểu đồ ở trang Admin)

🏗 Project Structure
expense_tracker/
│
├── backend/    # NestJS REST API
├── frontend/   # ReactJS Client

Backend và frontend được tách riêng để đảm bảo tính mở rộng và dễ bảo trì.

⚙️ Installation & Run
1. Clone repository
git clone https://github.com/NhanPhan04/expense_tracker.git
cd expense_tracker
2. Run Backend
cd backend
npm install
npm run start:dev

Hoặc chạy bằng Docker:

docker-compose up --build
3. Run Frontend
cd frontend
npm install
npm start
🗄 Database

Sử dụng PostgreSQL

Quản lý bằng pgAdmin 4

Cấu hình qua file .env

🎯 Project Purpose

Thực hành xây dựng RESTful API với NestJS

Làm việc với PostgreSQL và Docker

Áp dụng kiến thức TypeScript trong dự án thực tế

Rèn luyện quy trình làm việc với Git (branch, merge, pull request)

👤 Author

Phan Thanh Nhân
Software Engineering Student – HUFLIT
GitHub: https://github.com/NhanPhan04

