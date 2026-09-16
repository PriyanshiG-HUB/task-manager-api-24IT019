import type { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    id: '1',
    role: 'Data Analytics Intern',
    company: '3Skill Intern Growth',
    duration: 'Dec 2025 – Feb 2026',
    location: 'Remote',
    responsibilities: [
      'Built Python and SQL pipelines processing 10,000+ records',
      'Improved data quality by 25% through validation and cleansing workflows',
      'Designed Power BI dashboards reducing reporting effort by 30%',
      'Automated ETL workflows for efficient data processing',
      'Collaborated with stakeholders to define KPIs and reporting requirements',
    ],
    skills: ['Python', 'SQL', 'Power BI', 'ETL', 'Pandas', 'Data Visualization'],
    metrics: [
      { label: 'Records Processed', value: '10,000+' },
      { label: 'Data Quality Improvement', value: '25%' },
      { label: 'Reporting Effort Reduced', value: '30%' },
    ],
  },
  {
    id: '2',
    role: 'Full Stack Web Development Intern',
    company: 'Remark Skill Education × FCC, IIT Hyderabad',
    duration: 'Jun 2025 – Jul 2025',
    location: 'Remote',
    responsibilities: [
      'Developed a dynamic web application using PHP and Bootstrap',
      'Gained hands-on experience in full stack development with front-end and back-end integration',
      'Built responsive web design with UI optimization and database connectivity',
      'Implemented dynamic content management and collaborative agile task execution',
      'Enhanced technical proficiency and real-world software development practices',
    ],
    skills: ['PHP', 'Bootstrap', 'HTML', 'CSS', 'JavaScript', 'MySQL', 'Full Stack'],
    linkedin:
      'https://www.linkedin.com/posts/priyanshi-gajiwala-1b00b7323_webdevelopment-fullstackdeveloper-internshipexperience-activity-7382844446607945728-q2I0',
  },
]

export const leadership = {
  role: 'Technical Member',
  organization: 'CP Squad, CSPIT',
  activities: [
    'Organized 3 technical workshops on Git, GitHub, and development workflows',
    'Coordinated 2 hackathons promoting collaborative problem-solving',
    'Mentored 100+ students in coding and open-source contribution',
  ],
}
