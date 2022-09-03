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
            throw Error(`Failed to instantiate EliteInsights module`);
        }
        return this._eliteInsights;
    }

    private static _eliteInsights: EliteInsights | undefined;
    private _config: IConfig;
    private _successes: number;
    private _failures: number;

    constructor(config: IConfig) {
        this._config = config;
        this._successes = 0;
        this._failures = 0;
    }

    private async clearParsedFolder(): Promise<void> {
        Logger.log(Logger.Severity.Info, `Clearing parsed folder`);
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
        return new Promise((resolve, reject) => {
            execFile(
                this._config.EliteInsightsEXE,
                ["-c", path.resolve(Constants.SETTINGS_FILE), evtcPath],
                (err) => {
                    if (err) {
                        Logger.logError(Logger.Severity.Error, err);
                        this._failures++;
                        reject();
                    } else {
                        Logger.log(
                            Logger.Severity.Debug,
                            `Converted .evtc file with path ${evtcPath} to .json`
                        );
                        this._successes++;
                        resolve();
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
                    Logger.log(Logger.Severity.Error, `Could not read parsed files`);
                    reject();
                    throw err;
                }

                fs.readdir(path.resolve(Constants.DATA_FOLDER), (err, files) => {
                    if (err) {
                        Logger.log(Logger.Severity.Error, `Could not read EVTC files`);
                        reject();
                        throw err;
                    }
                    const promises: Promise<void>[] = [];
                    let i = 0;

                    files.forEach((file) => {
                        Logger.log(Logger.Severity.Debug, `Checking file ${i + 1}/${files.length} - ${file}`);
                        if (path.extname(file) === ".zevtc" || path.extname(file) === ".evtc") {
                            if (
                                !parsedFiles.find((parsedFile) =>
                                    path.parse(parsedFile).name.includes(path.parse(file).name)
                                )
                            ) {
                                promises.push(
                                    this.evtcToJson(path.join(path.resolve(Constants.DATA_FOLDER), file))
                                );
                            } else {
                                Logger.log(Logger.Severity.Debug, `${file} already parsed`);
                            }
                        } else {
                            Logger.log(Logger.Severity.Debug, `${file} is not a valid log file`);
                        }
                        i++;
                    });

                    Promise.allSettled(promises).then(() => {
                        fs.unlink(Constants.SETTINGS_FILE, (err) => {
                            if (err) {
                                Logger.log(Logger.Severity.Warn, `Could not remove temp.conf settings file`);
                                Logger.logError(Logger.Severity.Debug, err);
                            } else {
                                Logger.log(
                                    Logger.Severity.Debug,
                                    `Successfully removed temp.conf settings file`
                                );
                            }
                        });
                        Logger.log(
                            Logger.Severity.Info,
                            this._successes !== 0
                                ? `Successfully parsed ${this._successes + 1} / ${i + 1} EVTC files to ${
                                      Constants.PARSED_FOLDER
                                  }`
                                : `No new EVTC files to parse`
                        );
                        if (this._failures !== 0) {
                            Logger.log(Logger.Severity.Warn, `There were ${this._failures} failures`);
                        }
                        resolve();
                    });
                });
            });
        });
    }
}
