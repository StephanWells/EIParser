# EI Parser for AFK During \[PRE\]

This is the repository for the Elite Insights Parser used for the AFK During \[PRE\] guild.

# Installation

1. Ensure that you have the latest version of NPM and Node.
2. Clone the repository:
```bash
git clone git@github.com:StephanWells/EIParser.git
```
3. Navigate to the repository folder and run `npm install`.

# Configuration

1. Create a new file called `Config.json` in the root directory.
2. Populate the file with the following data, replacing the values with your preferred values:

```json
{
  "EliteInsightsEXE": "absolute/path/to/your/GuildWars2EliteInsights.exe",
  "EliteInsightsSettings": "absolute/path/to/your/settings/file.conf",
  "ParseOptions": {
    "CleanSlate": false // true to re-parse all the files in the data/parsed folder, false to only parse new entries
  }
}
```

# Execution

1. Transpile the TypeScript files into JavaScript code:
```bash
npm run tsc
```
2. Then run the application:
```bash
node dist/src/App.js
```

> Note that if you have VS Code, simply press F5 to run.