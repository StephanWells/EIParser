import * as fs from "fs";
import * as path from "path";
import { Constants } from "../../constants/Constants";
import IEvtc from "../../interface/IEvtc";
import { Logger } from "../../util/Logger";

export namespace JsonImporter {
    export function runParser(): Promise<IEvtc[]> {
        return new Promise<IEvtc[]>((resolveMain) => {
            Logger.log(Logger.Severity.Info, `Importing parsed files`);
            const parsedFiles: IEvtc[] = [];
            let [successes, failures] = [0, 0];

            fs.readdir(Constants.PARSED_FOLDER, (err, files) => {
                const promises: Promise<void>[] = [];
                let i: number = 0;

                if (err) {
                    Logger.log(Logger.Severity.Error, `Could not read parsed files`);
                    throw err;
                }

                files.forEach((file) => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            fs.readFile(path.join(Constants.PARSED_FOLDER, file), "utf8", (err, data) => {
                                if (err) {
                                    Logger.logError(Logger.Severity.Error, err);
                                    failures++;
                                    reject();
                                } else {
                                    try {
                                        parsedFiles.push(JSON.parse(data));
                                        Logger.log(
                                            Logger.Severity.Debug,
                                            `Imported ${i + 1}/${files.length} - ${file}`
                                        );
                                        successes++;
                                        resolve();
                                    } catch (err) {
                                        Logger.logError(Logger.Severity.Error, err);
                                        failures++;
                                        reject();
                                    }
                                    i++;
                                }
                            });
                        })
                    );
                });

                Promise.allSettled(promises).then(() => {
                    if (successes !== 0) {
                        Logger.log(
                            Logger.Severity.Info,
                            `Successfully imported ${successes} / ${i} JSON files`
                        );
                    }

                    if (failures !== 0) {
                        Logger.log(Logger.Severity.Warn, `There were ${failures} failures`);
                    }

                    resolveMain(parsedFiles);
                });
            });
        });
    }
}
