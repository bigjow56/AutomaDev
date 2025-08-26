# AutomaDev - Business Automation Platform

## Overview

AutomaDev is a full-stack web application that serves as a landing page and contact platform for a business automation consultancy. The application showcases automation services, web development capabilities, and system integration solutions. It's built as a modern, responsive single-page application with a professional contact form system for lead generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using React with TypeScript, leveraging modern React patterns and hooks. The application uses a component-based architecture with the following key decisions:

- **React Router**: Uses Wouter for lightweight client-side routing
- **UI Framework**: Implements Shadcn/UI components built on Radix UI primitives for accessibility and consistency
- **Styling**: TailwindCSS with CSS custom properties for theming, supporting both light and dark modes
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form submissions
- **Animations**: Framer Motion for smooth page transitions and interactive elements

The frontend follows a modern component composition pattern with clear separation between UI components, business logic, and data fetching.

### Backend Architecture
The server-side is built with Express.js and TypeScript, following RESTful API design principles:

- **Runtime**: Node.js with ES modules for modern JavaScript features
- **Framework**: Express.js with middleware for request logging, JSON parsing, and error handling
- **Development Setup**: Vite integration for hot module replacement and development tooling
- **API Design**: RESTful endpoints with proper HTTP status codes and JSON responses
- **Error Handling**: Centralized error handling middleware with proper error propagation

The backend architecture prioritizes simplicity and maintainability while providing a solid foundation for future feature expansion.

### Data Storage
The application uses a hybrid storage approach designed for flexibility:

- **Development Storage**: In-memory storage implementation for rapid development and testing
- **Production Ready**: Drizzle ORM configured for PostgreSQL with proper schema definitions
- **Schema Management**: Shared TypeScript schema definitions between client and server using Drizzle-Zod
- **Database Migrations**: Drizzle Kit for schema migrations and database management

This approach allows for easy development while maintaining production scalability.

### Authentication and Authorization
Currently implements a basic contact form system without user authentication, focusing on lead capture and business inquiry management. The architecture supports future authentication implementation through the existing middleware pattern.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database configured through Drizzle ORM
- **PostgreSQL**: Primary database engine for production data storage

### UI and Design Libraries
- **Shadcn/UI**: Component library built on Radix UI primitives for accessible, customizable components
- **Radix UI**: Unstyled, accessible UI primitives for building design systems
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Modern icon library for consistent iconography

### Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility

### Runtime and Deployment
- **Replit Platform**: Development and hosting environment with specialized plugins for the Replit ecosystem
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework for API development

### Validation and Forms
- **Zod**: Schema validation library for runtime type checking
- **React Hook Form**: Performant forms library with minimal re-renders
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod for type-safe database schemas

The application is designed to be easily deployable on various platforms while maintaining development simplicity and production reliability.