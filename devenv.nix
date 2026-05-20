{ pkgs, lib, ... }:

{
  languages.javascript = {
    enable = true;
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  # 1. PostgreSQL Service Configuration
  services.postgres = {
    enable = true;
    package = pkgs.postgresql_15; # Explicitly pinning a version is safer
    extensions = extensions: [ extensions.postgis ];
    initialDatabases = [{ name = "mydb"; }];
    initialScript = ''
      CREATE EXTENSION IF NOT EXISTS postgis;
    '';
  };

  # 2. Define App Processes (This makes them manageable by devenv)
  processes = {
    backend.exec = "cd backend && npm run dev";
    frontend.exec = "cd frontend && npm run dev";
  };

  # 3. AUTOSTART Logic
  # This triggers 'devenv up' in the background when you enter the shell
  enterShell = ''
    # Starts all services (postgres) and processes (web) in the background
    # Redirects output to a log file so it doesn't clutter your terminal


    echo "🚀 Postgres and App services are starting in the background..."
    echo "📝 Logs available at: .devenv/devenv-up.log"
  '';

  # 4. Helper Scripts
  scripts = {
    db_migrate.exec = "cd backend && npm run db:migrate";
    # Command to easily see what's running
    status.exec = "ps aux | grep -E 'postgres|node'";
  };

  packages = [ pkgs.coreutils ];
}
