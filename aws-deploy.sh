#!/bin/bash
# AWS EC2 Automated Deployment Script for E-Commerce Final Project

echo "================================================="
echo "  Deploying E-Commerce Full-Stack App to AWS EC2  "
echo "================================================="

# Update server packages
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose git

# Start & Enable Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Pull latest code or build containers
echo "[1/3] Building and Starting Docker Containers..."
docker-compose down
docker-compose up -d --build

echo "[2/3] Verifying Running Containers..."
docker ps

echo "[3/3] Deployment Successful!"
echo "Frontend: http://$(curl -s ifconfig.me):3000"
echo "Backend REST API: http://$(curl -s ifconfig.me):5000/api/health"
