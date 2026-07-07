import connectDB from '../lib/mongodb';
import Education from '../models/Education';

const educationsData = [
  {
    title: 'Full Stack Development',
    company: 'ISTA 2 Settat | Morocco',
    period: '2022 – 2024',
    description:
      'Two-year intensive program covering modern web development. Gained expertise in React, Node.js, MongoDB, and RESTful API design. Completed multiple hands-on projects and a final year thesis with distinction.',
    project: 'Ellendir - Web Application for ...',
    attestationUrl: '',
    align: 'left',
    order_index: 2,
    isVisible: true,
  },
  {
    title: 'Bachelor in Computer Science',
    company: 'University Hassan 1st | Settat',
    period: '2019 – 2022',
    description:
      'Three-year undergraduate program focused on computer science fundamentals: algorithms, data structures, databases, and software engineering principles.',
    project: 'E-commerce Platform',
    attestationUrl: '',
    align: 'right',
    order_index: 1,
    isVisible: true,
  },
];

async function seedEducation() {
  await connectDB();

  await Education.deleteMany({});
  await Education.insertMany(educationsData);

  console.log(`Seeded ${educationsData.length} education entries successfully!`);
  process.exit(0);
}

seedEducation().catch(console.error);
