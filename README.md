# 🍽️ Restaurant Management System

A full-stack Restaurant Management System designed to simplify restaurant operations through digital ordering, table management, order tracking, kitchen coordination, and payment processing.

Built using **React.js, Java Spring Boot, and PostgreSQL**, the application provides dedicated interfaces for customers, waiters, kitchen staff, and cashiers, with real-time communication using WebSocket.

## 🚀 Key Features

### 👨‍🍳 Customer Module
- Browse available food items and categories.
- View restaurant menu.
- Place food orders.
- QR code-based table session management.
- Track order updates.
- Request the bill.
- View payment information.

### 🧑‍💼 Waiter Dashboard
- View customer orders.
- Manage order statuses.
- Monitor table sessions.
- Receive real-time order notifications.
- Manage customer service requests.

### 🍳 Kitchen Dashboard
- View incoming food orders.
- Accept and process orders.
- Update preparation status.
- Mark orders as ready.
- Receive real-time order notifications.

### 💰 Cashier Dashboard
- View pending bills.
- Generate payment records.
- Process cash payments.
- Record UPI transaction details.
- Monitor payment status.
- Manage session closure.

### ⚡ Real-Time Communication
- WebSocket integration using STOMP.
- Real-time order notifications.
- Live session updates.
- Payment notifications.
- Automatic dashboard updates.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Router
- STOMP.js

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Hibernate
- WebSocket

### Database
- PostgreSQL

### Development Tools
- Visual Studio Code
- IntelliJ IDEA
- Postman
- Git
- GitHub
- Maven
- npm

## 📁 Project Structure

```text
Restaurant-Management-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── restaurant-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── ...
│
├── .gitignore
└── README.md
```


## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the application:

- Java JDK 17 or compatible version required by your project.
- Node.js and npm.
- PostgreSQL.
- Maven.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/raja2742/restaurant-management-system.git
```

Navigate into the project:

```bash
cd restaurant-management-system
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your PostgreSQL database and application properties.

Example configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/restaurant_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Use your actual database and application configuration. Never commit passwords or secrets.

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend default address:

```text
http://localhost:8080
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend default address (Vite):

```text
http://localhost:5173
```

## 🔄 Application Workflow

1. Customer scans the QR code assigned to a restaurant table.
2. A table session is created or retrieved.
3. Customer browses the menu and places an order.
4. Kitchen staff receive the order in real time.
5. Kitchen staff update the preparation status.
6. Waiters monitor orders and serve customers.
7. Customer requests the bill.
8. Cashier processes the payment.
9. Payment is recorded and the session is closed.

## 🔌 Real-Time Architecture

The application uses WebSocket with STOMP for real-time communication between different dashboards.

| Destination | Purpose |
|---|---|
| `/topic/kitchen` | Kitchen order notifications |
| `/topic/waiter` | Waiter notifications |
| `/topic/cashier` | Cashier session notifications |
| `/topic/session/{sessionId}` | Customer order and session updates |
| `/topic/session/{sessionId}/payment` | Customer payment updates |

## 🔐 Security

- Backend API security using Spring Security.
- Role-based access control.
- Protected application endpoints.
- Database credentials and sensitive configuration should be maintained outside version control.

## 📸 Screenshots

Add screenshots of your application here.

Suggested screenshots:
- Customer Dashboard
- Menu Page
- Waiter Dashboard
- Kitchen Dashboard
- Cashier Dashboard
- Payment Page

Example:

```markdown
![Customer Dashboard](screenshots/customer-dashboard.png)
```

## 🔮 Future Enhancements

- Online payment gateway integration.
- Advanced sales and revenue analytics.
- Inventory management.
- Email and SMS notifications.
- Customer order history.
- Deployment to cloud infrastructure.

## 👨‍💻 Author

**Raja k**

B.Tech – Artificial Intelligence and Data Science

Interested in Java Full Stack Development and Software Engineering.

---

⭐ If you find this project interesting, consider giving this repository a star!
