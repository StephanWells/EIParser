export namespace Logger {
    export enum Severity {
        Debug = "Debug",
        Info = "Info",
        Warn = "Warn",
        Error = "Error",
    }

    export function log(severity: Severity, msg: string) {
        const timeStr = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");
        const formattedMsg = `[${timeStr}][${severity}] ${msg}`;
        console.log(formattedMsg);
    }

    export function logError(severity: Severity, error: Error) {
        if (error) {
            log(
                severity,
                `err: ${error.name} - ${error.message} | ${error.stack}`
            );
        } else {
            log(severity, `err: undefined`);
        }
    }
}
