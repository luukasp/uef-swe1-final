{ pkgs, lib, ... }:

{
  languages.javascript = {
    enable = true;
    npm = {
      enable = true;
      install.enable = true;
    };
  };
  services.mysql.enable = true;
    # The default is MariaDB. To use MySQL instead:
    # services.mysql.package = pkgs.mysql80;
    services.mysql.initialDatabases = [{ name = "app_db"; }];
    services.mysql.ensureUsers = [
      {
        name = "app";
        password = "application_password";
        ensurePermissions = { "app_db.*" = "ALL PRIVILEGES"; };
      }
    ];
    scripts.brun.exec = ''
      cd backend/ && npm run dev
    '';
    scripts.frun.exec = ''
      cd frontend/ && npm run dev
    '';
    scripts.db_migrate.exec = ''
      cd backend/ && npm run db:migrate
    '';
    scripts.dev.exec = ''
      brun && frun
    '';
}
