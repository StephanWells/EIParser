import * as fs from "fs";
import * as path from "path";
import IConfig from "../../interface/IConfig";
import { Logger } from "../../util/Logger";
import { execFile } from "child_process";
import { Constants } from "../../constants/Constants";

export default class EliteInsights {
    public static initiate(config: IConfig) {
        if (!this._eliteInsights) {
            this._eliteInsights = new EliteInsights(config);
        }
    }

    public static instance() {
        if (!this._eliteInsights) {
            throw Error("Failed to instantiate EliteInsights module");
        }
        return this._eliteInsights;
    }

    private static _eliteInsights: EliteInsights | undefined;
    private _config: IConfig;

    constructor(config: IConfig) {
        this._config = config;
    }

    private async clearParsedFolder(): Promise<void> {
        Logger.log(Logger.Severity.Info, "Clearing parsed folder");
        fs.readdir(Constants.PARSED_FOLDER, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(Constants.PARSED_FOLDER, file), (err) => {
                    if (err) throw err;
                });
            }
        });
    }

    private async evtcToJson(evtcPath: string): Promise<void> {
        Logger.log(Logger.Severity.Debug, `Converting .evtc file with path ${evtcPath} to .json`);
        return new Promise((resolve, reject) => {
            execFile(
                this._config.EliteInsightsEXE,
                ["-c", path.resolve(Constants.SETTINGS_FILE), evtcPath],
                (err) => {
                    if (err) {
                        reject();
                        throw err;
                    } else {
                        resolve();
                        Logger.log(
                            Logger.Severity.Debug,
                            `Converted .evtc file with path ${evtcPath} to .json`
                        );
                    }
                }
            );
        });
    }

    public async runParser(): Promise<void> {
        if (this._config.ParseOptions.CleanSlate) await this.clearParsedFolder();

        return new Promise((resolve, reject) => {
            fs.readdir(path.resolve(Constants.PARSED_FOLDER), (err, parsedFiles) => {
                if (err) {
                    Logger.log(Logger.Severity.Warn, "Could not read parsed files");
                    Logger.logError(Logger.Severity.Debug, err);
                    reject();
                }

                fs.readdir(path.resolve(Constants.DATA_FOLDER), (err, files) => {
                    if (err) {
                        Logger.log(Logger.Severity.Warn, `Could not read EVTC files`);
                        Logger.logError(Logger.Severity.Debug, err);
                        reject();
                    }
                    const promises: Promise<void>[] = [];
                    let i: number = 0;

                    files.forEach((file) => {
                        if (path.extname(file) === ".zevtc" || path.extname(file) === ".evtc") {
                            if (
                                !parsedFiles.find((parsedFile) =>
                                    path.parse(parsedFile).name.includes(path.parse(file).name)
                                )
                            ) {
                                promises.push(
                                    this.evtcToJson(path.join(path.resolve(Constants.DATA_FOLDER), file))
                                );
                                i++;
                            }
                        }
                    });

                    Promise.all(promises).then(() => {
                        fs.unlink(Constants.SETTINGS_FILE, (err) => {
                            if (err) {
                                Logger.log(Logger.Severity.Warn, "Could not remove temp.conf settings file");
                                Logger.logError(Logger.Severity.Debug, err);
                            }

                            Logger.log(Logger.Severity.Debug, "Successfully removed temp.conf settings file");
                        });
                        Logger.log(
                            Logger.Severity.Info,
                            i !== 0
                                ? `Successfully parsed ${i} EVTC files to ${Constants.PARSED_FOLDER}`
                                : `No new EVTC files to parse`
                        );
                        resolve();
                    });
                });
            });
        });
    }
}
