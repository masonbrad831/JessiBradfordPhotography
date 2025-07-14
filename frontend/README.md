# Jessi Bradford Photography - Frontend

A modern, responsive photography website built with React, TypeScript, and Tailwind CSS featuring a beautiful farmhouse aesthetic.

## Features

- **Modern Design**: Clean, farmhouse-inspired design with sage and cream color palette
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Calendar**: Custom booking calendar with availability display
- **Portfolio Gallery**: Filterable photo gallery with lightbox functionality
- **Client Portal**: Password-protected client galleries for photo downloads
- **Contact Forms**: Professional contact and booking forms
- **Reviews System**: Client testimonials and ratings display
- **Smooth Animations**: Framer Motion animations for enhanced UX

## Pages

- **Home**: Hero section, featured work, and call-to-action
- **Portfolio**: Photo gallery with category filtering
- **About**: Jessi's story and photography philosophy
- **Services**: Pricing packages and service details
- **Booking**: Interactive calendar and session booking form
- **Contact**: Contact form and business information
- **Client Gallery**: Password-protected client photo galleries
- **Reviews**: Client testimonials and ratings

## Tech Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icon library
- **React Router**: Client-side routing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── BookingCalendar.tsx
├── pages/
│   ├── Home.tsx
│   ├── Portfolio.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Booking.tsx
│   ├── Contact.tsx
│   ├── ClientGallery.tsx
│   └── Reviews.tsx
├── types/
│   └── index.ts
├── App.tsx
├── index.tsx
└── index.css
```

## Customization

### Colors

The site uses a custom color palette defined in `tailwind.config.js`:

- **Sage**: Primary brand color (#5a715a)
- **Farmhouse**: Warm accent color (#c9b17e)
- **Cream**: Background and neutral color (#fdfcf9)

### Fonts

- **Playfair Display**: Serif font for headings
- **Inter**: Sans-serif font for body text
- **Dancing Script**: Cursive font for accents

## Backend Integration

This frontend is designed to work with a backend API. Key integration points:

- **Booking Calendar**: Replace mock availability data with API calls
- **Contact Forms**: Connect form submissions to backend endpoints
- **Client Galleries**: Integrate with authentication and file storage
- **Portfolio**: Connect to image management system
- **Reviews**: Integrate with review management system

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deployment Options

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload build files to S3 bucket
- **Traditional Hosting**: Upload build files to web server

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Implement responsive design for all new features
4. Add appropriate animations using Framer Motion
5. Test on multiple devices and browsers

## License

This project is private and proprietary to Jessi Bradford Photography.

## Support

For technical support or questions about the website, contact the development team. 