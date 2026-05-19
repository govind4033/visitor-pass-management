

// Generated content by AI
// currently learning seeding use


require('dotenv').config();
const mongoose    = require('mongoose');
const bcrypt      = require('bcryptjs');
const crypto      = require('crypto');
const User        = require('./Models/User');
const Visitor     = require('./Models/Visitor');
const Appointment = require('./Models/Appointment');
const Pass        = require('./Models/Pass');
const CheckLog    = require('./Models/CheckLog');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // Clear all collections first
  await Promise.all([
    User.deleteMany(),
    Visitor.deleteMany(),
    Appointment.deleteMany(),
    Pass.deleteMany(),
    CheckLog.deleteMany()
  ]);
  console.log('Collections cleared');

  // ── Users ──────────────────────────────────────────
  const hash = (pw) => bcrypt.hash(pw, 10);

  const [admin, security, emp1, emp2] = await User.create([
    { name: 'Super Admin',   email: 'admin@vpms.com',    password: await hash('admin123'),    role: 'admin' },
    { name: 'Ravi Security',  email: 'security@vpms.com', password: await hash('security123'), role: 'security' },
    { name: 'Priya Sharma',   email: 'emp1@vpms.com',    password: await hash('emp123'),     role: 'employee', department: 'Engineering' },
    { name: 'Arjun Mehta',    email: 'emp2@vpms.com',    password: await hash('emp123'),     role: 'employee', department: 'Sales' }
  ]);
  console.log('Users created');

  // ── Visitors ────────────────────────────────────────
  const visitorsData = [
    { name:'Rahul Joshi',   email:'rahul@example.com',  phone:'9876543210', company:'TechCorp',  purpose:'Interview',       status:'checked-out', hostEmployee: emp1._id },
    { name:'Neha Kapoor',   email:'neha@example.com',   phone:'9876543211', company:'DesignCo',  purpose:'Client Meeting', status:'checked-in',  hostEmployee: emp2._id },
    { name:'Amit Patel',    email:'amit@example.com',   phone:'9876543212', company:'StartupXYZ',purpose:'Demo',            status:'pre-registered',hostEmployee: emp1._id },
    { name:'Sunita Rao',    email:'sunita@example.com', phone:'9876543213', company:'GovDept',   purpose:'Audit',           status:'pre-registered',hostEmployee: emp2._id },
    { name:'Vikram Singh',  email:'vikram@example.com', phone:'9876543214', company:'Freelance', purpose:'Delivery',        status:'checked-out', hostEmployee: emp1._id }
  ];

  const visitors = await Promise.all(
    visitorsData.map(v => Visitor.create({ ...v, registeredBy: security._id, visitDate: new Date() }))
  );
  console.log('Visitors created');

  // ── Appointments ────────────────────────────────────
  const tomorrow = new Date(Date.now() + 864e5);
  const yesterday= new Date(Date.now() - 864e5);

  const [appt1, appt2, appt3] = await Appointment.create([
    { visitor: visitors[2]._id, host: emp1._id, scheduledAt: tomorrow,  purpose: 'Demo',           status: 'pending' },
    { visitor: visitors[1]._id, host: emp2._id, scheduledAt: new Date(),purpose: 'Client Meeting', status: 'approved',  approvedBy: admin._id, approvedAt: new Date() },
    { visitor: visitors[0]._id, host: emp1._id, scheduledAt: yesterday, purpose: 'Interview',      status: 'completed', approvedBy: admin._id, approvedAt: yesterday }
  ]);
  console.log('Appointments created');

  // ── Passes ──────────────────────────────────────────
  const mkCode = () => `VPMS-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const midnight = new Date(); midnight.setHours(23,59,59,999);

  const [pass1, pass2] = await Pass.create([
    { visitor: visitors[1]._id, appointment: appt2._id, passCode: mkCode(), qrCodeUrl: 'placeholder.png', pdfUrl: 'placeholder.pdf', issuedBy: security._id, expiresAt: midnight, status: 'active' },
    { visitor: visitors[0]._id, appointment: appt3._id, passCode: mkCode(), qrCodeUrl: 'placeholder.png', pdfUrl: 'placeholder.pdf', issuedBy: security._id, expiresAt: yesterday, status: 'used' }
  ]);
  console.log('Passes created');

  // ── CheckLogs ────────────────────────────────────────
  const daysAgo = (n) => new Date(Date.now() - n * 864e5);

  await CheckLog.create([
    { pass: pass2._id, visitor: visitors[0]._id, type: 'check-in',  scannedBy: security._id, timestamp: daysAgo(1), location: 'Main Gate' },
    { pass: pass2._id, visitor: visitors[0]._id, type: 'check-out', scannedBy: security._id, timestamp: daysAgo(1), location: 'Main Gate' },
    { pass: pass1._id, visitor: visitors[1]._id, type: 'check-in',  scannedBy: security._id, timestamp: new Date(), location: 'Main Gate' },
    ...Array.from({ length: 7 }, (_, i) => ({
      pass: pass2._id, visitor: visitors[i % 2]._id,
      type: i % 2 === 0 ? 'check-in' : 'check-out',
      scannedBy: security._id,
      timestamp: daysAgo(i + 2),
      location: i % 2 === 0 ? 'Main Gate' : 'Gate B'
    }))
  ]);
  console.log('CheckLogs created');

  console.log('✓ Seed complete!');
  console.log('  admin@vpms.com     / admin123');
  console.log('  security@vpms.com  / security123');
  console.log('  emp1@vpms.com      / emp123');
  console.log('  emp2@vpms.com      / emp123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });