# ómorfo - Premium E-commerce Platform

A modern, full-featured e-commerce website for selling custom posters, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core E-commerce Features
- **Product Catalog** - Browse posters by category with filtering and sorting
- **Product Pages** - Detailed product views with zoom, size options, and framing
- **Shopping Cart** - Persistent cart with quantity management and size/frame options
- **Checkout Process** - Multi-step checkout with shipping and payment integration
- **User Authentication** - Sign up, login, password reset with NextAuth.js
- **Order Management** - Order history, tracking, and status updates
- **Wishlist** - Save favorite posters for later
- **Reviews & Ratings** - Customer feedback system

### User Experience
- **Responsive Design** - Mobile-first approach with touch-friendly interface
- **Search & Filtering** - Advanced search with autocomplete and filters
- **Image Gallery** - High-resolution product images with zoom functionality
- **Size Guide** - Interactive size comparison tool
- **Room Visualization** - Preview posters in different room settings
- **Newsletter Signup** - Email marketing integration

### Admin Features
- **Product Management** - Add, edit, delete posters with bulk operations
- **Order Management** - Process orders, update status, print labels
- **Customer Management** - View customer data and order history
- **Analytics Dashboard** - Sales reports, popular products, user behavior
- **Inventory Management** - Stock tracking and low stock alerts
- **Discount Codes** - Create and manage promotional campaigns

### Technical Features
- **SEO Optimized** - Meta tags, structured data, sitemap generation
- **Performance** - Image optimization, lazy loading, CDN integration
- **Security** - SSL certificates, secure payment processing, data encryption
- **Payment Integration** - Stripe, PayPal, Apple Pay, Google Pay
- **Shipping Integration** - Real-time shipping rates and label printing
- **Email Notifications** - Order confirmations, shipping updates, abandoned cart recovery

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **React Query** - Server state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication solution
- **Stripe** - Payment processing
- **Nodemailer** - Email sending

### Infrastructure
- **Vercel** - Hosting and deployment
- **Cloudinary** - Image storage and optimization
- **Google Analytics** - Website analytics
- **PostgreSQL** - Database hosting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account
- Google OAuth credentials

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/omorfo.git
   cd omorfo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users** - Customer accounts and authentication
- **Products** - Poster catalog with categories and variants
- **Orders** - Order management and tracking
- **Cart Items** - Shopping cart functionality
- **Reviews** - Customer feedback and ratings
- **Addresses** - Shipping and billing addresses
- **Newsletter** - Email subscription management

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📱 Mobile Optimization

The application is fully optimized for mobile devices with:
- Touch-friendly interface
- Responsive design
- Mobile payment options (Apple Pay, Google Pay)
- Optimized checkout flow
- Fast loading speeds

## 🔒 Security Features

- **SSL/TLS encryption** for all data transmission
- **Secure payment processing** with Stripe
- **User data encryption** at rest
- **CSRF protection** on all forms
- **Rate limiting** on API endpoints
- **Input validation** and sanitization
- **GDPR compliance** for data protection

## 📊 Analytics & SEO

- **Google Analytics** integration
- **SEO optimization** with meta tags and structured data
- **Sitemap generation** for search engines
- **Social media sharing** optimization
- **Performance monitoring** and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@omorfo.com or join our Slack channel.

## 🗺 Roadmap

- [ ] AR room visualization
- [ ] AI-powered product recommendations
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Social commerce features
- [ ] Subscription model for premium content

---

Built with ❤️ by the ómorfo team
