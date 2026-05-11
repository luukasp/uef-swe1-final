#!/usr/bin/env bash

set -e

#### Helper functions ####
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

compare_versions() {
    # Returns 0 if $1 >= $2
    [ "$(printf '%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

#### Check Docker ####
echo "Checking for Docker..."
if command_exists docker; then
    echo "Docker is installed: $(docker --version)"
else
    echo "Docker is not installed."
    read -p "Do you want to install Docker? [Y/n] " yn
    case "$yn" in
        [Nn]* )
            echo "Checking for PostgreSQL..."
            if command_exists psql; then
                echo "PostgreSQL is already installed: $(psql --version)"
            else
                echo "Installing PostgreSQL..."
                if command_exists apt-get; then
                    sudo apt-get update
                    sudo apt-get install -y postgresql postgresql-contrib
                elif command_exists dnf; then
                    sudo dnf install -y postgresql-server postgresql-contrib
                elif command_exists pacman; then
                    sudo pacman -Sy postgresql
                else
                    echo "Unsupported package manager. Please install PostgreSQL manually."
                    exit 1
                fi
                echo "PostgreSQL installed."
            fi
            ;;
        * )
            echo "Please install Docker following instructions at https://docs.docker.com/get-docker/"
            exit 1
            ;;
    esac
fi

#### Check Node.js ####
MIN_NODE_VERSION="20.20.0"
has_node=0

if command_exists node; then
    NODE_VERSION=$(node -v | sed 's/v//')
    if compare_versions "$NODE_VERSION" "$MIN_NODE_VERSION"; then
        echo "Node.js version $NODE_VERSION is sufficient."
        has_node=1
    else
        echo "Node.js version $NODE_VERSION is too old. Need $MIN_NODE_VERSION or greater."
    fi
else
    echo "Node.js is not installed."
fi

if [ "$has_node" -eq 0 ]; then
    # Try to install nvm (Node Version Manager)
    if ! command_exists curl; then
        echo "curl needed to install NVM. Please install curl and rerun the script."
        exit 1
    fi
    echo "Installing NVM (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install $MIN_NODE_VERSION
    nvm use $MIN_NODE_VERSION
    echo "Node.js $(node -v) installed."
fi

echo "All requirements satisfied."

# --- DATABASE VARIABLES ---
echo "Enter database credentials:"
read -p "DB_USER: " DB_USER
read -p "DB_PASSWORD: " DB_PASSWORD
read -p "DB_SCHEMA_NAME: " DB_SCHEMA_NAME
read -p "DB_HOST_PORT (e.g. localhost:5432): " DB_HOST_PORT

cat > .docker/.env <<EOF
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_SCHEMA_NAME=$DB_SCHEMA_NAME
DB_HOST_PORT=$DB_HOST_PORT
EOF

# --- BACKEND VARIABLES ---
echo "Enter backend server port (e.g. 3001):"
read -p "PORT: " PORT
read -p "What will be the protocol for your backend URL? (http or https): " BACKEND_PROTO
read -p "Enter the backend server host (e.g. localhost): " BACKEND_HOST

DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST_PORT}/${DB_SCHEMA_NAME}"

read -p "BETTER_AUTH_SECRET (choose a random strong secret): " BETTER_AUTH_SECRET
BETTER_AUTH_URL="${BACKEND_PROTO}://${BACKEND_HOST}:${PORT}"
read -p "Enter frontend server port (e.g. 5173): " FRONTEND_PORT
FRONTEND_URL="${BACKEND_PROTO}://${BACKEND_HOST}:${FRONTEND_PORT}"

# Optional section
echo "OPTIONAL: Enter OAuth client IDs/secrets or leave blank to skip."
read -p "GOOGLE_CLIENT_ID (or leave empty): " GOOGLE_CLIENT_ID
read -p "GOOGLE_CLIENT_SECRET (or leave empty): " GOOGLE_CLIENT_SECRET
read -p "MICROSOFT_CLIENT_ID (or leave empty): " MICROSOFT_CLIENT_ID
read -p "MICROSOFT_CLIENT_SECRET (or leave empty): " MICROSOFT_CLIENT_SECRET
read -p "MAX_GROUP_SIZE (or leave empty for default 6): " MAX_GROUP_SIZE
: "${MAX_GROUP_SIZE:=6}" # Default to 6

cat > backend/.env <<EOF
PORT=$PORT
DB_URL=$DB_URL
BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
BETTER_AUTH_URL=$BETTER_AUTH_URL
FRONTEND_URL=$FRONTEND_URL
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
MICROSOFT_CLIENT_ID=$MICROSOFT_CLIENT_ID
MICROSOFT_CLIENT_SECRET=$MICROSOFT_CLIENT_SECRET
MAX_GROUP_SIZE=$MAX_GROUP_SIZE
EOF

# --- FRONTEND VARIABLES ---
API_URL="$BETTER_AUTH_URL"
echo "API_URL=$API_URL" > frontend/.env

echo "All environment files written:"
echo "  .docker/.env"
echo "  backend/.env"
echo "  frontend/.env"

# --- OPTIONAL: Dependency check/installation can be inserted here (omitted for brevity) ---
# --- DOCKER COMPOSE ---
if command -v docker &>/dev/null; then
  if command -v docker-compose &>/dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
  elif docker compose version &>/dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
  else
    echo "docker compose is not installed. Skipping Docker compose setup."
    DOCKER_COMPOSE_CMD=""
  fi

  if [[ "$DOCKER_COMPOSE_CMD" != "" ]]; then
    echo "Bringing up Docker containers with $DOCKER_COMPOSE_CMD up -d ..."
    (cd .docker && $DOCKER_COMPOSE_CMD up -d)
  fi
else
  echo "Docker not found. Skipping Docker Compose step."
fi

# --- NPM CI in frontend and backend ---
if [ -f frontend/package.json ]; then
  echo "Installing frontend dependencies with npm ci ..."
  (cd frontend && npm ci)
else
  echo "No frontend/package.json found, skipping npm ci in frontend."
fi

if [ -f backend/package.json ]; then
  echo "Installing backend dependencies with npm ci ..."
  (cd backend && npm ci)
else
  echo "No backend/package.json found, skipping npm ci in backend."
fi

# --- DB MIGRATE in backend ---
if [ -f backend/package.json ]; then
  if grep -q '"db:migrate"' backend/package.json; then
    echo "Running npm run db:migrate in backend ..."
    (cd backend && npm run db:migrate)
  else
    echo 'No "db:migrate" npm script found in backend, skipping migration.'
  fi
else
  echo "No backend/package.json found, skipping db:migrate."
fi

echo "Setup script finished."