import connectDB from '../lib/mongodb';
import Project from '../models/Project';
import type { IProject } from '../models/Project';

const projectsData = [
  {
    name: 'menulik',
    title: 'MenuLik — Menu Management App',
    photo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    description:
      'A full-stack menu management platform for restaurants. Features real-time menu updates, QR code generation, multi-language support, and an admin dashboard with analytics.',
    languages: ['react', 'typescript', 'nextjs', 'mongodb', 'tailwind'],
    demoLink: 'https://menulik-demo.vercel.app',
    githubLink: 'https://github.com/yourusername/menulik',
    order_index: 1,
    is_featured: true,
  },
  {
    name: 'portfolio',
    title: 'Personal Portfolio',
    photo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    description:
      'Modern developer portfolio built with Next.js 16, featuring a dynamic skill grid, project showcase, admin CMS, and animated canvas background.',
    languages: ['nextjs', 'typescript', 'mongodb', 'tailwind', 'framer-motion'],
    demoLink: 'https://portfolio-demo.vercel.app',
    githubLink: 'https://github.com/yourusername/portfolio',
    order_index: 2,
    is_featured: true,
  },
  {
    name: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    description:
      'A scalable e-commerce solution with product management, shopping cart, Stripe payments, order tracking, and an admin dashboard for inventory management.',
    languages: ['react', 'nodejs', 'postgresql', 'stripe', 'redis'],
    demoLink: 'https://ecommerce-demo.vercel.app',
    githubLink: 'https://github.com/yourusername/ecommerce-platform',
    order_index: 3,
    is_featured: false,
  },
];

async function seedProjects() {
  await connectDB();

  // Clear existing projects and reseed
  await Project.deleteMany({});
  await Project.insertMany(projectsData as unknown as IProject[]);

  console.log(`Seeded ${projectsData.length} projects successfully!`);
  process.exit(0);
}

seedProjects().catch(console.error);
