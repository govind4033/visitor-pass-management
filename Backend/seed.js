require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Pass = require("./models/Pass");
const CheckLog = require("./models/CheckLog");

const DEPARTMENTS = [
  "Engineering",
  "HR",
  "Finance",
  "Sales",
  "Marketing",
  "Operations",
];

const PURPOSES = [
  "Interview",
  "Client Meeting",
  "Project Discussion",
  "Vendor Visit",
  "Document Submission",
  "Training Session",
  "Audit",
  "Partnership Discussion",
];

const randomItem = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomFutureDate = (days = 15) => {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * days) + 1);
  return d;
};

const randomPastDate = (days = 15) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days) - 1);
  return d;
};

const generatePassCode = () => {
  return `VPMS-${new Date().getFullYear()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to database");

    await Promise.all([
      User.deleteMany({}),
      Appointment.deleteMany({}),
      Pass.deleteMany({}),
      CheckLog.deleteMany({}),
    ]);

    console.log("Collections cleared");

    const passwordHash = await hashPassword("Password@123");

    // ==========================
    // ADMIN
    // ==========================

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@vpms.com",
      password: passwordHash,
      role: "admin",
      phone: "9999999999",
    });

    // ==========================
    // SECURITY
    // ==========================

    const securities = await User.create([
      {
        name: "Security Guard 1",
        email: "security1@vpms.com",
        password: passwordHash,
        role: "security",
      },
      {
        name: "Security Guard 2",
        email: "security2@vpms.com",
        password: passwordHash,
        role: "security",
      },
      {
        name: "Security Guard 3",
        email: "security3@vpms.com",
        password: passwordHash,
        role: "security",
      },
    ]);

    // ==========================
    // EMPLOYEES
    // ==========================

    const employees = [];

    for (let i = 1; i <= 10; i++) {
      employees.push({
        name: `Employee ${i}`,
        email: `employee${i}@vpms.com`,
        password: passwordHash,
        role: "employee",
        department: randomItem(DEPARTMENTS),
        phone: `98765000${String(i).padStart(2, "0")}`,
      });
    }

    const employeeUsers = await User.insertMany(employees);

    // ==========================
    // VISITORS
    // ==========================

    const visitors = [];

    for (let i = 1; i <= 25; i++) {
      visitors.push({
        name: `Visitor ${i}`,
        email: `visitor${i}@gmail.com`,
        password: passwordHash,
        role: "visitor",
        phone: `90000000${String(i).padStart(2, "0")}`,
      });
    }

    const visitorUsers = await User.insertMany(visitors);

    console.log("Users created");

    // ==========================
    // APPOINTMENTS
    // ==========================

    const appointments = [];

    const statuses = [
      ...Array(15).fill("approved"),
      ...Array(10).fill("pending"),
      ...Array(10).fill("completed"),
      ...Array(8).fill("rejected"),
      ...Array(7).fill("cancelled"),
    ];

    for (const status of statuses) {
      const visitor = randomItem(visitorUsers);
      const host = randomItem(employeeUsers);

      const appointment = {
        visitor: visitor._id,
        host: host._id,
        purpose: randomItem(PURPOSES),
        status,
      };

      if (status === "approved" || status === "pending") {
        appointment.scheduledAt = randomFutureDate();
      } else {
        appointment.scheduledAt = randomPastDate();
      }

      if (["approved", "completed"].includes(status)) {
        appointment.approvedBy = admin._id;
        appointment.approvedAt = randomPastDate();
      }

      appointments.push(appointment);
    }

    const appointmentDocs =
      await Appointment.insertMany(appointments);

    console.log("Appointments created");

    // ==========================
    // PASSES
    // ==========================

    const passDocs = [];

    const validAppointments = appointmentDocs.filter((a) =>
      ["approved", "completed"].includes(a.status)
    );

    for (const appointment of validAppointments) {
      const status =
        Math.random() < 0.4
          ? "active"
          : Math.random() < 0.7
          ? "checked-in"
          : "used";

      const pass = await Pass.create({
        visitor: appointment.visitor,
        appointment: appointment._id,
        passCode: generatePassCode(),
        qrCodeUrl: `https://dummy.qr/${crypto.randomUUID()}`,
        pdfUrl: `https://dummy.pdf/${crypto.randomUUID()}.pdf`,
        issuedBy: randomItem(securities)._id,
        status,
      });

      passDocs.push(pass);
    }

    console.log("Passes created");

    // ==========================
    // CHECK LOGS
    // ==========================

    const logs = [];

    for (const pass of passDocs) {
      const security = randomItem(securities);

      if (pass.status === "checked-in") {
        logs.push({
          pass: pass._id,
          visitor: pass.visitor,
          type: "check-in",
          scannedBy: security._id,
          timestamp: new Date(),
        });
      }

      if (pass.status === "used") {
        const checkInTime = randomPastDate(5);

        logs.push({
          pass: pass._id,
          visitor: pass.visitor,
          type: "check-in",
          scannedBy: security._id,
          timestamp: checkInTime,
        });

        logs.push({
          pass: pass._id,
          visitor: pass.visitor,
          type: "check-out",
          scannedBy: security._id,
          timestamp: new Date(
            checkInTime.getTime() + 2 * 60 * 60 * 1000
          ),
        });
      }
    }

    await CheckLog.insertMany(logs);

    console.log("CheckLogs created");

    console.log("\n===== DEMO ACCOUNTS =====");

    console.log("admin@vpms.com");
    console.log("security1@vpms.com");
    console.log("employee1@vpms.com");
    console.log("visitor1@gmail.com");

    console.log("\nPassword: Password@123");

    console.log("\nSeed completed successfully");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();