# TS Template

## Setup:

1. Install recommended VS Code extensions:

    - `eslint` "dbaeumer.vscode-eslint"
    - `prettier` "esbenp.prettier-vscode"

2. Install node dependencies ("npm i")
3. Everything should work now!

##

## Github actions:

-   Github actions consist of the following:

    1. On every push to `main`, create a docker image in the github container registry with the tag `latest`.
    2. On every release, create a docker image in the github container registry with the same tag as the release git tag (e.g.`v1.0.0`).
    3. On every pull request, lint and test the project.

-   Be careful when changing the github actions. You might override docker images.

##

## Semantic Commit Messages:

### Format

Commits should be written in the following format:

`<type>(<scope>): <subject>`

`<scope>` is optional

```
feat: Add some functionality
╰┬─╯  ╰┬───────────────────╯
 │     │
 │     ╰─➤ Summary in present tense.
 │
 ╰───────➤ Type: chore, docs, feat, fix, refactor, style, or test.
```

### Types

-   `feat` ➤ New feature for the user, not a new feature for build script
-   `fix` ➤ Bug fix for the user, not a fix to a build script
-   `docs` ➤ Changes to the documentation
-   `style` ➤ Formatting, missing semi colons, etc; no production code change
-   `refactor` ➤ Refactoring production code, eg. renaming a variable
-   `test` ➤ Adding missing tests, refactoring tests; no production code change
-   `chore` ➤ Updating grunt tasks etc; no production code change

### References

-   https://www.conventionalcommits.org/
-   https://seesparkbox.com/foundry/semantic_commit_messages
-   http://karma-runner.github.io/1.0/dev/git-commit-msg.html
