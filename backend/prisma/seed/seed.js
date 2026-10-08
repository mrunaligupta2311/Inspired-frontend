require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../../src/lib/prisma");

const courses = [
  {
    title: "Pre-Foundation Program",
    shortDescription: "Mathematics, Science, Reasoning & Concept Building",
    fullDescription: "A strong academic foundation program focused on mathematics, science, logical reasoning and conceptual development for students in middle school.",
    targetStudents: "Class 6 to 8",
    category: "Foundation",
    tags: ["Foundation", "Mathematics", "Science", "Reasoning"],
    eligibleClasses: [6, 7, 8],
    status: "ACTIVE",
    displayOrder: 1,
  },
  {
    title: "Olympiad Program",
    shortDescription: "Mathematics, Science & Logical Reasoning Olympiads",
    fullDescription: "Specialized preparation for mathematics, science and logical reasoning Olympiads with emphasis on problem solving and advanced concepts.",
    targetStudents: "Class 6 to 10",
    category: "Olympiad",
    tags: ["Olympiad", "Mathematics", "Science", "Reasoning"],
    eligibleClasses: [6, 7, 8, 9, 10],
    status: "ACTIVE",
    displayOrder: 2,
  },
  {
    title: "Foundation Program",
    shortDescription: "School Academics + Competitive Foundation",
    fullDescription: "A concept-driven program combining school academics with early competitive exam preparation for students in Classes 9 and 10.",
    targetStudents: "Class 9 to 10",
    category: "Foundation",
    tags: ["Foundation", "School Academics", "Competitive Preparation"],
    eligibleClasses: [9, 10],
    status: "ACTIVE",
    displayOrder: 3,
  },
  {
    title: "JEE Foundation Program",
    shortDescription: "Early JEE Main & Advanced Preparation",
    fullDescription: "Early-stage JEE preparation focused on building strong concepts in Physics, Chemistry and Mathematics before Class 11.",
    targetStudents: "Class 9 to 10",
    category: "JEE",
    tags: ["JEE", "JEE Main", "JEE Advanced", "Foundation"],
    eligibleClasses: [9, 10],
    status: "ACTIVE",
    displayOrder: 4,
  },
  {
    title: "NEET Foundation Program",
    shortDescription: "Early NEET Preparation",
    fullDescription: "Early NEET preparation designed to build strong fundamentals in Biology, Physics and Chemistry during Classes 9 and 10.",
    targetStudents: "Class 9 to 10",
    category: "NEET",
    tags: ["NEET", "Foundation", "Biology", "Physics", "Chemistry"],
    eligibleClasses: [9, 10],
    status: "ACTIVE",
    displayOrder: 5,
  },
  {
    title: "JEE Main & Advanced Program",
    shortDescription: "Engineering Entrance Preparation",
    fullDescription: "Comprehensive preparation for JEE Main and JEE Advanced with focused training in Physics, Chemistry and Mathematics.",
    targetStudents: "Class 11 to 12",
    category: "JEE",
    tags: ["JEE Main", "JEE Advanced", "Engineering Entrance"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 6,
  },
  {
    title: "NEET UG Program",
    shortDescription: "Medical Entrance Preparation",
    fullDescription: "Focused preparation for NEET UG with comprehensive coverage of Biology, Physics and Chemistry.",
    targetStudents: "Class 11 to 12",
    category: "NEET",
    tags: ["NEET UG", "Medical Entrance", "Biology", "Physics", "Chemistry"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 7,
  },
  {
    title: "GUJCET Program",
    shortDescription: "Gujarat Engineering & Pharmacy Entrance",
    fullDescription: "Targeted preparation for GUJCET with strong subject fundamentals, problem solving and examination-focused practice.",
    targetStudents: "Class 11 to 12",
    category: "GUJCET",
    tags: ["GUJCET", "Engineering Entrance", "Pharmacy Entrance"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 8,
  },
  {
    title: "Science & Research Entrance Program",
    shortDescription: "IISER IAT, NEST & Science/Research Entrances",
    fullDescription: "Preparation for science and research-oriented entrance examinations including IISER IAT, NEST and related pathways.",
    targetStudents: "Class 11 to 12",
    category: "Science & Research",
    tags: ["IISER IAT", "NEST", "Science", "Research Entrance"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 9,
  },
  {
    title: "Board Excellence Program — Science",
    shortDescription: "CBSE, ICSE & GSEB",
    fullDescription: "Board-focused science preparation for CBSE, ICSE and GSEB students with emphasis on conceptual clarity, practice and examination performance.",
    targetStudents: "Class 11 to 12",
    category: "Board Preparation",
    tags: ["CBSE", "ICSE", "GSEB", "Board Exams", "Science"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 10,
  },
];

const faculties = [
  {
    name: "Dr. R. K. Sharma",
    designation: "Head of Physics Department",
    subject: "Physics",
    qualification: "Ph.D. in Physics, Ex-Professor",
    experience: "15+ Years Experience",
    bio: "Passionate about making mechanics, electrodynamics and modern physics intuitive and application-oriented.",
    profileImage: "",
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "Prof. S. Patel",
    designation: "Senior Faculty — Chemistry",
    subject: "Chemistry",
    qualification: "M.Sc. Chemistry, CSIR NET",
    experience: "12+ Years Experience",
    bio: "Specialist in Organic and Physical Chemistry with proven track record of guiding top rankers in JEE & NEET.",
    profileImage: "",
    displayOrder: 2,
    isActive: true,
  },
  {
    name: "Er. A. Mehta",
    designation: "Head of Mathematics",
    subject: "Mathematics",
    qualification: "B.Tech, IIT Roorkee",
    experience: "10+ Years Experience",
    bio: "Known for shortcut techniques, calculus mastery and competitive math Olympiad guidance.",
    profileImage: "",
    displayOrder: 3,
    isActive: true,
  },
  {
    name: "Dr. N. Desai",
    designation: "Senior Faculty — Biology",
    subject: "Biology",
    qualification: "M.B.B.S., MD",
    experience: "11+ Years Experience",
    bio: "Comprehensive NEET Zoology and Botany preparation with high retention visual diagrams and NCERT mastery.",
    profileImage: "",
    displayOrder: 4,
    isActive: true,
  },
];

const results = [
  {
    studentName: "Nisarg Rathod",
    exam: "JEE Main",
    year: 2024,
    score: "99.18 %ile",
    percentile: "99.18",
    rank: "State Rank 42",
    achievementTitle: "JEE Main 99.18 Percentile",
    description: "Exceptional performance in JEE Main with State Rank 42 in Gujarat.",
    studentImage: "",
    displayOrder: 1,
    isActive: true,
  },
  {
    studentName: "Priya Shah",
    exam: "NEET UG",
    year: 2024,
    score: "685 / 720",
    percentile: "99.92 %ile",
    rank: "AIR 412",
    achievementTitle: "Secured Top Medical College Admission",
    description: "Scored 685/720 in NEET UG with 355/360 in Biology.",
    studentImage: "",
    displayOrder: 2,
    isActive: true,
  },
  {
    studentName: "Dev Dave",
    exam: "GUJCET",
    year: 2024,
    score: "118 / 120",
    percentile: "99.85 %ile",
    rank: "Dist. Rank 3",
    achievementTitle: "Top Scorer in GUJCET Engineering",
    description: "Consistent academic performance across Board and GUJCET examinations.",
    studentImage: "",
    displayOrder: 3,
    isActive: true,
  },
];

const galleryItems = [
  {
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    mediaType: "IMAGE",
    title: "Interactive Classroom Session",
    description: "Engaging classroom lecture with conceptual clarity and student discussions.",
    category: "Classroom",
    displayOrder: 1,
    isActive: true,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    mediaType: "IMAGE",
    title: "Science Practical Demonstration",
    description: "Hands-on physics and chemistry experimental verification.",
    category: "Laboratory",
    displayOrder: 2,
    isActive: true,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    mediaType: "IMAGE",
    title: "Annual Student Felicitations",
    description: "Honoring top achievers in Board, JEE, NEET and Olympiad examinations.",
    category: "Events",
    displayOrder: 3,
    isActive: true,
  },
];

const seedDatabase = async () => {
  console.log("[Seed] Checking and seeding database records...");

  // 1. Seed Institute Profile if none exists
  const existingInstitute = await prisma.institute.findFirst();
  if (!existingInstitute) {
    await prisma.institute.create({
      data: {
        name: "Inspired Institute",
        phone: "+91 98765 43210",
        whatsappNumber: "+91 98765 43210",
        email: "contact@inspiredinstitute.com",
        address: "Alkapuri, Vadodara, Gujarat 390007",
        workingHours: "Monday – Saturday: 8:00 AM – 8:00 PM",
        facebookUrl: "https://facebook.com",
        instagramUrl: "https://instagram.com",
        youtubeUrl: "https://youtube.com",
        linkedinUrl: "https://linkedin.com",
        about: "Concept-based learning, academic excellence, and competitive exam preparation for Classes 6–12, JEE, NEET, GUJCET, and Olympiads in Vadodara.",
      },
    });
    console.log("[Seed] Institute profile created.");
  }

  // 2. Seed Admin
  const adminEmail = (process.env.ADMIN_EMAIL || "mrunaligupta2311@gmail.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "1234";
  const adminName = process.env.ADMIN_NAME || "Mrunali Gupta";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        isActive: true,
      },
    });
    console.log(`[Seed] Admin user created: ${adminEmail}`);
  } else {
    await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: { name: adminName, passwordHash, isActive: true },
    });
    console.log(`[Seed] Admin user updated: ${adminEmail}`);
  }

  // 3. Seed Courses
  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    for (const c of courses) {
      await prisma.course.create({ data: c });
    }
    console.log(`[Seed] ${courses.length} courses created.`);
  }

  // 4. Seed Faculty
  const facultyCount = await prisma.faculty.count();
  if (facultyCount === 0) {
    for (const f of faculties) {
      await prisma.faculty.create({ data: f });
    }
    console.log(`[Seed] ${faculties.length} faculty members created.`);
  }

  // 5. Seed Results
  const resultCount = await prisma.result.count();
  if (resultCount === 0) {
    for (const r of results) {
      await prisma.result.create({ data: r });
    }
    console.log(`[Seed] ${results.length} student results created.`);
  }

  // 6. Seed Gallery
  const galleryCount = await prisma.gallery.count();
  if (galleryCount === 0) {
    for (const g of galleryItems) {
      await prisma.gallery.create({ data: g });
    }
    console.log(`[Seed] ${galleryItems.length} gallery items created.`);
  }

  console.log("[Seed] Database seeding completed successfully.");
};

if (require.main === module) {
  seedDatabase()
    .catch((err) => {
      console.error("[Seed Error]", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect().catch(() => {});
    });
}

module.exports = seedDatabase;
