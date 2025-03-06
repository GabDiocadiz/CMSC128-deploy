export const alumniData = [
  {
    name: "John Doe",
    graduation_year: 2015,
    degree: "Bachelor of Science in Computer Science",
    current_job_title: "Software Engineer",
    company: "Google",
    industry: "Technology",
    skills: ["JavaScript", "Node.js", "MongoDB"],
    profile_visibility: true,
    password: "password123",
    email: "johndoe@example.com",
    user_id: "601c8f85e9b5b0b67c2a7d1f",
  },
  {
    name: "Jane Smith",
    graduation_year: 2018,
    degree: "Bachelor of Science in Information Technology",
    current_job_title: "Data Scientist",
    company: "Facebook",
    industry: "Technology",
    skills: ["Python", "SQL", "Machine Learning"],
    profile_visibility: true,
    password: "password321",
    email: "janesmith@example.com",
    user_id: "601c8f85e9b5b0a67c2a7d1f",
  },
];

export const jobPostingsData = [
  {
    job_id: "01",
    posted_by: "601c8f85e9b5b0b67c2a7d1f",  // sample ObjectId (replace with actual)
    job_title: "Frontend Developer",
    company: "Google",
    location: "Mountain View, CA",
    job_description: "Looking for a frontend developer with React.js experience.",
    requirements: ["React.js", "JavaScript", "CSS"],
    application_link: "https://careers.google.com",
    status: "approved",
    approved_by: "601c8f84e9b5b0a67c2a7d1e",
    date_posted: '2024-04-15',
    approval_date: '2025-01-01',
  },
  {
    job_id: "02",
    posted_by: "601c8f85e9b5b0b67c2a7d1f",  // sample ObjectId (replace with actual)
    job_title: "Backend Developer",
    company: "Microsoft",
    location: "Redmond, WA",
    job_description: "Seeking a backend developer with Node.js experience.",
    requirements: ["Node.js", "Express", "MongoDB"],
    application_link: "https://careers.microsoft.com",
    status: "pending",
    date_posted: '2025-01-01',
  },
];

export const eventData = [
  {
      event_name: "Alumni Homecoming 2025",
      event_description: "A grand event for alumni to come together and celebrate their years at the university.",
      event_date: new Date('2025-05-15T18:00:00Z'),
      venue: "University Hall, Main Campus",
      created_by: '60c72b2f9c1f4d5c5b5f10c6', 
      attendees: [
          '60c72b2f9c1f4d5c5b5f10c0', 
          '60c72b2f9c1f4d5c5b5f10c1', 
      ]
  },
  {
      event_name: "Annual Alumni Networking Dinner",
      event_description: "A formal dinner to allow alumni to network, reconnect, and collaborate professionally.",
      event_date: new Date('2025-06-10T19:00:00Z'),
      venue: "Grand Ballroom, City Center Hotel",
      created_by: '60c72b2f9c1f4d5c5b5f10c6', 
      attendees: [
          '60c72b2f9c1f4d5c5b5f10c2', 
          '60c72b2f9c1f4d5c5b5f10c3', 
          '60c72b2f9c1f4d5c5b5f10c4'  
      ]
  }
];
