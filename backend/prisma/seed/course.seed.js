require("dotenv").config();
const prisma = require("../../src/lib/prisma");

const courses = [
  {
    title: "Pre-Foundation Program",
    shortDescription:
      "Mathematics, Science, Reasoning & Concept Building",
    fullDescription:
      "A strong academic foundation program focused on mathematics, science, logical reasoning and conceptual development for students in middle school.",
    targetStudents: "Class 6 to 8",
    category: "Foundation",
    tags: ["Foundation", "Mathematics", "Science", "Reasoning"],
    eligibleClasses: [6, 7, 8],
    status: "ACTIVE",
    displayOrder: 1,
  },
  {
    title: "Olympiad Program",
    shortDescription:
      "Mathematics, Science & Logical Reasoning Olympiads",
    fullDescription:
      "Specialized preparation for mathematics, science and logical reasoning Olympiads with emphasis on problem solving and advanced concepts.",
    targetStudents: "Class 6 to 10",
    category: "Olympiad",
    tags: ["Olympiad", "Mathematics", "Science", "Reasoning"],
    eligibleClasses: [6, 7, 8, 9, 10],
    status: "ACTIVE",
    displayOrder: 2,
  },
  {
    title: "Foundation Program",
    shortDescription:
      "School Academics + Competitive Foundation",
    fullDescription:
      "A concept-driven program combining school academics with early competitive exam preparation for students in Classes 9 and 10.",
    targetStudents: "Class 9 to 10",
    category: "Foundation",
    tags: ["Foundation", "School Academics", "Competitive Preparation"],
    eligibleClasses: [9, 10],
    status: "ACTIVE",
    displayOrder: 3,
  },
  {
    title: "JEE Foundation Program",
    shortDescription:
      "Early JEE Main & Advanced Preparation",
    fullDescription:
      "Early-stage JEE preparation focused on building strong concepts in Physics, Chemistry and Mathematics before Class 11.",
    targetStudents: "Class 9 to 10",
    category: "JEE",
    tags: ["JEE", "JEE Main", "JEE Advanced", "Foundation"],
    eligibleClasses: [9, 10],
    status: "ACTIVE",
    displayOrder: 4,
  },
  {
    title: "NEET Foundation Program",
    shortDescription:
      "Early NEET Preparation",
    fullDescription:
      "Early NEET preparation designed to build strong fundamentals in Biology, Physics and Chemistry during Classes 9 and 10.",
    targetStudents: "Class 9 to 10",
    category: "NEET",
    tags: ["NEET", "Foundation", "Biology", "Physics", "Chemistry"],
    eligibleClasses: [9, 10],
    status: "ACTIVE",
    displayOrder: 5,
  },
  {
    title: "JEE Main & Advanced Program",
    shortDescription:
      "Engineering Entrance Preparation",
    fullDescription:
      "Comprehensive preparation for JEE Main and JEE Advanced with focused training in Physics, Chemistry and Mathematics.",
    targetStudents: "Class 11 to 12",
    category: "JEE",
    tags: ["JEE Main", "JEE Advanced", "Engineering Entrance"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 6,
  },
  {
    title: "NEET UG Program",
    shortDescription:
      "Medical Entrance Preparation",
    fullDescription:
      "Focused preparation for NEET UG with comprehensive coverage of Biology, Physics and Chemistry.",
    targetStudents: "Class 11 to 12",
    category: "NEET",
    tags: ["NEET UG", "Medical Entrance", "Biology", "Physics", "Chemistry"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 7,
  },
  {
    title: "GUJCET Program",
    shortDescription:
      "Gujarat Engineering & Pharmacy Entrance",
    fullDescription:
      "Targeted preparation for GUJCET with strong subject fundamentals, problem solving and examination-focused practice.",
    targetStudents: "Class 11 to 12",
    category: "GUJCET",
    tags: ["GUJCET", "Engineering Entrance", "Pharmacy Entrance"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 8,
  },
  {
    title: "Science & Research Entrance Program",
    shortDescription:
      "IISER IAT, NEST & Science/Research Entrances",
    fullDescription:
      "Preparation for science and research-oriented entrance examinations including IISER IAT, NEST and related pathways.",
    targetStudents: "Class 11 to 12",
    category: "Science & Research",
    tags: ["IISER IAT", "NEST", "Science", "Research Entrance"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 9,
  },
  {
    title: "University Entrance Program",
    shortDescription:
      "CUET & Other University Entrance Exams",
    fullDescription:
      "Preparation for CUET and other relevant university entrance examinations with structured academic and examination-focused guidance.",
    targetStudents: "Class 11 to 12",
    category: "University Entrance",
    tags: ["CUET", "University Entrance"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 10,
  },
  {
    title: "NDA Program",
    shortDescription:
      "NDA Written Examination Preparation",
    fullDescription:
      "Focused preparation for the NDA written examination covering mathematics, general ability and examination-oriented practice.",
    targetStudents: "Class 11 to 12",
    category: "NDA",
    tags: ["NDA", "Defence Entrance", "Mathematics", "General Ability"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 11,
  },
  {
    title: "Board Excellence Program — Science",
    shortDescription:
      "CBSE, ICSE & GSEB",
    fullDescription:
      "Board-focused science preparation for CBSE, ICSE and GSEB students with emphasis on conceptual clarity, practice and examination performance.",
    targetStudents: "Class 11 to 12",
    category: "Board Preparation",
    tags: ["CBSE", "ICSE", "GSEB", "Board Exams", "Science"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 12,
  },
  {
    title: "Integrated Science Program",
    shortDescription:
      "Board + Competitive Preparation",
    fullDescription:
      "An integrated science program combining board academics with competitive examination preparation for students who want a unified preparation pathway.",
    targetStudents: "Class 11 to 12",
    category: "Integrated",
    tags: ["Board Preparation", "Competitive Exams", "Science", "Integrated"],
    eligibleClasses: [11, 12],
    status: "ACTIVE",
    displayOrder: 13,
  },
];

const seedCourses = async () => {
  // Remove the old seed-only JEE Foundation record.
  // It is replaced by the finalized JEE Foundation Program below.
  await prisma.course.deleteMany({
    where: {
      title: "JEE Foundation",
    },
  });

  for (const course of courses) {
    const savedCourse = await prisma.course.upsert({
      where: {
        id: `seed-course-${course.displayOrder}`,
      },
      update: course,
      create: {
        id: `seed-course-${course.displayOrder}`,
        ...course,
      },
    });

    console.log(
      `Course synced: ${savedCourse.displayOrder}. ${savedCourse.title}`
    );
  }
};

seedCourses()
  .catch((error) => {
    console.error("Course seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
