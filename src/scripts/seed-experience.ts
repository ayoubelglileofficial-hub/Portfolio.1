import connectDB from '../lib/mongodb';
import Experience from '../models/Experience';

const experiencesData = [
  {
    title: 'Help Desk Technician',
    company: 'Dieze Center',
    period: '01/2024 – 06/2024',
    description:
      'Provided first-line technical support for hardware and software issues. Managed ticketing system, resolved network incidents, and assisted with system deployments. Delivered training sessions for end-users on internal tools.',
    attestationUrl: '',
    align: 'left',
    order_index: 4,
    isVisible: true,
  },
  {
    title: 'Full Stack Development Training',
    company: 'ODC Training',
    period: '09/2023 – 12/2023',
    description:
      'Intensive training program focused on modern web development. Built full-stack applications using React, Node.js, and MongoDB. Collaborated on team projects using Agile methodology and Git workflows.',
    attestationUrl: '',
    align: 'right',
    order_index: 3,
    isVisible: true,
  },
  {
    title: 'Full Stack Developer — Final Year Project (PFE)',
    company: 'Ellendir',
    period: '02/2023 – 06/2023',
    description:
      'Designed and developed a complete web application as a graduation project. Built RESTful APIs with Node.js and Express, implemented an interactive frontend with React, and managed data with MongoDB. Presented the project to a jury and received distinction.',
    attestationUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    align: 'left',
    order_index: 2,
    isVisible: true,
  },
  {
    title: 'Junior Web Developer — Internship',
    company: 'Go Creative',
    period: '06/2022 – 09/2022',
    description:
      'Built responsive landing pages and client websites using HTML, CSS, JavaScript, and React. Collaborated with the design team to convert Figma mockups into pixel-perfect interfaces. Optimized website performance and SEO.',
    attestationUrl: '',
    align: 'right',
    order_index: 1,
    isVisible: true,
  },
];

async function seedExperience() {
  await connectDB();

  await Experience.deleteMany({});
  await Experience.insertMany(experiencesData);

  console.log(`Seeded ${experiencesData.length} experience entries successfully!`);
  process.exit(0);
}

seedExperience().catch(console.error);
