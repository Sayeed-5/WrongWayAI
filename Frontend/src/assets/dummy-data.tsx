export const faqData = [
    {
      question: "How does Wrong-Way Detection work?",
      answer:
        "Our AI-powered system analyzes live camera feeds to detect vehicles moving against traffic flow. When a wrong-way vehicle is detected, alerts are triggered instantly for traffic authorities.",
    },
    {
      question: "What is ANPR (Number Plate Recognition)?",
      answer:
        "Automatic Number Plate Recognition uses computer vision to read vehicle license plates from camera feeds. It helps in violation tracking, toll collection, and traffic monitoring.",
    },
    {
      question: "Is the Live Monitoring real-time?",
      answer:
        "Yes. Our Live Monitoring dashboard streams video feeds and updates violation data in real-time using WebSocket technology for instant incident alerts.",
    },
    {
      question: "Can this integrate with existing traffic systems?",
      answer:
        "Absolutely. Our platform is designed to integrate seamlessly with existing traffic management and CCTV infrastructures through standard APIs and protocols.",
    },
    {
      question: "Does it work in low light or bad weather?",
      answer:
        "The AI models are trained on diverse conditions. While performance may vary in extreme conditions, the system maintains reasonable accuracy in most real-world scenarios.",
    },
    {
      question: "Is the data secure and private?",
      answer:
        "We prioritize security. All video processing can be done on-premises, and we follow strict data protection protocols. No sensitive data is stored without consent.",
    }
  ];

export const footerLinks = [
    {
        title: "Company",
        links: [
            { name: "Home", url: "/" },
            { name: "Features", url: "/#features" },
            { name: "Work", url: "/#works" },
            { name: "Dashboard", url: "/dashboard" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];
