# SportX E-commerce Platform Documentation

## Project Overview

SportX is a full-featured e-commerce platform specializing in sports products with a modern React frontend and ASP.NET Core 8 backend. The platform supports user authentication, product browsing, cart management, checkout, order processing, admin functionalities, and more.

## System Architecture

* **Frontend**: React.js with Redux state management
* **Backend**: ASP.NET Core 8 Web API
* **Authentication**: Token-based authentication
* **State Management**: Redux for global state
* **Styling**: Chakra UI for consistent design

## Core Features

### 1. User Authentication & Management

* User registration and login
* Password recovery
* Profile management
* Address management

### 2. Product Catalog

* Browse all products
* Filter by category, price range, and brand
* Sort by price (high/low) and name
* Product details view with specifications
* Product ratings and reviews

### 3. Shopping Cart

* Add products to cart
* Update item quantities
* Remove items from cart
* Apply discount vouchers
* Calculate totals with discounts

### 4. Checkout & Payment

* Shipping information
* Order summary
* PayPal payment integration
* Order confirmation
* Invoice generation and download

### 5. Order Management

* View order history
* Track order status
* Download invoices
* Order details view

### 6. Review System

* Add reviews with ratings
* View product reviews
* Sort and filter reviews

### 7. Admin Dashboard

* Product management (CRUD)
* Category management
* User management
* Order management
* Review moderation
* Voucher management
* Analytics and reporting

### 8. Chat Support System

* User-admin communication
* Message history
* Real-time messaging

### 9. Voucher & Discount System

* Create and manage vouchers
* Apply vouchers at checkout
* Send vouchers to users via email

### 10. Contact & Support

* Contact form submission
* Support ticket management

## Project Structure

```
sportx_client/
├── public/                  # Static assets
│   ├── index.html           # HTML template
│   └── assets/              # Images, fonts, etc.
├── src/                     # Source code
│   ├── api/                 # API services
│   │   ├── axios.js         # Axios instance configuration
│   │   ├── userApi.js       # User-related API calls
│   │   └── cartApi.js       # Cart-related API calls
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   │   ├── Login.jsx    # Login form component
│   │   │   └── Register.jsx # Registration form component
│   │   └── AddToCartButton/ # Cart-related components
│   │       └── AddToCartButton.jsx # Button for adding items to cart
│   ├── Pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   │   ├── Login.jsx    # Login page
│   │   │   └── Register.jsx # Registration page
│   │   ├── Cart.jsx         # Shopping cart page
│   │   ├── ProductDis.jsx   # Product display page
│   │   └── admin/           # Admin-related pages
│   │       └── AdminLogin.jsx # Admin login page
│   ├── redux/               # State management
│   │   ├── store.js         # Redux store configuration
│   │   ├── slices/          # Redux Toolkit slices
│   │   │   ├── authSlice.js # Authentication state management
│   │   │   └── cartSlice.js # Shopping cart state management
│   │   └── AuthReducer/     # Legacy authentication reducer
│   │       ├── action.js    # Authentication actions
│   │       ├── actionType.js # Authentication action types
│   │       └── reducer.js   # Authentication reducer
│   ├── utils/               # Utility functions
│   │   └── localStorage.js  # Functions for managing localStorage
│   ├── App.jsx              # Main application component with routing
│   └── main.jsx             # Application entry point
├── package.json             # Project dependencies and scripts
└── vite.config.js           # Vite build tool configuration
```

## API Endpoint Documentation

### Authentication & User Management

| Endpoint | Method | Description            | Request             | Response                |
| ---------- | -------- | ------------------------ | --------------------- | ------------------------- |
| `/api/Users/register`         | POST   | Register new user      | User details        | Success/Error           |
| `/api/Users/login`         | POST   | User login             | Email, Password     | User details with token |
| `/api/Users/ForgotPassword`         | POST   | Request password reset | Email               | Success/Error           |
| `/api/Users/SetNewPassword`         | POST   | Set new password       | UserId, NewPassword | Success/Error           |
| `/api/Users/EditUserProfile/{id}`         | PUT    | Update user profile    | User details        | Updated user            |
| `/api/Users/showUserInfoByID/{id}`         | GET    | Get user information   | User ID             | User details            |

### Product Management

| Endpoint | Method | Description                 | Request       | Response            |
| ---------- | -------- | ----------------------------- | --------------- | --------------------- |
| `/api/Products/GetAllProducts`         | GET    | Get all products            | -             | Product list        |
| `/api/Products/GetProductByID/{id}`         | GET    | Get product details         | Product ID    | Product details     |
| `/api/Products/GetProductByCategoryID{id}`         | GET    | Filter by category          | Category ID   | Product list        |
| `/api/Products/GetBrandCount`         | GET    | Count products by brand     | -             | Brand counts        |
| `/api/Products/GetProductByBrand/{name}`         | GET    | Filter by brand             | Brand name    | Product list        |
| `/api/Products/FilterByPrice`         | GET    | Filter by price range       | Min/Max price | Product list        |
| `/api/Products/FilterByPriceHighToLow`         | GET    | Sort by price (high to low) | -             | Sorted product list |
| `/api/Products/FilterByPriceLowToHigh`         | GET    | Sort by price (low to high) | -             | Sorted product list |
| `/api/Products/FilterByName`         | GET    | Sort by name                | -             | Sorted product list |

### Shopping Cart

| Endpoint | Method | Description          | Request              | Response                        |
| ---------- | -------- | ---------------------- | ---------------------- | --------------------------------- |
| `/api/Cart/AddCartItem/{UserId}`         | POST   | Add item to cart     | CartItem details     | Success message                 |
| `/api/Cart/getUserCartItems/{UserId}`         | GET    | Get user's cart      | User ID              | Cart items with product details |
| `/api/Cart/deleteItemById/{cartItemId}`         | DELETE | Remove cart item     | CartItem ID          | Success/Error                   |
| `/api/Cart/changeQuantity`         | POST   | Update item quantity | CartItemId, Quantity | Updated cart                    |
| `/api/Cart/ApplyVoucher/{code}`         | GET    | Apply voucher        | Voucher code         | Discount details                |

### Order & Payment

| Endpoint | Method | Description        | Request          | Response                  |
| ---------- | -------- | -------------------- | ------------------ | --------------------------- |
| `/api/Order/CreateOrder/{id}`         | POST   | Create new order   | User ID          | Order details             |
| `/api/Payment/create-payment`         | POST   | Initialize payment | Payment details  | Payment URL               |
| `/api/Payment/execute-payment`         | GET    | Complete payment   | Payment/Payer ID | Order confirmation        |
| `/api/Payment/cancel-payment`         | GET    | Cancel payment     | -                | Cancellation confirmation |
| `/api/Order/download-order/{id}`         | GET    | Download order     | Order ID         | Order PDF                 |
| `/api/Order/InvoiceByOrderID/({id})`         | GET    | Get invoice        | Order ID         | Invoice details           |
| `/api/Order/GenerateInvoice`         | GET    | Generate invoice   | Order ID         | Invoice PDF               |

### Comments & Reviews

| Endpoint | Method | Description             | Request         | Response        |
| ---------- | -------- | ------------------------- | ----------------- | ----------------- |
| `/api/Comments/GetComments/{productId}`         | GET    | Get product comments    | Product ID      | Comments list   |
| `/api/Comments/AddComment`         | POST   | Add new comment         | Comment details | Success/Error   |
| `/api/AdminControllers/Commint`         | GET    | Admin: Get all comments | -               | All comments    |
| `/api/AdminControllers/UpdatateStatusComment/{id}`         | PUT    | Update comment status   | Comment ID      | Updated comment |
| `/api/AdminControllers/DeleteComment{id}`         | DELETE | Delete comment          | Comment ID      | Success/Error   |

### Categories

| Endpoint | Method | Description           | Request          | Response         |
| ---------- | -------- | ----------------------- | ------------------ | ------------------ |
| `/api/Category/GetAllCategory`         | GET    | Get all categories    | -                | Category list    |
| `/api/AdminControllers/Category`         | GET    | Admin: Get categories | -                | Category list    |
| `/api/AdminControllers/Category`         | POST   | Create category       | Category details | New category     |
| `/api/AdminControllers/Category`         | PUT    | Update category       | Category details | Updated category |
| `/api/AdminControllers/Category`         | DELETE | Delete category       | Category ID      | Success/Error    |

### Chat System

| Endpoint | Method | Description          | Request         | Response        |
| ---------- | -------- | ---------------------- | ----------------- | ----------------- |
| `/api/user/Chat/AllUsers`         | GET    | User: Get all users  | -               | User list       |
| `/api/user/Chat/showMessage/{userId}`         | GET    | User: Get messages   | User ID         | Message history |
| `/api/user/Chat/replayMessage/{userId}`         | POST   | User: Send message   | Message details | Success/Error   |
| `/api/admin/Chat/AllUsers`         | GET    | Admin: Get all users | -               | User list       |
| `/api/admin/Chat/showMessage/{userId}`         | GET    | Admin: Get messages  | User ID         | Message history |
| `/api/admin/Chat/replayMessage/{userId}`         | POST   | Admin: Send message  | Message details | Success/Error   |

### Vouchers

| Endpoint | Method | Description      | Request          | Response         |
| ---------- | -------- | ------------------ | ------------------ | ------------------ |
| `/api/Voucher/GetVoucher`         | GET    | Get all vouchers | -                | Voucher list     |
| `/api/Voucher/AddVoucheraa`         | POST   | Add new voucher  | Voucher details  | New voucher      |
| `/api/Voucher/UpdateVoucher/{id}`         | PUT    | Update voucher   | Voucher details  | Updated voucher  |
| `/api/Voucher/{id}`         | DELETE | Delete voucher   | Voucher ID       | Success/Error    |
| `/api/Voucher/ApplyVoucher`         | GET    | Check voucher    | Voucher code     | Discount details |
| `/api/Voucher/send-voucher/{userEmail}`         | POST   | Send voucher     | User email, code | Success/Error    |

### Contact

| Endpoint | Method | Description         | Request         | Response      |
| ---------- | -------- | --------------------- | ----------------- | --------------- |
| `/api/Contact`         | POST   | Submit contact form | Contact details | Success/Error |
| `/api/AdminControllers/Contact`         | GET    | Admin: Get contacts | -               | Contact list  |

## Implementation Guidelines

### State Management Structure

1. **Auth State**
   * currentUser
   * isLoggedIn
   * isAdmin
   * token
   * loading/error states

2. **Product State**
   * products list
   * current product
   * filters/sorting
   * categories
   * brands
   * loading/error states

3. **Cart State**
   * cart items
   * totals
   * applied voucher
   * loading/error states

4. **Order State**
   * orders list
   * current order
   * order status
   * loading/error states

5. **UI State**
   * notifications
   * modals
   * sidebar states
   * loading indicators

## Key Implementation Details

### Authentication Flow

1. **Registration**:
   - User fills registration form
   - Form data is validated
   - API call to `/api/Users/register` with multipart/form-data
   - On success, redirect to login page

2. **Login**:
   - User enters credentials
   - API call to `/api/Users/login` with multipart/form-data
   - On success, store token and user ID in localStorage
   - Update Redux state with user information
   - Redirect to home page

3. **Password Recovery**:
   - User enters email
   - API call to `/api/Users/ForgotPassword`
   - User receives reset link via email
   - User sets new password via `/api/Users/SetNewPassword`

### Cart Management

1. **Adding Items**:
   - User clicks "Add to Cart" button
   - API call to `/api/Cart/AddCartItem/{UserId}`
   - Update cart state in Redux
   - Show success notification

2. **Updating Quantities**:
   - User changes quantity in cart
   - API call to `/api/Cart/changeQuantity`
   - Update cart state in Redux
   - Recalculate totals

3. **Applying Vouchers**:
   - User enters voucher code
   - API call to `/api/Cart/ApplyVoucher/{code}`
   - Update cart state with discount
   - Recalculate totals

### Best Practices

1. **API Integration**:
   - Use axios for API calls
   - Set up interceptors for token handling
   - Use FormData for multipart/form-data requests
   - Implement proper error handling

2. **Form Validation**:
   - Use react-hook-form for form handling
   - Implement client-side validation
   - Show clear error messages
   - Handle server-side validation errors

3. **State Management**:
   - Use Redux Toolkit for state management
   - Implement async thunks for API calls
   - Use selectors for accessing state
   - Keep state normalized

4. **UI/UX**:
   - Use Chakra UI for consistent design
   - Implement loading states
   - Show clear error messages
   - Provide user feedback for actions

5. **Security**:
   - Store tokens securely
   - Implement proper authentication checks
   - Sanitize user inputs
   - Handle token expiration

This documentation provides a comprehensive overview of the SportX e-commerce platform, detailing the project structure, API endpoints, and implementation guidelines. It serves as a reference for developers working on the project and helps ensure consistent implementation across the codebase.
