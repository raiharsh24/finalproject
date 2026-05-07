// ================= CODEARENA CHAT DATA =================

export const chats = [
  {
    id: 1,
    name: "Harsh Rai",
    avatar: "HR",
    lastMessage:
      "Sir, my DP solution gives TLE.",
    time: "2 mins ago",
    unread: 3,
  },

  {
    id: 2,
    name: "Priya Singh",
    avatar: "PS",
    lastMessage:
      "Can you review my React contest submission?",
    time: "5 mins ago",
    unread: 1,
  },

  {
    id: 3,
    name: "Rohit Kumar",
    avatar: "RK",
    lastMessage:
      "Leaderboard updated after contest.",
    time: "12 mins ago",
    unread: 0,
  },

  {
    id: 4,
    name: "Sneha Patel",
    avatar: "SP",
    lastMessage:
      "Binary Search quiz completed.",
    time: "18 mins ago",
    unread: 0,
  },

  {
    id: 5,
    name: "Aditya Verma",
    avatar: "AV",
    lastMessage:
      "Contest timer is working now.",
    time: "22 mins ago",
    unread: 0,
  },

  {
    id: 6,
    name: "Neha Joshi",
    avatar: "NJ",
    lastMessage:
      "Uploaded Java assignment.",
    time: "28 mins ago",
    unread: 0,
  },

  {
    id: 7,
    name: "Karan Mehta",
    avatar: "KM",
    lastMessage:
      "Can we unlock submissions again?",
    time: "35 mins ago",
    unread: 2,
  },

  {
    id: 8,
    name: "Ishita Roy",
    avatar: "IR",
    lastMessage:
      "Graph problem discussion created.",
    time: "40 mins ago",
    unread: 0,
  },

  {
    id: 9,
    name: "Yash Tiwari",
    avatar: "YT",
    lastMessage:
      "C++ code passed all hidden testcases.",
    time: "50 mins ago",
    unread: 0,
  },

  {
    id: 10,
    name: "Meera Nair",
    avatar: "MN",
    lastMessage:
      "Need help with recursion optimization.",
    time: "1 hour ago",
    unread: 0,
  },
];

/* ================= CHAT CONVERSATIONS ================= */

export const chatMessages = {
  1: [
    {
      id: 1,
      type: "received",
      text:
        "Sir, my Dynamic Programming solution is giving TLE.",
      time: "9:10am",
    },

    {
      id: 2,
      type: "sent",
      text:
        "Try memoization instead of pure recursion.",
      time: "9:12am",
      status: "seen",
    },

    {
      id: 3,
      type: "received",
      text:
        "Okay sir, I will optimize it.",
      time: "9:14am",
    },
  ],

  2: [
    {
      id: 1,
      type: "received",
      text:
        "Can you review my React contest submission?",
      time: "10:00am",
    },

    {
      id: 2,
      type: "sent",
      text:
        "Yes, your UI is good but optimize component rendering.",
      time: "10:02am",
      status: "seen",
    },

    {
      id: 3,
      type: "received",
      text:
        "Thank you! I’ll use memoization.",
      time: "10:05am",
    },
  ],

  3: [
    {
      id: 1,
      type: "received",
      text:
        "Leaderboard updated after contest.",
      time: "11:15am",
    },

    {
      id: 2,
      type: "sent",
      text:
        "Great work. Rankings are now visible.",
      time: "11:18am",
      status: "seen",
    },
  ],

  4: [
    {
      id: 1,
      type: "received",
      text:
        "Binary Search quiz completed successfully.",
      time: "12:20pm",
    },
  ],

  5: [
    {
      id: 1,
      type: "received",
      text:
        "Contest timer is working properly now.",
      time: "1:00pm",
    },

    {
      id: 2,
      type: "sent",
      text:
        "Perfect. Students can now track remaining contest time.",
      time: "1:02pm",
      status: "seen",
    },
  ],

  6: [
    {
      id: 1,
      type: "received",
      text:
        "Uploaded Java assignment.",
      time: "1:30pm",
    },
  ],

  7: [
    {
      id: 1,
      type: "received",
      text:
        "Can we unlock submissions again?",
      time: "2:00pm",
    },

    {
      id: 2,
      type: "sent",
      text:
        "Submissions are locked after contest end.",
      time: "2:02pm",
      status: "seen",
    },
  ],

  8: [
    {
      id: 1,
      type: "received",
      text:
        "Created discussion for Graph Traversal problem.",
      time: "2:30pm",
    },
  ],

  9: [
    {
      id: 1,
      type: "received",
      text:
        "My C++ solution passed all hidden testcases!",
      time: "3:00pm",
    },

    {
      id: 2,
      type: "sent",
      text:
        "Excellent work. Your optimization was correct.",
      time: "3:02pm",
      status: "seen",
    },
  ],

  10: [
    {
      id: 1,
      type: "received",
      text:
        "Need help with recursion optimization.",
      time: "4:00pm",
    },

    {
      id: 2,
      type: "sent",
      text:
        "Try converting recursive calls into iterative DP.",
      time: "4:05pm",
      status: "seen",
    },
  ],
};