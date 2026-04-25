{ pkgs, lib, ... }:

{
  languages.javascript = {
    enable = true;
    npm = {
      enable = true;
      install.enable = true;
    };
  };
  packages = [ pkgs.coreutils ];
    services.postgres = {
      enable = true;
      extensions = extensions: [ extensions.postgis ];

      initialDatabases = [{ name = "mydb"; }];

      initialScript = ''
        CREATE EXTENSION IF NOT EXISTS postgis;
      '';
    };
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
