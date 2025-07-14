# Jessi Bradford Photography - Admin Dashboard

A comprehensive admin dashboard for managing photography business operations, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### 📊 Dashboard Overview
- **Real-time statistics** - View pending bookings, total portfolios, client galleries, and revenue
- **Recent activity** - Monitor latest bookings and quick actions
- **Quick access** - One-click actions for common tasks

### 📸 Portfolio Management
- **Add new portfolios** - Create new photography categories (Portraits, Couples, Families, etc.)
- **Upload photos** - Drag & drop interface for adding images to portfolios
- **Organize content** - Categorize and tag photos for easy management
- **Preview galleries** - See how portfolios look before publishing

### 📅 Booking Management
- **View all bookings** - See pending, confirmed, and cancelled appointments
- **Accept/Deny requests** - Approve or reject booking requests
- **Reschedule suggestions** - Propose alternative dates and times
- **Client communication** - Send messages and updates to clients
- **Calendar integration** - Visual calendar view of all appointments

### 👥 Client Gallery System
- **Private galleries** - Create password-protected galleries for clients
- **Secure access** - Clients can only view their own photos
- **Download options** - Control what clients can download
- **Gallery customization** - Branded galleries with your logo and colors

### ⚙️ Additional Features
- **Settings management** - Update business information and preferences
- **User authentication** - Secure login system
- **Responsive design** - Works on desktop, tablet, and mobile
- **Real-time updates** - Live notifications for new bookings

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to the admin directory:**
   ```bash
   cd admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the admin panel:**
   - Open your browser to `http://localhost:3000`
   - Login with demo credentials:
     - Username: `admin`
     - Password: `password`

### Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to your subdomain:**
   - Upload the `build` folder to your hosting provider
   - Configure your domain to point to `admin.yourdomain.com`
   - Set up SSL certificate for security

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the admin directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_SITE_URL=https://yourdomain.com
REACT_APP_ADMIN_EMAIL=admin@yourdomain.com
```

### Customization
- **Colors**: Update the Tailwind config to match your brand colors
- **Logo**: Replace the camera icon with your business logo
- **Domain**: Configure your hosting provider for the subdomain setup

## 📱 Usage Guide

### Managing Portfolios
1. Navigate to "Portfolio" in the sidebar
2. Click "Add New Portfolio" to create a category
3. Upload photos using the drag & drop interface
4. Organize photos with tags and descriptions
5. Preview and publish when ready

### Handling Bookings
1. Go to "Bookings" to see all appointment requests
2. Click on a booking to view details
3. Choose to Accept, Deny, or Suggest Alternative
4. Send messages to clients through the interface
5. Update booking status as needed

### Creating Client Galleries
1. Navigate to "Client Galleries"
2. Click "Create New Gallery"
3. Select photos and set access permissions
4. Generate a unique link for the client
5. Send the link to the client via email

## 🔒 Security Features

- **Authentication**: Secure login system with session management
- **Authorization**: Role-based access control
- **HTTPS**: SSL encryption for all communications
- **Input validation**: Sanitized inputs to prevent attacks
- **Rate limiting**: Protection against brute force attacks

## 🚀 Deployment Options

### Option 1: Subdomain (Recommended)
- Deploy to `admin.yourdomain.com`
- Separate from main site for better security
- Professional appearance

### Option 2: Same Domain
- Deploy to `yourdomain.com/admin`
- Simpler setup but less secure
- Shared hosting resources

### Option 3: Separate Hosting
- Deploy to a completely different domain
- Maximum security and isolation
- More complex setup

## 📞 Support

For technical support or feature requests, please contact:
- Email: admin@yourdomain.com
- Documentation: [Link to docs]
- GitHub Issues: [Repository link]

## 🔄 Updates

The admin dashboard will receive regular updates including:
- New features and improvements
- Security patches
- Performance optimizations
- Bug fixes

---

**Built with ❤️ for Jessi Bradford Photography** 