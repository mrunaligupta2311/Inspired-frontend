const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const bcrypt = require("bcryptjs");

const dataDir = path.resolve(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "inspired.sqlite");
const db = new DatabaseSync(dbPath);

// Initialize SQLite Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    shortDescription TEXT,
    fullDescription TEXT,
    targetStudents TEXT,
    category TEXT,
    tags TEXT,
    eligibleClasses TEXT,
    status TEXT DEFAULT 'ACTIVE',
    displayOrder INTEGER DEFAULT 0,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS faculty (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT,
    subject TEXT,
    qualification TEXT,
    experience TEXT,
    bio TEXT,
    profileImage TEXT,
    displayOrder INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    studentName TEXT NOT NULL,
    exam TEXT,
    year INTEGER,
    score TEXT,
    percentile TEXT,
    rank TEXT,
    achievementTitle TEXT,
    description TEXT,
    studentImage TEXT,
    displayOrder INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    imageUrl TEXT NOT NULL,
    mediaUrl TEXT,
    mediaType TEXT DEFAULT 'IMAGE',
    cloudinaryPublicId TEXT,
    title TEXT,
    description TEXT,
    category TEXT,
    displayOrder INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS institute (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    whatsappNumber TEXT,
    email TEXT,
    address TEXT,
    workingHours TEXT,
    facebookUrl TEXT,
    instagramUrl TEXT,
    youtubeUrl TEXT,
    linkedinUrl TEXT,
    about TEXT,
    heroImageUrl TEXT,
    heroImagePublicId TEXT,
    heroCloudinaryPublicId TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    studentName TEXT NOT NULL,
    parentName TEXT,
    phoneNumber TEXT NOT NULL,
    email TEXT,
    studentClass TEXT,
    interestedCourse TEXT,
    message TEXT,
    status TEXT DEFAULT 'NEW',
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT,
    updatedAt TEXT
  );
`);

// Helpers for JSON fields and booleans
const parseCourse = (row) => {
  if (!row) return null;
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
    eligibleClasses: row.eligibleClasses ? JSON.parse(row.eligibleClasses) : [],
  };
};

const parseFaculty = (row) => {
  if (!row) return null;
  return {
    ...row,
    isActive: Boolean(row.isActive),
  };
};

const parseResult = (row) => {
  if (!row) return null;
  return {
    ...row,
    isActive: Boolean(row.isActive),
  };
};

const parseGallery = (row) => {
  if (!row) return null;
  return {
    ...row,
    isActive: Boolean(row.isActive),
  };
};

const parseAdmin = (row) => {
  if (!row) return null;
  return {
    ...row,
    isActive: Boolean(row.isActive),
  };
};

const parseInstitute = (row) => {
  if (!row) return null;
  const heroUrl = row.heroImageUrl || "";
  return {
    ...row,
    heroImageUrl: heroUrl,
    heroMediaUrl: heroUrl,
  };
};

// Seed default records if SQLite tables are empty
const seedIfEmpty = () => {
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get().count;
  if (adminCount === 0) {
    const passwordHash1234 = bcrypt.hashSync("1234", 10);
    const passwordHashAdmin123 = bcrypt.hashSync("Admin@123", 10);
    const now = new Date().toISOString();

    const insertAdmin = db.prepare(`
      INSERT INTO admins (id, name, email, passwordHash, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 1, ?, ?)
    `);

    insertAdmin.run("admin-1", "Mrunali Gupta", "mrunaligupta2311@gmail.com", passwordHash1234, now, now);
    insertAdmin.run("admin-2", "Inspired Institute Admin", "admin@inspiredinstitute.com", passwordHashAdmin123, now, now);
  }

  const instCount = db.prepare("SELECT COUNT(*) as count FROM institute").get().count;
  if (instCount === 0) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO institute (
        id, name, phone, whatsappNumber, email, address, workingHours,
        facebookUrl, instagramUrl, youtubeUrl, linkedinUrl, about,
        heroImageUrl, heroImagePublicId, heroCloudinaryPublicId, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      "inst-1",
      "Inspired Institute",
      "+91 98765 43210",
      "+91 98765 43210",
      "contact@inspiredinstitute.com",
      "Alkapuri, Vadodara, Gujarat 390007",
      "Monday – Saturday: 8:00 AM – 8:00 PM",
      "https://facebook.com",
      "https://instagram.com",
      "https://youtube.com",
      "https://linkedin.com",
      "Concept-based learning, academic excellence, and competitive exam preparation for Classes 6–12, JEE, NEET, GUJCET, and Olympiads in Vadodara.",
      "",
      null,
      null,
      now,
      now
    );
  }

  const courseCount = db.prepare("SELECT COUNT(*) as count FROM courses").get().count;
  if (courseCount === 0) {
    const now = new Date().toISOString();
    const initialCourses = [
      {
        id: "course-1",
        title: "Pre-Foundation Program",
        shortDescription: "Mathematics, Science, Reasoning & Concept Building",
        fullDescription: "A strong academic foundation program focused on mathematics, science, logical reasoning and conceptual development for students in middle school.",
        targetStudents: "Class 6 to 8",
        category: "Foundation",
        tags: JSON.stringify(["Foundation", "Mathematics", "Science", "Reasoning"]),
        eligibleClasses: JSON.stringify([6, 7, 8]),
        status: "ACTIVE",
        displayOrder: 1,
      },
      {
        id: "course-2",
        title: "Olympiad Program",
        shortDescription: "Mathematics, Science & Logical Reasoning Olympiads",
        fullDescription: "Specialized preparation for mathematics, science and logical reasoning Olympiads with emphasis on problem solving and advanced concepts.",
        targetStudents: "Class 6 to 10",
        category: "Olympiad",
        tags: JSON.stringify(["Olympiad", "Mathematics", "Science", "Reasoning"]),
        eligibleClasses: JSON.stringify([6, 7, 8, 9, 10]),
        status: "ACTIVE",
        displayOrder: 2,
      },
      {
        id: "course-3",
        title: "Foundation Program",
        shortDescription: "School Academics + Competitive Foundation",
        fullDescription: "A concept-driven program combining school academics with early competitive exam preparation for students in Classes 9 and 10.",
        targetStudents: "Class 9 to 10",
        category: "Foundation",
        tags: JSON.stringify(["Foundation", "School Academics", "Competitive Preparation"]),
        eligibleClasses: JSON.stringify([9, 10]),
        status: "ACTIVE",
        displayOrder: 3,
      },
      {
        id: "course-4",
        title: "JEE Main & Advanced Program",
        shortDescription: "Engineering Entrance Preparation",
        fullDescription: "Comprehensive preparation for JEE Main and JEE Advanced with focused training in Physics, Chemistry and Mathematics.",
        targetStudents: "Class 11 to 12",
        category: "JEE",
        tags: JSON.stringify(["JEE Main", "JEE Advanced", "Engineering Entrance"]),
        eligibleClasses: JSON.stringify([11, 12]),
        status: "ACTIVE",
        displayOrder: 4,
      },
      {
        id: "course-5",
        title: "NEET UG Program",
        shortDescription: "Medical Entrance Preparation",
        fullDescription: "Focused preparation for NEET UG with comprehensive coverage of Biology, Physics and Chemistry.",
        targetStudents: "Class 11 to 12",
        category: "NEET",
        tags: JSON.stringify(["NEET UG", "Medical Entrance", "Biology", "Physics", "Chemistry"]),
        eligibleClasses: JSON.stringify([11, 12]),
        status: "ACTIVE",
        displayOrder: 5,
      },
      {
        id: "course-6",
        title: "GUJCET Program",
        shortDescription: "Gujarat Engineering & Pharmacy Entrance",
        fullDescription: "Targeted preparation for GUJCET with strong subject fundamentals, problem solving and examination-focused practice.",
        targetStudents: "Class 11 to 12",
        category: "GUJCET",
        tags: JSON.stringify(["GUJCET", "Engineering Entrance", "Pharmacy Entrance"]),
        eligibleClasses: JSON.stringify([11, 12]),
        status: "ACTIVE",
        displayOrder: 6,
      },
    ];

    const insertCourse = db.prepare(`
      INSERT INTO courses (
        id, title, shortDescription, fullDescription, targetStudents, category,
        tags, eligibleClasses, status, displayOrder, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of initialCourses) {
      insertCourse.run(
        c.id, c.title, c.shortDescription, c.fullDescription, c.targetStudents,
        c.category, c.tags, c.eligibleClasses, c.status, c.displayOrder, now, now
      );
    }
  }

  const facultyCount = db.prepare("SELECT COUNT(*) as count FROM faculty").get().count;
  if (facultyCount === 0) {
    const now = new Date().toISOString();
    const initialFaculty = [
      {
        id: "fac-1",
        name: "Dr. R. K. Sharma",
        designation: "Head of Physics Department",
        subject: "Physics",
        qualification: "Ph.D. in Physics, Ex-Professor",
        experience: "15+ Years Experience",
        bio: "Passionate about making mechanics, electrodynamics and modern physics intuitive and application-oriented.",
        profileImage: "",
        displayOrder: 1,
        isActive: 1,
      },
      {
        id: "fac-2",
        name: "Prof. S. Patel",
        designation: "Senior Faculty — Chemistry",
        subject: "Chemistry",
        qualification: "M.Sc. Chemistry, CSIR NET",
        experience: "12+ Years Experience",
        bio: "Specialist in Organic and Physical Chemistry with proven track record of guiding top rankers in JEE & NEET.",
        profileImage: "",
        displayOrder: 2,
        isActive: 1,
      },
      {
        id: "fac-3",
        name: "Er. A. Mehta",
        designation: "Head of Mathematics",
        subject: "Mathematics",
        qualification: "B.Tech, IIT Roorkee",
        experience: "10+ Years Experience",
        bio: "Known for shortcut techniques, calculus mastery and competitive math Olympiad guidance.",
        profileImage: "",
        displayOrder: 3,
        isActive: 1,
      },
      {
        id: "fac-4",
        name: "Dr. N. Desai",
        designation: "Senior Faculty — Biology",
        subject: "Biology",
        qualification: "M.B.B.S., MD",
        experience: "11+ Years Experience",
        bio: "Comprehensive NEET Zoology and Botany preparation with high retention visual diagrams and NCERT mastery.",
        profileImage: "",
        displayOrder: 4,
        isActive: 1,
      },
    ];

    const insertFaculty = db.prepare(`
      INSERT INTO faculty (
        id, name, designation, subject, qualification, experience,
        bio, profileImage, displayOrder, isActive, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const f of initialFaculty) {
      insertFaculty.run(
        f.id, f.name, f.designation, f.subject, f.qualification,
        f.experience, f.bio, f.profileImage, f.displayOrder, f.isActive, now, now
      );
    }
  }

  const resultCount = db.prepare("SELECT COUNT(*) as count FROM results").get().count;
  if (resultCount === 0) {
    const now = new Date().toISOString();
    const initialResults = [
      {
        id: "res-1",
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
        isActive: 1,
      },
      {
        id: "res-2",
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
        isActive: 1,
      },
      {
        id: "res-3",
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
        isActive: 1,
      },
    ];

    const insertResult = db.prepare(`
      INSERT INTO results (
        id, studentName, exam, year, score, percentile, rank,
        achievementTitle, description, studentImage, displayOrder, isActive, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of initialResults) {
      insertResult.run(
        r.id, r.studentName, r.exam, r.year, r.score, r.percentile,
        r.rank, r.achievementTitle, r.description, r.studentImage, r.displayOrder, r.isActive, now, now
      );
    }
  }

  const galleryCount = db.prepare("SELECT COUNT(*) as count FROM gallery").get().count;
  if (galleryCount === 0) {
    const now = new Date().toISOString();
    const initialGallery = [
      {
        id: "gal-1",
        imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
        mediaUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
        mediaType: "IMAGE",
        title: "Interactive Classroom Session",
        description: "Engaging classroom lecture with conceptual clarity and student discussions.",
        category: "Classroom",
        displayOrder: 1,
        isActive: 1,
      },
      {
        id: "gal-2",
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
        mediaUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
        mediaType: "IMAGE",
        title: "Science Practical Demonstration",
        description: "Hands-on physics and chemistry experimental verification.",
        category: "Laboratory",
        displayOrder: 2,
        isActive: 1,
      },
      {
        id: "gal-3",
        imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        mediaUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        mediaType: "IMAGE",
        title: "Annual Student Felicitations",
        description: "Honoring top achievers in Board, JEE, NEET and Olympiad examinations.",
        category: "Events",
        displayOrder: 3,
        isActive: 1,
      },
    ];

    const insertGallery = db.prepare(`
      INSERT INTO gallery (
        id, imageUrl, mediaUrl, mediaType, cloudinaryPublicId,
        title, description, category, displayOrder, isActive, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const g of initialGallery) {
      insertGallery.run(
        g.id, g.imageUrl, g.mediaUrl, g.mediaType, g.title,
        g.description, g.category, g.displayOrder, g.isActive, now, now
      );
    }
  }
};

seedIfEmpty();

// Build Prisma-compatible API
const sqlitePrisma = {
  course: {
    async findMany(args = {}) {
      let sql = "SELECT * FROM courses";
      const params = [];
      if (args.where?.status) {
        sql += " WHERE status = ?";
        params.push(args.where.status);
      }
      sql += " ORDER BY displayOrder ASC, createdAt DESC";
      if (args.take) {
        sql += " LIMIT ?";
        params.push(args.take);
      }
      const rows = db.prepare(sql).all(...params);
      return rows.map(parseCourse);
    },
    async findFirst(args = {}) {
      const items = await this.findMany({ ...args, take: 1 });
      return items[0] || null;
    },
    async findUnique(args = {}) {
      const id = args.where?.id;
      if (!id) return null;
      const row = db.prepare("SELECT * FROM courses WHERE id = ?").get(id);
      return parseCourse(row);
    },
    async count(args = {}) {
      let sql = "SELECT COUNT(*) as count FROM courses";
      const params = [];
      if (args.where?.status) {
        sql += " WHERE status = ?";
        params.push(args.where.status);
      }
      return db.prepare(sql).get(...params).count;
    },
    async create(args = {}) {
      const d = args.data;
      const id = d.id || `course-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const tags = d.tags ? JSON.stringify(d.tags) : "[]";
      const classes = d.eligibleClasses ? JSON.stringify(d.eligibleClasses) : "[]";

      db.prepare(`
        INSERT INTO courses (
          id, title, shortDescription, fullDescription, targetStudents, category,
          tags, eligibleClasses, status, displayOrder, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, d.title, d.shortDescription || null, d.fullDescription || null,
        d.targetStudents || null, d.category || null, tags, classes,
        d.status || "ACTIVE", d.displayOrder ?? 0, now, now
      );

      return this.findUnique({ where: { id } });
    },
    async update(args = {}) {
      const id = args.where?.id;
      const d = args.data;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Course not found");

      const sets = [];
      const params = [];

      if (d.title !== undefined) { sets.push("title = ?"); params.push(d.title); }
      if (d.shortDescription !== undefined) { sets.push("shortDescription = ?"); params.push(d.shortDescription); }
      if (d.fullDescription !== undefined) { sets.push("fullDescription = ?"); params.push(d.fullDescription); }
      if (d.targetStudents !== undefined) { sets.push("targetStudents = ?"); params.push(d.targetStudents); }
      if (d.category !== undefined) { sets.push("category = ?"); params.push(d.category); }
      if (d.tags !== undefined) { sets.push("tags = ?"); params.push(JSON.stringify(d.tags)); }
      if (d.eligibleClasses !== undefined) { sets.push("eligibleClasses = ?"); params.push(JSON.stringify(d.eligibleClasses)); }
      if (d.status !== undefined) { sets.push("status = ?"); params.push(d.status); }
      if (d.displayOrder !== undefined) { sets.push("displayOrder = ?"); params.push(d.displayOrder); }

      sets.push("updatedAt = ?");
      params.push(new Date().toISOString());
      params.push(id);

      db.prepare(`UPDATE courses SET ${sets.join(", ")} WHERE id = ?`).run(...params);
      return this.findUnique({ where: { id } });
    },
    async delete(args = {}) {
      const id = args.where?.id;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Course not found");
      db.prepare("DELETE FROM courses WHERE id = ?").run(id);
      return existing;
    },
  },

  faculty: {
    async findMany(args = {}) {
      let sql = "SELECT * FROM faculty";
      const params = [];
      if (args.where?.isActive !== undefined) {
        sql += " WHERE isActive = ?";
        params.push(args.where.isActive ? 1 : 0);
      }
      sql += " ORDER BY displayOrder ASC, createdAt DESC";
      if (args.take) {
        sql += " LIMIT ?";
        params.push(args.take);
      }
      const rows = db.prepare(sql).all(...params);
      return rows.map(parseFaculty);
    },
    async findFirst(args = {}) {
      const items = await this.findMany({ ...args, take: 1 });
      return items[0] || null;
    },
    async findUnique(args = {}) {
      const id = args.where?.id;
      if (!id) return null;
      const row = db.prepare("SELECT * FROM faculty WHERE id = ?").get(id);
      return parseFaculty(row);
    },
    async count(args = {}) {
      let sql = "SELECT COUNT(*) as count FROM faculty";
      const params = [];
      if (args.where?.isActive !== undefined) {
        sql += " WHERE isActive = ?";
        params.push(args.where.isActive ? 1 : 0);
      }
      return db.prepare(sql).get(...params).count;
    },
    async create(args = {}) {
      const d = args.data;
      const id = d.id || `fac-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO faculty (
          id, name, designation, subject, qualification, experience,
          bio, profileImage, displayOrder, isActive, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, d.name, d.designation || null, d.subject || null, d.qualification || null,
        d.experience || null, d.bio || null, d.profileImage || null,
        d.displayOrder ?? 0, d.isActive === false ? 0 : 1, now, now
      );

      return this.findUnique({ where: { id } });
    },
    async update(args = {}) {
      const id = args.where?.id;
      const d = args.data;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Faculty member not found");

      const sets = [];
      const params = [];

      if (d.name !== undefined) { sets.push("name = ?"); params.push(d.name); }
      if (d.designation !== undefined) { sets.push("designation = ?"); params.push(d.designation); }
      if (d.subject !== undefined) { sets.push("subject = ?"); params.push(d.subject); }
      if (d.qualification !== undefined) { sets.push("qualification = ?"); params.push(d.qualification); }
      if (d.experience !== undefined) { sets.push("experience = ?"); params.push(d.experience); }
      if (d.bio !== undefined) { sets.push("bio = ?"); params.push(d.bio); }
      if (d.profileImage !== undefined) { sets.push("profileImage = ?"); params.push(d.profileImage); }
      if (d.displayOrder !== undefined) { sets.push("displayOrder = ?"); params.push(d.displayOrder); }
      if (d.isActive !== undefined) { sets.push("isActive = ?"); params.push(d.isActive ? 1 : 0); }

      sets.push("updatedAt = ?");
      params.push(new Date().toISOString());
      params.push(id);

      db.prepare(`UPDATE faculty SET ${sets.join(", ")} WHERE id = ?`).run(...params);
      return this.findUnique({ where: { id } });
    },
    async delete(args = {}) {
      const id = args.where?.id;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Faculty member not found");
      db.prepare("DELETE FROM faculty WHERE id = ?").run(id);
      return existing;
    },
  },

  result: {
    async findMany(args = {}) {
      let sql = "SELECT * FROM results";
      const params = [];
      if (args.where?.isActive !== undefined) {
        sql += " WHERE isActive = ?";
        params.push(args.where.isActive ? 1 : 0);
      }
      sql += " ORDER BY displayOrder ASC, createdAt DESC";
      if (args.take) {
        sql += " LIMIT ?";
        params.push(args.take);
      }
      const rows = db.prepare(sql).all(...params);
      return rows.map(parseResult);
    },
    async findFirst(args = {}) {
      const items = await this.findMany({ ...args, take: 1 });
      return items[0] || null;
    },
    async findUnique(args = {}) {
      const id = args.where?.id;
      if (!id) return null;
      const row = db.prepare("SELECT * FROM results WHERE id = ?").get(id);
      return parseResult(row);
    },
    async count(args = {}) {
      let sql = "SELECT COUNT(*) as count FROM results";
      const params = [];
      if (args.where?.isActive !== undefined) {
        sql += " WHERE isActive = ?";
        params.push(args.where.isActive ? 1 : 0);
      }
      return db.prepare(sql).get(...params).count;
    },
    async create(args = {}) {
      const d = args.data;
      const id = d.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO results (
          id, studentName, exam, year, score, percentile, rank,
          achievementTitle, description, studentImage, displayOrder, isActive, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, d.studentName, d.exam || null, d.year || null, d.score || null,
        d.percentile || null, d.rank || null, d.achievementTitle || null,
        d.description || null, d.studentImage || null, d.displayOrder ?? 0,
        d.isActive === false ? 0 : 1, now, now
      );

      return this.findUnique({ where: { id } });
    },
    async update(args = {}) {
      const id = args.where?.id;
      const d = args.data;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Result record not found");

      const sets = [];
      const params = [];

      if (d.studentName !== undefined) { sets.push("studentName = ?"); params.push(d.studentName); }
      if (d.exam !== undefined) { sets.push("exam = ?"); params.push(d.exam); }
      if (d.year !== undefined) { sets.push("year = ?"); params.push(d.year); }
      if (d.score !== undefined) { sets.push("score = ?"); params.push(d.score); }
      if (d.percentile !== undefined) { sets.push("percentile = ?"); params.push(d.percentile); }
      if (d.rank !== undefined) { sets.push("rank = ?"); params.push(d.rank); }
      if (d.achievementTitle !== undefined) { sets.push("achievementTitle = ?"); params.push(d.achievementTitle); }
      if (d.description !== undefined) { sets.push("description = ?"); params.push(d.description); }
      if (d.studentImage !== undefined) { sets.push("studentImage = ?"); params.push(d.studentImage); }
      if (d.displayOrder !== undefined) { sets.push("displayOrder = ?"); params.push(d.displayOrder); }
      if (d.isActive !== undefined) { sets.push("isActive = ?"); params.push(d.isActive ? 1 : 0); }

      sets.push("updatedAt = ?");
      params.push(new Date().toISOString());
      params.push(id);

      db.prepare(`UPDATE results SET ${sets.join(", ")} WHERE id = ?`).run(...params);
      return this.findUnique({ where: { id } });
    },
    async delete(args = {}) {
      const id = args.where?.id;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Result record not found");
      db.prepare("DELETE FROM results WHERE id = ?").run(id);
      return existing;
    },
  },

  gallery: {
    async findMany(args = {}) {
      let sql = "SELECT * FROM gallery";
      const params = [];
      if (args.where?.isActive !== undefined) {
        sql += " WHERE isActive = ?";
        params.push(args.where.isActive ? 1 : 0);
      }
      sql += " ORDER BY displayOrder ASC, createdAt DESC";
      if (args.take) {
        sql += " LIMIT ?";
        params.push(args.take);
      }
      const rows = db.prepare(sql).all(...params);
      return rows.map(parseGallery);
    },
    async findFirst(args = {}) {
      const items = await this.findMany({ ...args, take: 1 });
      return items[0] || null;
    },
    async findUnique(args = {}) {
      const id = args.where?.id;
      if (!id) return null;
      const row = db.prepare("SELECT * FROM gallery WHERE id = ?").get(id);
      return parseGallery(row);
    },
    async count(args = {}) {
      let sql = "SELECT COUNT(*) as count FROM gallery";
      const params = [];
      if (args.where?.isActive !== undefined) {
        sql += " WHERE isActive = ?";
        params.push(args.where.isActive ? 1 : 0);
      }
      return db.prepare(sql).get(...params).count;
    },
    async create(args = {}) {
      const d = args.data;
      const id = d.id || `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const imgUrl = d.imageUrl || d.mediaUrl || "";

      db.prepare(`
        INSERT INTO gallery (
          id, imageUrl, mediaUrl, mediaType, cloudinaryPublicId,
          title, description, category, displayOrder, isActive, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, imgUrl, d.mediaUrl || imgUrl, d.mediaType || "IMAGE",
        d.cloudinaryPublicId || null, d.title || null, d.description || null,
        d.category || null, d.displayOrder ?? 0, d.isActive === false ? 0 : 1, now, now
      );

      return this.findUnique({ where: { id } });
    },
    async update(args = {}) {
      const id = args.where?.id;
      const d = args.data;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Gallery item not found");

      const sets = [];
      const params = [];

      if (d.imageUrl !== undefined) { sets.push("imageUrl = ?"); params.push(d.imageUrl); }
      if (d.mediaUrl !== undefined) { sets.push("mediaUrl = ?"); params.push(d.mediaUrl); }
      if (d.mediaType !== undefined) { sets.push("mediaType = ?"); params.push(d.mediaType); }
      if (d.cloudinaryPublicId !== undefined) { sets.push("cloudinaryPublicId = ?"); params.push(d.cloudinaryPublicId); }
      if (d.title !== undefined) { sets.push("title = ?"); params.push(d.title); }
      if (d.description !== undefined) { sets.push("description = ?"); params.push(d.description); }
      if (d.category !== undefined) { sets.push("category = ?"); params.push(d.category); }
      if (d.displayOrder !== undefined) { sets.push("displayOrder = ?"); params.push(d.displayOrder); }
      if (d.isActive !== undefined) { sets.push("isActive = ?"); params.push(d.isActive ? 1 : 0); }

      sets.push("updatedAt = ?");
      params.push(new Date().toISOString());
      params.push(id);

      db.prepare(`UPDATE gallery SET ${sets.join(", ")} WHERE id = ?`).run(...params);
      return this.findUnique({ where: { id } });
    },
    async delete(args = {}) {
      const id = args.where?.id;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Gallery item not found");
      db.prepare("DELETE FROM gallery WHERE id = ?").run(id);
      return existing;
    },
  },

  institute: {
    async findFirst(args = {}) {
      const row = db.prepare("SELECT * FROM institute ORDER BY createdAt ASC LIMIT 1").get();
      return parseInstitute(row);
    },
    async findUnique(args = {}) {
      const id = args.where?.id;
      if (!id) return null;
      const row = db.prepare("SELECT * FROM institute WHERE id = ?").get(id);
      return parseInstitute(row);
    },
    async create(args = {}) {
      const d = args.data;
      const id = d.id || `inst-${Date.now()}`;
      const now = new Date().toISOString();
      const heroUrl = d.heroImageUrl || d.heroMediaUrl || "";
      const pubId = d.heroCloudinaryPublicId || d.heroImagePublicId || null;

      db.prepare(`
        INSERT INTO institute (
          id, name, phone, whatsappNumber, email, address, workingHours,
          facebookUrl, instagramUrl, youtubeUrl, linkedinUrl, about,
          heroImageUrl, heroImagePublicId, heroCloudinaryPublicId, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, d.name, d.phone || null, d.whatsappNumber || null, d.email || null,
        d.address || null, d.workingHours || null, d.facebookUrl || null,
        d.instagramUrl || null, d.youtubeUrl || null, d.linkedinUrl || null,
        d.about || null, heroUrl, pubId, pubId, now, now
      );

      return this.findUnique({ where: { id } });
    },
    async update(args = {}) {
      const id = args.where?.id;
      const d = args.data;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Institute information not found");

      const sets = [];
      const params = [];

      if (d.name !== undefined) { sets.push("name = ?"); params.push(d.name); }
      if (d.phone !== undefined) { sets.push("phone = ?"); params.push(d.phone); }
      if (d.whatsappNumber !== undefined) { sets.push("whatsappNumber = ?"); params.push(d.whatsappNumber); }
      if (d.email !== undefined) { sets.push("email = ?"); params.push(d.email); }
      if (d.address !== undefined) { sets.push("address = ?"); params.push(d.address); }
      if (d.workingHours !== undefined) { sets.push("workingHours = ?"); params.push(d.workingHours); }
      if (d.facebookUrl !== undefined) { sets.push("facebookUrl = ?"); params.push(d.facebookUrl); }
      if (d.instagramUrl !== undefined) { sets.push("instagramUrl = ?"); params.push(d.instagramUrl); }
      if (d.youtubeUrl !== undefined) { sets.push("youtubeUrl = ?"); params.push(d.youtubeUrl); }
      if (d.linkedinUrl !== undefined) { sets.push("linkedinUrl = ?"); params.push(d.linkedinUrl); }
      if (d.about !== undefined) { sets.push("about = ?"); params.push(d.about); }
      if (d.heroImageUrl !== undefined || d.heroMediaUrl !== undefined) {
        const url = d.heroImageUrl !== undefined ? d.heroImageUrl : d.heroMediaUrl;
        sets.push("heroImageUrl = ?");
        params.push(url);
      }
      if (d.heroCloudinaryPublicId !== undefined || d.heroImagePublicId !== undefined) {
        const pub = d.heroCloudinaryPublicId !== undefined ? d.heroCloudinaryPublicId : d.heroImagePublicId;
        sets.push("heroCloudinaryPublicId = ?");
        sets.push("heroImagePublicId = ?");
        params.push(pub);
        params.push(pub);
      }

      sets.push("updatedAt = ?");
      params.push(new Date().toISOString());
      params.push(id);

      db.prepare(`UPDATE institute SET ${sets.join(", ")} WHERE id = ?`).run(...params);
      return this.findUnique({ where: { id } });
    },
  },

  enquiry: {
    async findMany(args = {}) {
      let sql = "SELECT * FROM enquiries";
      const params = [];
      if (args.where?.status) {
        sql += " WHERE status = ?";
        params.push(args.where.status);
      }
      sql += " ORDER BY createdAt DESC";
      if (args.take) {
        sql += " LIMIT ?";
        params.push(args.take);
      }
      return db.prepare(sql).all(...params);
    },
    async findFirst(args = {}) {
      const items = await this.findMany({ ...args, take: 1 });
      return items[0] || null;
    },
    async findUnique(args = {}) {
      const id = args.where?.id;
      if (!id) return null;
      return db.prepare("SELECT * FROM enquiries WHERE id = ?").get(id) || null;
    },
    async count(args = {}) {
      let sql = "SELECT COUNT(*) as count FROM enquiries";
      const params = [];
      if (args.where?.status) {
        sql += " WHERE status = ?";
        params.push(args.where.status);
      }
      return db.prepare(sql).get(...params).count;
    },
    async create(args = {}) {
      const d = args.data;
      const id = d.id || `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO enquiries (
          id, studentName, parentName, phoneNumber, email, studentClass,
          interestedCourse, message, status, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, d.studentName, d.parentName || null, d.phoneNumber, d.email || null,
        d.studentClass || null, d.interestedCourse || null, d.message || null,
        d.status || "NEW", now, now
      );

      return this.findUnique({ where: { id } });
    },
    async update(args = {}) {
      const id = args.where?.id;
      const d = args.data;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Enquiry not found");

      const sets = [];
      const params = [];
      if (d.status !== undefined) { sets.push("status = ?"); params.push(d.status); }
      sets.push("updatedAt = ?");
      params.push(new Date().toISOString());
      params.push(id);

      db.prepare(`UPDATE enquiries SET ${sets.join(", ")} WHERE id = ?`).run(...params);
      return this.findUnique({ where: { id } });
    },
    async delete(args = {}) {
      const id = args.where?.id;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Enquiry not found");
      db.prepare("DELETE FROM enquiries WHERE id = ?").run(id);
      return existing;
    },
  },

  admin: {
    async findUnique(args = {}) {
      const { email, id } = args.where || {};
      if (email) {
        const row = db.prepare("SELECT * FROM admins WHERE email = ?").get(email.toLowerCase().trim());
        return parseAdmin(row);
      }
      if (id) {
        const row = db.prepare("SELECT * FROM admins WHERE id = ?").get(id);
        return parseAdmin(row);
      }
      return null;
    },
    async findFirst(args = {}) {
      const row = db.prepare("SELECT * FROM admins LIMIT 1").get();
      return parseAdmin(row);
    },
    async count() {
      return db.prepare("SELECT COUNT(*) as count FROM admins").get().count;
    },
    async create(args = {}) {
      const d = args.data;
      const id = d.id || `admin-${Date.now()}`;
      const now = new Date().toISOString();
      const email = d.email.toLowerCase().trim();

      db.prepare(`
        INSERT INTO admins (id, name, email, passwordHash, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, d.name, email, d.passwordHash, d.isActive === false ? 0 : 1, now, now);

      return this.findUnique({ where: { id } });
    },
    async update(args = {}) {
      const id = args.where?.id;
      const d = args.data;
      const existing = await this.findUnique({ where: { id } });
      if (!existing) throw new Error("Admin not found");

      const sets = [];
      const params = [];
      if (d.name !== undefined) { sets.push("name = ?"); params.push(d.name); }
      if (d.passwordHash !== undefined) { sets.push("passwordHash = ?"); params.push(d.passwordHash); }
      if (d.isActive !== undefined) { sets.push("isActive = ?"); params.push(d.isActive ? 1 : 0); }
      sets.push("updatedAt = ?");
      params.push(new Date().toISOString());
      params.push(id);

      db.prepare(`UPDATE admins SET ${sets.join(", ")} WHERE id = ?`).run(...params);
      return this.findUnique({ where: { id } });
    },
  },

  async $queryRaw() {
    return [{ 1: 1 }];
  },
  async $connect() {
    return true;
  },
  async $disconnect() {
    return true;
  },
};

module.exports = sqlitePrisma;
