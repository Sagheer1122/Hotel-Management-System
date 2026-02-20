# PostgreSQL Setup Guide for HMS

## Problem
Rails cannot connect to PostgreSQL because it's not installed or not running.

## Solutions

### **Option 1: Install PostgreSQL (Recommended for Production)**

#### Step 1: Download and Install
1. Go to: https://www.postgresql.org/download/windows/
2. Download the PostgreSQL installer (version 16 recommended)
3. Run the installer
4. **IMPORTANT**: Set a password for the `postgres` user (e.g., "password")
5. Keep default port: **5432**
6. Install all components (PostgreSQL Server, pgAdmin, Command Line Tools)

#### Step 2: Start PostgreSQL Service
After installation, PostgreSQL should start automatically. If not:

**Method A: Using Services**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "postgresql-x64-16" (or similar)
4. Right-click → Start

**Method B: Using Command Line (Run as Administrator)**
```powershell
net start postgresql-x64-16
```

#### Step 3: Update Database Configuration
Edit `hms-api/config/database.yml`:
```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: postgres
  password: password  # Use the password you set during installation
  host: localhost

development:
  <<: *default
  database: hms_development

test:
  <<: *default
  database: hms_test

production:
  <<: *default
  database: hms_production
```

#### Step 4: Create Database
```bash
cd hms-api
rails db:create
rails db:migrate
```

---

### **Option 2: Use Docker (Fastest Setup)**

If you have Docker Desktop installed:

#### Step 1: Start PostgreSQL Container
```bash
# From the HMS root directory
docker-compose up -d
```

This will:
- Download PostgreSQL 16 image
- Start PostgreSQL on port 5432
- Create database automatically
- Use credentials: username=postgres, password=password

#### Step 2: Verify Container is Running
```bash
docker ps
```

You should see `hms_postgres` container running.

#### Step 3: Create Database
```bash
cd hms-api
rails db:create
rails db:migrate
```

#### Stop PostgreSQL (when done)
```bash
docker-compose down
```

---

### **Option 3: Use Hosted PostgreSQL (Cloud)**

Free options:
- **Supabase**: https://supabase.com (Free tier available)
- **ElephantSQL**: https://www.elephantsql.com (Free 20MB)
- **Render**: https://render.com (Free PostgreSQL)

After creating a database, update `config/database.yml` with the connection URL.

---

## Quick Troubleshooting

### Check if PostgreSQL is running:
```powershell
# Check service status
Get-Service -Name postgresql*

# Or try connecting
psql -U postgres -h localhost
```

### Common Issues:

**1. Port 5432 already in use**
- Another PostgreSQL instance is running
- Check Task Manager and stop it
- Or change port in `database.yml`

**2. Password authentication failed**
- Check password in `database.yml` matches installation password
- Try resetting postgres user password

**3. Connection refused**
- PostgreSQL service is not running
- Start the service using methods above

---

## Recommended: Docker Approach

**Pros:**
✅ No system installation needed
✅ Easy to start/stop
✅ Consistent across environments
✅ No conflicts with other apps

**Cons:**
❌ Requires Docker Desktop
❌ Uses more disk space

---

## After PostgreSQL is Running

1. **Create and migrate database:**
```bash
cd hms-api
rails db:create
rails db:migrate
```

2. **Start Rails server:**
```bash
rails server
```

3. **Verify connection:**
- You should see: "Listening on http://127.0.0.1:3000"
- No database connection errors

---

## Need Help?

If you're still having issues:
1. Check PostgreSQL is running: `Get-Service postgresql*`
2. Check port 5432 is open: `netstat -an | findstr 5432`
3. Verify credentials in `config/database.yml`
4. Check Rails logs: `tail -f log/development.log`
