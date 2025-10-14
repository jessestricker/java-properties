import path from "node:path/posix";
import { JsonFile, ReleasableCommits } from "projen";
import { GithubCredentials } from "projen/lib/github";
import { NodePackageManager, NpmAccess } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";

class Project extends TypeScriptProject {
  constructor() {
    super({
      name: "java-properties",
      projenrcTs: true,
      packageManager: NodePackageManager.PNPM,
      npmAccess: NpmAccess.PUBLIC,
      packageName: "@jessestricker/java-properties",
      authorName: "Jesse Stricker",
      description: "Format and parse Java properties files.",
      repository: "https://github.com/jessestricker/java-properties.git",
      homepage: "https://jessestricker.github.io/java-properties",
      devDeps: ["shx", "typedoc-plugin-mdn-links"],
      githubOptions: {
        mergify: false,
        projenCredentials: GithubCredentials.fromApp(),
      },
      pullRequestTemplate: false,
      prettier: true,
      docgen: true,
      buildWorkflowOptions: {
        mutableBuild: false,
      },
      defaultReleaseBranch: "main",
      releasableCommits: ReleasableCommits.featuresAndFixes(),
      releaseToNpm: true,
      npmTrustedPublishing: true,
    });

    // prettier
    const prettierTask = this.addTask("prettier", {
      exec: "prettier --write .",
    });
    this.testTask.spawn(prettierTask);
    this.prettier!.ignoreFile?.exclude(
      this.package.lockFile,
      this.docsDirectory,
    );

    // typedoc
    const typedocJsonc = new JsonFile(this, "typedoc.jsonc", {
      obj: {
        plugin: ["typedoc-plugin-mdn-links"],
        jsDocCompatibility: false,
      },
    });
    this.gitattributes.addAttributes(
      path.join("/", this.docsDirectory, "**"),
      "linguist-generated",
    );

    // node package
    this.npmignore?.exclude(typedocJsonc.path, this.docsDirectory);
  }

  override preSynthesize(): void {
    // ignore managed files for prettier
    this.prettier?.ignoreFile?.exclude(...this.files.map((file) => file.path));
  }
}

new Project().synth();
