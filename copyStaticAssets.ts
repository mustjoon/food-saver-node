import * as shell from "shelljs";

shell.cp("-R", "src/public/js/lib", "dist/public/js/");
shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/jwtRS256.key", "dist/jwtRS256.key");
shell.cp("-R", "src/jwtRS256.key.pub", "dist/jwtRS256.key.pub");
