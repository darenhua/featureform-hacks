export const mockPeople = [
  {
    id: "1",
    userId: "gene-park",
    name: "Gene Park",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    interests: [
      "Made a project on music and sports",
      "Interested in Entrepreneurship", 
      "Made an education app"
    ],
    bio: "Dartmouth Student majoring in computer science interested in technology and AI",
    workHistory: [
      {
        title: "Software Engineering Intern",
        company: "Tech Startup",
        duration: "Summer 2024",
        description: "Developed mobile applications using React Native and worked on backend APIs"
      },
      {
        title: "Research Assistant", 
        company: "Dartmouth College",
        duration: "2023 - Present",
        description: "Conducting research on machine learning applications in education technology"
      }
    ]
  },
  {
    id: "2",
    userId: "sarah-chen", 
    name: "Sarah Chen",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    interests: [
      "AI/ML Engineer at Google",
      "Passionate about deep learning",
      "Building the future of AI"
    ],
    bio: "Senior AI/ML Engineer at Google with 5+ years of experience in deep learning and neural networks. Passionate about creating AI solutions that make a positive impact.",
    workHistory: [
      {
        title: "Senior AI/ML Engineer",
        company: "Google",
        duration: "2021 - Present", 
        description: "Leading AI initiatives for Google Search, developing large-scale machine learning models"
      },
      {
        title: "Machine Learning Engineer",
        company: "Meta",
        duration: "2019 - 2021",
        description: "Built recommendation systems and computer vision models for social media platforms"
      }
    ]
  },
  {
    id: "3",
    userId: "marcus-johnson",
    name: "Marcus Johnson", 
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    interests: [
      "Startup founder & CEO",
      "Tech entrepreneur for 8+ years",
      "Loves building innovative products"
    ],
    bio: "Serial entrepreneur and startup founder with 8+ years of experience building innovative tech products. Currently CEO of a fintech startup revolutionizing digital payments.",
    workHistory: [
      {
        title: "CEO & Founder",
        company: "PayFlow Technologies",
        duration: "2020 - Present",
        description: "Founded and leading a fintech startup focused on digital payment solutions"
      },
      {
        title: "Co-founder & CTO",
        company: "TechVenture Inc",
        duration: "2016 - 2020",
        description: "Co-founded a B2B SaaS platform, scaled to 50+ employees and $5M ARR"
      }
    ]
  },
  {
    id: "4",
    userId: "emily-rodriguez",
    name: "Emily Rodriguez",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    interests: [
      "Product designer at Meta",
      "UX/UI design enthusiast", 
      "Creating delightful user experiences"
    ],
    bio: "Senior Product Designer at Meta with expertise in UX/UI design and user research. Passionate about creating intuitive and delightful user experiences.",
    workHistory: [
      {
        title: "Senior Product Designer",
        company: "Meta",
        duration: "2022 - Present",
        description: "Leading design for WhatsApp features, focusing on user engagement and accessibility"
      },
      {
        title: "UX Designer",
        company: "Airbnb",
        duration: "2020 - 2022",
        description: "Designed user experiences for booking and host management platforms"
      }
    ]
  },
  {
    id: "5",
    userId: "david-kim",
    name: "David Kim",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    interests: [
      "Full-stack developer",
      "Open source contributor",
      "Building web3 applications"
    ],
    bio: "Full-stack developer and open source enthusiast with expertise in web3 technologies. Active contributor to blockchain projects and decentralized applications.",
    workHistory: [
      {
        title: "Senior Full-Stack Developer",
        company: "Blockchain Innovations",
        duration: "2021 - Present",
        description: "Developing decentralized applications and smart contracts on Ethereum and Solana"
      },
      {
        title: "Software Engineer",
        company: "Traditional Tech Corp",
        duration: "2018 - 2021",
        description: "Built scalable web applications using React, Node.js, and cloud technologies"
      }
    ]
  },
  {
    id: "6",
    userId: "lisa-wang",
    name: "Lisa Wang",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    interests: [
      "Serial entrepreneur",
      "E-commerce expert",
      "Building scalable businesses"
    ],
    bio: "Serial entrepreneur with multiple successful exits. Currently building the next generation of e-commerce platforms.",
    workHistory: [
      {
        title: "CEO & Founder",
        company: "NextGen Commerce",
        duration: "2022 - Present",
        description: "Building AI-powered e-commerce solutions for small businesses"
      },
      {
        title: "Co-founder",
        company: "ShopTech Solutions",
        duration: "2018 - 2022",
        description: "Co-founded and scaled e-commerce platform to $10M ARR before acquisition"
      }
    ]
  },
  {
    id: "7",
    userId: "alex-thompson",
    name: "Alex Thompson",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    interests: [
      "E-commerce pioneer",
      "Digital marketing expert",
      "Growth hacking specialist"
    ],
    bio: "E-commerce pioneer and digital marketing expert with 10+ years of experience scaling online businesses.",
    workHistory: [
      {
        title: "VP of Growth",
        company: "E-commerce Giant",
        duration: "2020 - Present",
        description: "Leading growth initiatives and digital marketing strategies for major e-commerce platform"
      },
      {
        title: "Marketing Director",
        company: "Startup Accelerator",
        duration: "2017 - 2020",
        description: "Helped 50+ startups scale their marketing and achieve product-market fit"
      }
    ]
  },
  {
    id: "8",
    userId: "maya-patel",
    name: "Maya Patel",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    interests: [
      "Tech startup advisor",
      "Venture capital expert",
      "Mentoring entrepreneurs"
    ],
    bio: "Tech startup advisor and former VC with extensive experience in early-stage investments and startup mentoring.",
    workHistory: [
      {
        title: "Senior Advisor",
        company: "TechStars",
        duration: "2021 - Present",
        description: "Advising early-stage startups on product development, fundraising, and go-to-market strategies"
      },
      {
        title: "Principal",
        company: "Innovation Ventures",
        duration: "2018 - 2021",
        description: "Led investments in 20+ early-stage tech startups with focus on AI and fintech"
      }
    ]
  }
];

export const mockPeopleByCategory = {
  "Entrepreneurship": [
    {
      id: "ent1",
      userId: "marcus-johnson",
      name: "Marcus Johnson",
      image: "https://randomuser.me/api/portraits/men/7.jpg",
      title: "Startup Founder & CEO"
    },
    {
      id: "ent2",
      userId: "lisa-wang", 
      name: "Lisa Wang",
      image: "https://randomuser.me/api/portraits/women/8.jpg",
      title: "Serial Entrepreneur"
    },
    {
      id: "ent3",
      userId: "alex-thompson",
      name: "Alex Thompson",
      image: "https://randomuser.me/api/portraits/men/9.jpg",
      title: "E-commerce Pioneer"
    },
    {
      id: "ent4",
      userId: "maya-patel",
      name: "Maya Patel",
      image: "https://randomuser.me/api/portraits/women/10.jpg", 
      title: "Tech Startup Advisor"
    }
  ],
  "Artificial Intelligence": [
    {
      id: "ai1",
      userId: "sarah-chen",
      name: "Sarah Chen",
      image: "https://randomuser.me/api/portraits/women/11.jpg",
      title: "AI/ML Engineer"
    },
    {
      id: "ai2",
      userId: "james-liu",
      name: "Dr. James Liu",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
      title: "AI Research Scientist"
    },
    {
      id: "ai3",
      userId: "rachel-green", 
      name: "Rachel Green",
      image: "https://randomuser.me/api/portraits/women/13.jpg",
      title: "Machine Learning Lead"
    },
    {
      id: "ai4",
      userId: "kevin-zhang",
      name: "Kevin Zhang",
      image: "https://randomuser.me/api/portraits/men/14.jpg",
      title: "Deep Learning Expert"
    }
  ],
  "Product Design": [
    {
      id: "pd1",
      userId: "emily-rodriguez",
      name: "Emily Rodriguez",
      image: "https://randomuser.me/api/portraits/women/15.jpg",
      title: "Senior Product Designer"
    },
    {
      id: "pd2",
      userId: "tyler-brooks",
      name: "Tyler Brooks",
      image: "https://randomuser.me/api/portraits/men/16.jpg",
      title: "UX/UI Designer"
    },
    {
      id: "pd3",
      userId: "sophia-martinez",
      name: "Sophia Martinez",
      image: "https://randomuser.me/api/portraits/women/17.jpg",
      title: "Design Systems Lead"
    },
    {
      id: "pd4",
      userId: "jordan-lee",
      name: "Jordan Lee",
      image: "https://randomuser.me/api/portraits/men/18.jpg",
      title: "Creative Director"
    }
  ]
}; 