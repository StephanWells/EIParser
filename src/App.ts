import * as fs from "fs";
import * as path from "path";
import { Constants } from "./constants/Constants";
import IConfig from "./interface/IConfig";
import IEvtc from "./interface/IEvtc";
import EliteInsights from "./modules/EliteInsights/EliteInsights";
import { JsonImporter } from "./modules/Json/JsonImporter";
import { Logger } from "./util/Logger";

export class App {
    public static initiate(config: IConfig) {
        if (!this._app) {
            this._app = new App(config);
            this._app.createTempSettingsFile();
        }
    }

    public static instance() {
        if (!this._app) {
            throw Error("App instance not defined");
        }
        return this._app;
    }

    private createTempSettingsFile() {
        const data = fs.readFileSync(this._config.EliteInsightsSettings, "utf8");
        const result = data.replace(
            /OutLocation=.*/g,
            `OutLocation=${path.resolve(Constants.PARSED_FOLDER)}`
        );
        fs.writeFileSync(Constants.SETTINGS_FILE, result, "utf8");
        Logger.log(Logger.Severity.Debug, `Successfully created temp.conf settings file`);
    }

    private static _app: App | undefined;
    public _config: IConfig;

    constructor(config: IConfig) {
        this._config = config;
    }

    public async run() {
        EliteInsights.initiate(this._config);
        await EliteInsights.instance().runParser();

        const parsedFiles: IEvtc[] = await JsonImporter.runParser();
    }
}

function loadConfiguration(): IConfig | null {
    return require("../Config.json");
}

process.on("uncaughtException", (error) => Logger.logError(Logger.Severity.Error, error));

const config = loadConfiguration();

if (config) {
    App.initiate(config);
    App.instance().run();
}
