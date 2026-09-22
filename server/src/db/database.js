import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { calculateRiskScore } from '../services/riskEngine.js';

const dbDir = process.env.DB_DIR || path.resolve(process.cwd(), 'src/db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'shadow_risk.db');
let dbInstance = null;
let inTransaction = false;

function saveDb() {
  if (dbInstance && !inTransaction) {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export async function initDatabase() {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    dbInstance = new SQL.Database(filebuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  // Create Tables
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      data_sensitivity TEXT NOT NULL,
      has_compliance INTEGER NOT NULL DEFAULT 0,
      has_breach_history INTEGER NOT NULL DEFAULT 0,
      approved_by_it INTEGER NOT NULL DEFAULT 1,
      risk_score INTEGER NOT NULL,
      risk_level TEXT NOT NULL,
      is_shadow INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      owner_department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS detection_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER,
      vendor_name TEXT NOT NULL,
      employee_name TEXT,
      employee_email TEXT,
      detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vendor_id) REFERENCES vendors(id)
    );
  `);

  saveDb();
  seedDefaultData();
}

// Database helper object providing synchronous-like API matching better-sqlite3
const db = {
  prepare(sql) {
    return {
      get(...params) {
        const stmt = dbInstance.prepare(sql);
        stmt.bind(params);
        let result = null;
        if (stmt.step()) {
          result = stmt.getAsObject();
        }
        stmt.free();
        return result;
      },
      all(...params) {
        const stmt = dbInstance.prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
      run(...params) {
        dbInstance.run(sql, params);
        const res = dbInstance.exec("SELECT last_insert_rowid() as id");
        const lastInsertRowid = res[0] && res[0].values[0] ? res[0].values[0][0] : null;
        saveDb();
        return { lastInsertRowid };
      }
    };
  },
  exec(sql) {
    dbInstance.run(sql);
    saveDb();
  },
  transaction(fn) {
    return (...args) => {
      inTransaction = true;
      dbInstance.run("BEGIN TRANSACTION");
      try {
        const result = fn(...args);
        dbInstance.run("COMMIT");
        inTransaction = false;
        saveDb();
        return result;
      } catch (err) {
        inTransaction = false;
        try {
          dbInstance.run("ROLLBACK");
        } catch (rollbackErr) {
          console.error("Rollback also failed (transaction may have auto-closed):", rollbackErr.message);
        }
        console.error("Original transaction error:", err.message, err.stack);
        throw err;
      }
    };
  }
};

function seedDefaultData() {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run('Security Admin', 'admin@organization.com', hashedPassword, 'admin');
    console.log('✅ Default admin user created (admin@organization.com / admin123)');
  }

  const vendorCount = db.prepare('SELECT count(*) as count FROM vendors').get().count;
  if (vendorCount === 0) {
    const seedVendors = [
      {
        name: 'ChatGPT Plus / OpenAI API',
        category: 'AI Tool',
        data_sensitivity: 'High',
        has_compliance: 1,
        has_breach_history: 0,
        approved_by_it: 1,
        description: 'Generative AI assistant used across marketing and product teams.',
        owner_department: 'Engineering & Product'
      },
      {
        name: 'DeepSeek Code Assistant',
        category: 'AI Tool',
        data_sensitivity: 'High',
        has_compliance: 0,
        has_breach_history: 0,
        approved_by_it: 0,
        description: 'Unsanctioned AI code generator detected on developer workstations.',
        owner_department: 'Software Development'
      },
      {
        name: 'Midjourney',
        category: 'AI Tool',
        data_sensitivity: 'Medium',
        has_compliance: 0,
        has_breach_history: 0,
        approved_by_it: 0,
        description: 'AI image generator used by design team without IT review.',
        owner_department: 'Design & Branding'
      },
      {
        name: 'Salesforce CRM',
        category: 'SaaS Vendor',
        data_sensitivity: 'High',
        has_compliance: 1,
        has_breach_history: 0,
        approved_by_it: 1,
        description: 'Core customer relationship management platform.',
        owner_department: 'Sales & Revenue'
      },
      {
        name: 'Free PDF Compressor Online',
        category: 'SaaS Vendor',
        data_sensitivity: 'High',
        has_compliance: 0,
        has_breach_history: 1,
        approved_by_it: 0,
        description: 'Public Web utility used to shrink PDF financial reports.',
        owner_department: 'Finance & Operations'
      },
      {
        name: 'GitHub Enterprise',
        category: 'Cloud Provider',
        data_sensitivity: 'High',
        has_compliance: 1,
        has_breach_history: 0,
        approved_by_it: 1,
        description: 'Source code management and CI/CD pipeline hosting.',
        owner_department: 'DevOps'
      },
      {
        name: 'Notion AI Workspace',
        category: 'SaaS Vendor',
        data_sensitivity: 'Medium',
        has_compliance: 1,
        has_breach_history: 0,
        approved_by_it: 1,
        description: 'Team documentation and internal knowledge base with AI summary.',
        owner_department: 'Human Resources'
      },
      {
        name: 'Crypto Trading Bot AI',
        category: 'AI Tool',
        data_sensitivity: 'High',
        has_compliance: 0,
        has_breach_history: 1,
        approved_by_it: 0,
        description: 'External automated script uploading financial API keys to cloud server.',
        owner_department: 'Unknown / Shadow'
      },
      {
        name: 'Grammarly Business',
        category: 'AI Tool',
        data_sensitivity: 'Medium',
        has_compliance: 1,
        has_breach_history: 0,
        approved_by_it: 1,
        description: 'Writing feedback and communication grammar check extension.',
        owner_department: 'Marketing & Comm'
      },
      {
        name: 'Canva Pro',
        category: 'SaaS Vendor',
        data_sensitivity: 'Low',
        has_compliance: 1,
        has_breach_history: 0,
        approved_by_it: 1,
        description: 'Graphic design tool for social media banners.',
        owner_department: 'Marketing'
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO vendors (
        name, category, data_sensitivity, has_compliance,
        has_breach_history, approved_by_it, risk_score,
        risk_level, is_shadow, description, owner_department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const v of seedVendors) {
      const { risk_score, risk_level, is_shadow } = calculateRiskScore(v);
      insertStmt.run(
        v.name,
        v.category,
        v.data_sensitivity,
        v.has_compliance,
        v.has_breach_history,
        v.approved_by_it,
        risk_score,
        risk_level,
        is_shadow,
        v.description,
        v.owner_department
      );
    }

    console.log(`✅ Seeded ${seedVendors.length} initial vendors and AI tools into WASM SQLite database.`);
  }
}

export default db;
