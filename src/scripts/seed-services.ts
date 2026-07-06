import connectDB from '../lib/mongodb';
import Service from '../models/Service';

const servicesData = [
  {
    _id: 'serv_001',
    title: 'Web Design',
    icon: 'palette',
    description:
      'I create visually appealing, user-friendly websites that focus on seamless navigation and engaging designs. With expertise in **Figma** and modern web design principles, I ensure every project is crafted to provide an optimal user experience while aligning with the client\'s brand identity.',
    order_index: 1,
    isVisible: true,
  },
  {
    _id: 'serv_002',
    title: 'Frontend',
    icon: 'code',
    description:
      'We specialize in creating responsive user interfaces with expertise in ReactJS, HTML, CSS, and API integration. My projects showcase my proficiency in delivering sophisticated, functional web solutions that are tailored to user needs.',
    order_index: 2,
    isVisible: true,
  },
];

async function seedServices() {
  await connectDB();

  await Service.deleteMany({});
  await Service.insertMany(servicesData);

  console.log(`Seeded ${servicesData.length} services successfully!`);
  process.exit(0);
}

seedServices().catch(console.error);
