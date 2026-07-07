import connectDB from '../lib/mongodb';
import Certification from '../models/Certification';

const certificationsData = [
  {
    title: 'Docker & Kubernetes',
    organization: 'Coursera',
    period: '2024',
    description:
      'Comprehensive training on containerization with Docker and orchestration with Kubernetes. Covers image creation, container networking, pod management, and cluster deployment.',
    skills: ['docker', 'kubernetes'],
    attestationUrl: '',
    order_index: 3,
    isVisible: true,
  },
  {
    title: 'Python Programming',
    organization: 'Udemy',
    period: '2023',
    description:
      'In-depth Python programming course covering OOP, data structures, algorithms, and building real-world applications with popular frameworks.',
    skills: ['python'],
    attestationUrl: '',
    order_index: 2,
    isVisible: true,
  },
  {
    title: 'DevOps Fundamentals',
    organization: 'LinkedIn Learning',
    period: '2024',
    description:
      'Introduction to DevOps culture, CI/CD pipelines, infrastructure as code, and monitoring. Hands-on experience with industry-standard DevOps tools.',
    skills: ['docker', 'kubernetes', 'ci-cd', 'terraform'],
    attestationUrl: '',
    order_index: 1,
    isVisible: true,
  },
];

async function seedCertification() {
  await connectDB();

  await Certification.deleteMany({});
  await Certification.insertMany(certificationsData);

  console.log(`Seeded ${certificationsData.length} certification entries successfully!`);
  process.exit(0);
}

seedCertification().catch(console.error);
