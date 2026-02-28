const defaultWebinars = [
  {
    id: 1,
    title: "Mastering React",
    speaker: "John Doe",
    speakerEmail: "john@example.com",
    date: "March 10, 2026",
    time: "2:00 PM - 4:00 PM",
    description: "Deep dive into React hooks and best practices.",
    category: "Web Development",
    difficulty: "Intermediate",
    maxCapacity: 100,
    registeredCount: 45,
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=250&fit=crop",
    recordingUrl: "https://example.com/recordings/react-mastery",
    resources: [
      { name: "React Hooks Guide.pdf", url: "https://example.com/docs/hooks.pdf" },
      { name: "Code Examples", url: "https://example.com/github/react-examples" }
    ],
    ratings: 4.5,
    reviews: [
      { userId: 1, userName: "Alice", rating: 5, comment: "Excellent session!" }
    ]
  },
  {
    id: 2,
    title: "Cloud Computing Essentials",
    speaker: "Jane Smith",
    speakerEmail: "jane@example.com",
    date: "March 15, 2026",
    time: "1:00 PM - 3:00 PM",
    description: "Introduction to AWS, Azure and cloud architecture.",
    category: "Cloud",
    difficulty: "Beginner",
    maxCapacity: 150,
    registeredCount: 78,
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop",
    recordingUrl: "https://example.com/recordings/cloud-essentials",
    resources: [
      { name: "Cloud Architecture Slides.pdf", url: "https://example.com/docs/cloud.pdf" },
      { name: "AWS Tips", url: "https://example.com/docs/aws-tips.pdf" }
    ],
    ratings: 4.2,
    reviews: [
      { userId: 2, userName: "Bob", rating: 4, comment: "Very informative" }
    ]
  },
  {
    id: 3,
    title: "AI & Machine Learning Basics",
    speaker: "Dr. Alice Chen",
    speakerEmail: "alice.chen@example.com",
    date: "March 20, 2026",
    time: "3:00 PM - 5:00 PM",
    description: "Introduction to AI, ML algorithms and neural networks.",
    category: "AI/ML",
    difficulty: "Intermediate",
    maxCapacity: 80,
    registeredCount: 32,
    imageUrl: "https://images.unsplash.com/photo-1677442d019cecf8e57c2538fdf87a27a37a24e8?w=400&h=250&fit=crop",
    recordingUrl: "https://example.com/recordings/ai-ml-basics",
    resources: [
      { name: "ML Algorithms.pdf", url: "https://example.com/docs/ml.pdf" }
    ],
    ratings: 4.8,
    reviews: [
      { userId: 3, userName: "Charlie", rating: 5, comment: "Mind-blowing content!" }
    ]
  },
  {
    id: 4,
    title: "Web Design Principles",
    speaker: "Mike Johnson",
    speakerEmail: "mike@example.com",
    date: "March 25, 2026",
    time: "10:00 AM - 12:00 PM",
    description: "Learn modern UI/UX design principles and best practices.",
    category: "Design",
    difficulty: "Beginner",
    maxCapacity: 120,
    registeredCount: 65,
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    recordingUrl: "https://example.com/recordings/web-design",
    resources: [
      { name: "Design System Guide.pdf", url: "https://example.com/docs/design.pdf" }
    ],
    ratings: 4.6,
    reviews: []
  }
];

export default defaultWebinars;