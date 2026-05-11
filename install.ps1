Function Test-Command {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

Function Compare-Version {
    param([string]$v1, [string]$v2)
    # Returns True if v1 -ge v2
    $v1v = [Version]$v1
    $v2v = [Version]$v2
    return ($v1v -ge $v2v)
}

Write-Host "Checking for Docker..."
if (Test-Command "docker") {
    Write-Host "Docker is installed: $(docker --version)"
} else {
    Write-Host "Docker is not installed."
    $dockerYN = Read-Host "Do you want to install Docker Desktop? [Y/n]"
    if ($dockerYN -eq "n" -or $dockerYN -eq "N") {
        Write-Host "Checking for PostgreSQL..."
        if (Test-Command "psql") {
            Write-Host "PostgreSQL is already installed: $(psql --version)"
        } else {
            Write-Host "Attempting to install PostgreSQL via Chocolatey (requires admin)..."
            if (-not (Test-Command "choco")) {
                Write-Host "Chocolatey not found. Please install PostgreSQL manually: https://www.postgresql.org/download/windows/"
                exit 1
            }
            choco install postgresql --yes
            Write-Host "PostgreSQL installation invoked."
        }
    } else {
        Write-Host "Please install Docker Desktop from https://docs.docker.com/desktop/install/windows-install/"
        exit 1
    }
}

# Node.js version check
$MIN_NODE_VERSION = "20.20.0"
$hasNode = $false

if (Test-Command "node") {
    $NODE_VERSION = (node -v) -replace "v",""
    if (Compare-Version $NODE_VERSION $MIN_NODE_VERSION) {
        Write-Host "Node.js version $NODE_VERSION is sufficient."
        $hasNode = $true
    } else {
        Write-Host "Node.js version $NODE_VERSION is too old. Need $MIN_NODE_VERSION or greater."
    }
} else {
    Write-Host "Node.js is not installed."
}

if (-not $hasNode) {
    # Try nvm-windows
    if (-not (Test-Command "nvm")) {
        Write-Host "nvm (Node Version Manager for Windows) is not installed."
        Write-Host "Installing nvm-windows via Chocolatey (requires admin)..."
        if (-not (Test-Command "choco")) {
            Write-Host "Chocolatey not found. Please install Node.js manually: https://nodejs.org/en/download"
            exit 1
        }
        choco install nvm --yes
        $env:Path += ";$([Environment]::GetEnvironmentVariable('NVM_HOME', [EnvironmentVariableTarget]::Machine));$([Environment]::GetEnvironmentVariable('NVM_SYMLINK', [EnvironmentVariableTarget]::Machine))"
    }
    Write-Host "Installing Node.js $MIN_NODE_VERSION via nvm..."
    nvm install $MIN_NODE_VERSION
    nvm use $MIN_NODE_VERSION
    Write-Host "Node.js $MIN_NODE_VERSION installed."
}

Write-Host "All requirements satisfied."

# --- DATABASE VARIABLES ---
Write-Host "Enter database credentials:"
$DB_USER = Read-Host "DB_USER"
$DB_PASSWORD = Read-Host "DB_PASSWORD"
$DB_SCHEMA_NAME = Read-Host "DB_SCHEMA_NAME"
$DB_HOST_PORT = Read-Host "DB_HOST_PORT (e.g. localhost:5432)"

@"
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_SCHEMA_NAME=$DB_SCHEMA_NAME
DB_HOST_PORT=$DB_HOST_PORT
"@ | Set-Content .docker/.env

# --- BACKEND VARIABLES ---
$PORT = Read-Host "Enter backend server port (e.g. 3001):"
$BACKEND_PROTO = Read-Host "What will be the protocol for your backend URL? (http or https):"
$BACKEND_HOST = Read-Host "Enter the backend server host (e.g. localhost):"

$DB_URL = "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST_PORT}/${DB_SCHEMA_NAME}"

$BETTER_AUTH_SECRET = Read-Host "BETTER_AUTH_SECRET (choose a random strong secret)"
$BETTER_AUTH_URL = "${BACKEND_PROTO}://${BACKEND_HOST}:${PORT}"
$FRONTEND_PORT = Read-Host "Enter frontend server port (e.g. 5173):"
$FRONTEND_URL = "${BACKEND_PROTO}://${BACKEND_HOST}:${FRONTEND_PORT}"

Write-Host "OPTIONAL: Enter OAuth client IDs/secrets or leave blank to skip."
$GOOGLE_CLIENT_ID = Read-Host "GOOGLE_CLIENT_ID (or leave empty)"
$GOOGLE_CLIENT_SECRET = Read-Host "GOOGLE_CLIENT_SECRET (or leave empty)"
$MICROSOFT_CLIENT_ID = Read-Host "MICROSOFT_CLIENT_ID (or leave empty)"
$MICROSOFT_CLIENT_SECRET = Read-Host "MICROSOFT_CLIENT_SECRET (or leave empty)"
$MAX_GROUP_SIZE = Read-Host "MAX_GROUP_SIZE (or leave empty for default 6)"
if ([string]::IsNullOrEmpty($MAX_GROUP_SIZE)) { $MAX_GROUP_SIZE = "6" }

@"
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
"@ | Set-Content backend/.env

# --- FRONTEND VARIABLES ---
$API_URL = $BETTER_AUTH_URL
"API_URL=$API_URL" | Set-Content frontend/.env

Write-Host "All environment files written:`n  .docker/.env`n  backend/.env`n  frontend/.env"

# --- DOCKER COMPOSE ---
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    $dockerCompose = if (Get-Command "docker-compose" -ErrorAction SilentlyContinue) {
        "docker-compose"
    } elseif ((docker compose version) -match "Docker Compose") {
        "docker compose"
    } else {
        ""
    }

    if ($dockerCompose) {
        Write-Host "Bringing up Docker containers with '$dockerCompose up -d' ..."
        Push-Location .docker
        Invoke-Expression "$dockerCompose up -d"
        Pop-Location
    } else {
        Write-Host "docker compose is not installed. Skipping Docker Compose step."
    }
} else {
    Write-Host "Docker not found. Skipping Docker Compose step."
}

# --- NPM CI in frontend and backend ---
if (Test-Path frontend/package.json) {
    Write-Host "Installing frontend dependencies with npm ci ..."
    Push-Location frontend
    npm ci
    Pop-Location
} else {
    Write-Host "No frontend/package.json found, skipping npm ci in frontend."
}

if (Test-Path backend/package.json) {
    Write-Host "Installing backend dependencies with npm ci ..."
    Push-Location backend
    npm ci
    Pop-Location
} else {
    Write-Host "No backend/package.json found, skipping npm ci in backend."
}

# --- DB MIGRATE in backend ---
if (Test-Path backend/package.json) {
    $hasMigrate = (Get-Content backend/package.json | Select-String '"db:migrate"' -Quiet)
    if ($hasMigrate) {
        Write-Host "Running 'npm run db:migrate' in backend ..."
        Push-Location backend
        npm run db:migrate
        Pop-Location
    } else {
        Write-Host 'No "db:migrate" npm script found in backend, skipping migration.'
    }
} else {
    Write-Host "No backend/package.json found, skipping db:migrate."
}

Write-Host "Setup script finished."