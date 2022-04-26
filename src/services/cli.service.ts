import inquirer from "inquirer";
import { from, map, mapTo, mergeMap, of, switchMap } from "rxjs";
import { GmailApi, GoogleApiCredentials } from "../class";
import { FileSystemExtra } from "../utils/file_system";
export enum Actions {
    GenerateNewToken = 1,
    GetAccessToken,
    ListEmails,
    ReadEmail,
    WatchEmail,
    HistoryByID,
    StopWatch,
    
}
export class UiCli {

    private static getMenu() {
        const menuTitles: string[] = [];
        for (const ac in Actions) {
            const menu = Number(ac);
            if (!menu) {
                menuTitles.push(ac);
            }

        }
       
        return menuTitles;
    }

    static mainMenu(googleApiCredentials: GoogleApiCredentials) {
        console.log('Hi, welcome to SprintPass CLI');

        let choices: string[] = []
        choices = this.getMenu();
        const questions = [
            {
                type: 'list',
                name: 'action',
                message: 'What do you do?',
                choices,
                filter(val: any) {
                    return Actions[val];
                },
            },
        ];

        return from(inquirer.prompt(questions)).pipe(
            switchMap(({ action }) => {
                const gmail = new GmailApi();
                switch (action) {
                    case Actions.GenerateNewToken:
                        return this.askAuthCode(googleApiCredentials);
                    case Actions.ListEmails:
                        return gmail.listEmails();
                    case Actions.ReadEmail:
                        return this.askEmailID(gmail);
                    case Actions.GetAccessToken:
                        return googleApiCredentials.refreshAccessToken();
                    case Actions.GetAccessToken:
                        return googleApiCredentials.refreshAccessToken();
                    case Actions.WatchEmail:
                        return gmail.watchEmails();
                    case Actions.HistoryByID:
                        return this.askHistoryID(gmail);
                    case Actions.StopWatch:
                        return gmail.stopWatch();
                    default:
                        return of(`${Actions[action]} No Impemented Option`);
                }
            })
        )
    }
    static askHistoryID(gmail: GmailApi) {
        const questions = [
            {
                type: 'input',
                name: 'history_id',
                message: 'Enter the history id:',
            },
        ];

        return from(inquirer.prompt(questions))
            .pipe(
                switchMap(({ history_id }) => {


                    return gmail.listHistory(`${history_id}`.trim()).pipe(map(data => {
                        return data.history![0].messages?.map(message => message.id);
                    }))
                }),

            )
    }
    static askEmailID(gmail: GmailApi) {

        const questions = [
            {
                type: 'input',
                name: 'email_id',
                message: 'Enter the emial id:',
            },
        ];

        return from(inquirer.prompt(questions))
            .pipe(
                switchMap(({ email_id }) => {

                    return gmail.readEmail(`${email_id}`.trim())
                }),

            )
    }

    static askAuthCode(googleApiCredentials: GoogleApiCredentials) {
        console.log(googleApiCredentials.generateAuthUrl('https://mail.google.com/'))
        const questions = [
            {
                type: 'input',
                name: 'auth_code',
                message: 'Enter the code from that page here:',
            },
        ];

        return from(inquirer.prompt(questions))
            .pipe(
                switchMap(({ auth_code }) => {
                    //console.log('🚀 --->', auth_code);

                    return googleApiCredentials.getTokenWithCode(`${auth_code}`.trim())
                        .pipe(
                            mergeMap(accessToken => {
                                return FileSystemExtra.saveToken(accessToken).pipe(mapTo(accessToken))
                            })
                        )
                }),

            )
    }
}