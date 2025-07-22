# Express PostgreSQL Docker Tutorial

A simple Express.js application with PostgreSQL database, running in Docker containers. The application displays users and their orders in a clean web interface.

## Local Development Setup

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development without Docker)
- Git

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd express-docker-tutorial
```

2. Start the application with Docker Compose:
```bash
docker-compose up --build
```

3. Access the application at http://localhost:3001

The application will automatically:
- Create the PostgreSQL database
- Run all migrations
- Start the web server

### Development Without Docker

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=express_tutorial
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

3. Start the application:
```bash
npm run dev
```

## EC2 Deployment

### Initial Server Setup

1. SSH into your EC2 instance:
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

2. Install Docker and Git:
```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo yum install git -y
```

3. Log out and log back in for docker group changes to take effect:
```bash
exit
ssh -i your-key.pem ec2-user@your-ec2-ip
```

### First-Time Deployment

1. Clone the repository:
```bash
git clone <repository-url>
cd express-docker-tutorial
```

2. Start the application:
```bash
docker-compose up -d --build
```

### Updating the Deployment

When you need to update the application with new changes:

1. SSH into the EC2 instance:
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

2. Navigate to the project directory:
```bash
cd express-docker-tutorial
```

3. Pull the latest changes:
```bash
git pull origin main
```

4. Rebuild and restart the containers:
```bash
docker-compose down
docker-compose up -d --build
```

### Monitoring and Maintenance

#### View Logs
```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs app
docker-compose logs db
```

#### Container Management
```bash
# Stop containers
docker-compose down

# Start containers
docker-compose up -d

# Restart specific service
docker-compose restart app
```

#### Database Backups

1. Create a backup:
```bash
docker-compose exec db pg_dump -U postgres express_tutorial > backup.sql
```

2. Restore from backup:
```bash
# Stop the application
docker-compose down

# Start only the database
docker-compose up -d db

# Wait a few seconds for the database to start
sleep 5

# Restore the backup
cat backup.sql | docker-compose exec -T db psql -U postgres express_tutorial

# Start the entire application
docker-compose up -d
```

### Security Considerations

1. Update the `.env` file on EC2 with secure credentials
2. Configure EC2 security groups to allow only necessary ports:
   - Port 3001 for the web application
   - Your IP for SSH access (port 22)

3. Use environment variables for sensitive data:
```bash
# Example of setting environment variables in docker-compose
docker-compose up -d \
  -e POSTGRES_PASSWORD=secure_password \
  -e NODE_ENV=production
```

### Troubleshooting

1. Container won't start:
```bash
# Check container status
docker-compose ps

# Check detailed logs
docker-compose logs --tail=100 app
```

2. Database connection issues:
```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db
```

3. Clean restart:
```bash
# Remove containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

## Project Structure

```
express-docker-tutorial/
├── src/
│   ├── index.ts           # Main application entry
│   └── services/
│       └── database.ts    # Database connection and queries
├── migrations/            # Database migrations
├── Dockerfile            # Application container definition
├── docker-compose.yaml   # Container orchestration
└── package.json         # Project dependencies
```

## Making Changes

1. Database Changes:
```bash
# Create a new migration
npm run migrate:create my_migration_name

# Apply migrations
npm run migrate:up

# Rollback migrations
npm run migrate:down
```

2. Application Changes:
- Modify the code locally
- Test with `npm run dev`
- Commit and push changes
- Follow the "Updating the Deployment" section above

## Contributing

1. Create a new branch:
```bash
git checkout -b feature/your-feature
```

2. Make your changes and commit:
```bash
git add .
git commit -m "Description of changes"
```

3. Push and create a pull request:
```bash
git push origin feature/your-feature
``` 