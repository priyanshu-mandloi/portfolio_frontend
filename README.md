# 🚀 Personal Portfolio Website

A modern, full-stack portfolio website built with cutting-edge technologies, featuring 3D animations, internationalization, and a complete content management system.

## 🌟 Live Demo

[View Live Portfolio](https://pmportfolio-ecru.vercel.app/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Performance](#-performance)
- [Deployment](#-deployment)
- [Backend Repository](#-backend-repository)
- [Contact](#-contact)

## ✨ Features

### 🎨 Frontend Features
- **Modern UI/UX**: Built with Next.js 14 and Tailwind CSS
- **3D Animations**: Interactive 3D models using Three.js and React Three Fiber
- **Smooth Animations**: GSAP-powered animations throughout the site
- **Dark/Light Mode**: Seamless theme switching with custom transition animations
- **Internationalization**: Multi-language support for global accessibility
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **Custom Authentication**: Secure user authentication system
- **Blog System**: Complete blog platform with rich text editing
- **Admin Panel**: Dashboard for managing content and user responses

### 📝 Content Management
- **Rich Text Editor**: Integrated TipTap editor for content creation
- **Blog Interaction**: Users can read, like, comment, and share blog posts
- **Contact System**: Direct messaging system with admin notifications
- **Content Analytics**: Track user engagement and interactions

### 🔧 Backend Features
- **RESTful API**: Built with Node.js and Express.js
- **Database**: MongoDB Atlas with Prisma ORM
- **Authentication**: Secure JWT-based authentication
- **Content Management**: Full CRUD operations for all content types
- **Real-time Features**: Live updates for comments and interactions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: GSAP, Custom CSS Transitions
- **3D Graphics**: Three.js, React Three Fiber
- **Rich Text**: TipTap Editor
- **Internationalization**: Next.js i18n
- **State Management**: React Context/Hooks
- **Type Safety**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Multer


### Deployment & Tools
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Version Control**: Git, GitHub
- **Package Manager**: npm/yarn

## 📸 Screenshots

### Homepage with 3D Animation
<img width="1887" height="823" alt="image" src="https://github.com/user-attachments/assets/5beacf0c-54c9-48f0-9bff-c127a3bb6a21" />


### Dark/Light Mode Transition
<img width="1871" height="828" alt="image" src="https://github.com/user-attachments/assets/30c30005-e1dd-46dc-bb5d-fcea2566a8af" />

### Blog Section
<img width="1881" height="750" alt="image" src="https://github.com/user-attachments/assets/a0ca78c3-69b2-4540-afbe-313965789d6f" />


### Admin Panel
<img width="1823" height="187" alt="image" src="https://github.com/user-attachments/assets/1d6c6a51-8a29-4271-a91b-148fa7cbb1b2" />



### Mobile Responsiveness
![WhatsApp Image 2025-09-19 at 17 34 59_f18ddaa1](https://github.com/user-attachments/assets/7cbc0797-bb2b-44c3-96a6-2e23d9a96736)


### Internationalization
<img width="1877" height="816" alt="image" src="https://github.com/user-attachments/assets/afd966cf-97c2-4453-8d69-dcf5b867b211" />


## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-portfolio-frontend.git
   cd your-portfolio-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=your-backend-url
   NEXT_PUBLIC_SITE_URL=your-frontend-url
   JWT_SECRET=your-jwt-secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Custom Theme Transition Animation

The portfolio features a unique theme transition animation using CSS View Transitions:

```css
/* Transition Animation */
::view-transition-group(root) {
  animation-duration: 0.7s;
  animation-timing-function: linear(0 0%, 0.2342 12.49%, 0.4374 24.99%, 0.6093 37.49%, 0.6835 43.74%, 0.7499 49.99%, 0.8086 56.25%, 0.8593 62.5%, 0.9023 68.75%, 0.9375 75%, 0.9648 81.25%, 0.9844 87.5%, 0.9961 93.75%, 1 100%);
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23blur)"/></svg>') top left / 0 no-repeat;
  mask-origin: content-box;
  animation: scale 1s;
  transform-origin: top left;
}

::view-transition-old(root), .dark::view-transition-old(root) {
  animation: scale 1s;
  transform-origin: top left;
  z-index: -1;
}

@keyframes scale {
  to {
    mask-size: 350vmax;
  }
}
```

## 📊 Performance

### Vercel Speed Insights

The website achieves excellent performance scores across all metrics:

<img width="1679" height="688" alt="Speed Insight Screenshot" src="https://github.com/user-attachments/assets/f08f956b-26b1-48e7-b4ba-26731e68c4ed" />

**Key Performance Metrics:**
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimization Features
- ✅ Image optimization with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ SEO optimization with meta tags
- ✅ Progressive Web App (PWA) ready
- ✅ Efficient 3D model loading
- ✅ Optimized animations with GSAP

## 🎯 Key Achievements & Features

### About Me
### Coding Profiles
### Internship Experience
### Reward and Certificates
### Blogs

## 🌐 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
vercel --prod
```

### Backend (Render)
The backend is deployed on Render and connected to MongoDB Atlas.

## 📚 Learn More

### Blog Posts
I've written detailed blog posts about the technologies used in this project:

- **"Building with Prisma ORM"** - A comprehensive guide to using Prisma with MongoDB
- **"3D Web Development with Three.js"** - Creating interactive 3D experiences
- **"Next.js Internationalization"** - Implementing multi-language support

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 🔗 Backend Repository

```bash
https://github.com/priyanshu-mandloi/portfolio_backend
```

---

⭐ **Star this repository if you found it helpful!**

---
