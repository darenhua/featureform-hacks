export const mockPeople = [
  {
    id: "1",
    name: "Gene Park",
    image: require("../../assets/images/mock/gene.png"),
    interests: [
      "Made a project on music and sports",
      "Interested in Entrepreneurship", 
      "Made an education app"
    ]
  },
  {
    id: "2", 
    name: "Sarah Chen",
    image: require("../../assets/images/mock/gene.png"), // Using same image as placeholder
    interests: [
      "AI/ML Engineer at Google",
      "Passionate about deep learning",
      "Building the future of AI"
    ]
  },
  {
    id: "3",
    name: "Marcus Johnson", 
    image: require("../../assets/images/mock/gene.png"), // Using same image as placeholder
    interests: [
      "Startup founder & CEO",
      "Tech entrepreneur for 8+ years",
      "Loves building innovative products"
    ]
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    image: require("../../assets/images/mock/gene.png"), // Using same image as placeholder
    interests: [
      "Product designer at Meta",
      "UX/UI design enthusiast", 
      "Creating delightful user experiences"
    ]
  },
  {
    id: "5",
    name: "David Kim",
    image: require("../../assets/images/mock/gene.png"), // Using same image as placeholder
    interests: [
      "Full-stack developer",
      "Open source contributor",
      "Building web3 applications"
    ]
  }
];

export const mockPeopleByCategory = {
  "Entrepreneurship": [
    {
      id: "ent1",
      name: "Marcus Johnson",
      image: require("../../assets/images/mock/gene.png"),
      title: "Startup Founder & CEO"
    },
    {
      id: "ent2", 
      name: "Lisa Wang",
      image: require("../../assets/images/mock/gene.png"),
      title: "Serial Entrepreneur"
    },
    {
      id: "ent3",
      name: "Alex Thompson",
      image: require("../../assets/images/mock/gene.png"),
      title: "E-commerce Pioneer"
    },
    {
      id: "ent4",
      name: "Maya Patel",
      image: require("../../assets/images/mock/gene.png"), 
      title: "Tech Startup Advisor"
    }
  ],
  "Artificial Intelligence": [
    {
      id: "ai1",
      name: "Sarah Chen",
      image: require("../../assets/images/mock/gene.png"),
      title: "AI/ML Engineer"
    },
    {
      id: "ai2",
      name: "Dr. James Liu",
      image: require("../../assets/images/mock/gene.png"),
      title: "AI Research Scientist"
    },
    {
      id: "ai3", 
      name: "Rachel Green",
      image: require("../../assets/images/mock/gene.png"),
      title: "Machine Learning Lead"
    },
    {
      id: "ai4",
      name: "Kevin Zhang",
      image: require("../../assets/images/mock/gene.png"),
      title: "Deep Learning Expert"
    }
  ]
}; 