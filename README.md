# 🌿 Zenith Expense

**Zenith Expense** is a premium, automated expense reimbursement system designed for modern enterprises. Built during the **Odoo Hackathon**, it streamlines the process of submitting, tracking, and approving corporate expenses using cutting-edge OCR and AI-driven analysis.

![Zenith Logo](frontend/public/vite.svg)

## ✨ Key Features

- **📸 AI-Powered OCR Scanning**: Automatically extract merchant, date, and amount from receipt images using `Tesseract.js`.
- **🛡️ Multi-Level Approval Workflow**: Role-based access for Employees, Managers, and Admins.
- **📊 Real-time Dashboard**: Insights into spending habits, pending claims, and team processing stats.
- **👥 Team Management**: Easily group employees into departments and assign reporting managers.
- **💅 Premium "Mint Teal" UI**: A fresh, modern, and high-performance interface built with React and Vite.
- **🔒 Secure Authentication**: Robust JWT-based security with protected API routes.

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL with Sequelize ORM.
- **OCR Engine**: Tesseract.js.
- **Styling**: Vanilla CSS (Custom "Mint Teal & Light Yellow" Design System).

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MySQL Server

### 1. Database Setup
1. Create a database named `expense_pro_db`.
2. Import the schema found in `backend/database/schema.sql`.

### 2. Backend Configuration
1. Navigate to the `backend` folder.
2. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=expense_pro_db
   SECRET_KEY=your_jwt_secret_key
   ```
3. Run `npm install`.
4. Start the server with `npm start` or `node server.js`.

### 3. Frontend Configuration
1. Navigate to the `frontend` folder.
2. Run `npm install`.
3. Start the development server with `npm run dev`.

## 📸 Screenshots

| Dashboard | Team Management |
|-----------|-----------------|
| ![Dashboard](https://via.placeholder.com/400x250?text=Dashboard) | ![Users](https://via.placeholder.com/400x250?text=Team+Management) |

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

---
*Created with ❤️ for the Odoo Hackathon.*
