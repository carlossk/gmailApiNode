import inquirer from "inquirer";
import { catchError, from, of, switchMap } from "rxjs";
import { GoogleApiCredentials } from "../class";
export enum Actions {
    CreateAuthUrl = 1,
    GenerateToken,
    GetAccessToken
}
export class UiCli {

    static mainMenu() {
        console.log('Hi, welcome to SprintPass CLI');

        const questions = [
            {
                type: 'list',
                name: 'action',
                message: 'What do you do?',
                choices: [Actions[Actions.CreateAuthUrl], Actions[Actions.GenerateToken], Actions[Actions.GetAccessToken]],
                filter(val: any) {
                    return Actions[val];
                },
            },
        ];

        return from(inquirer.prompt(questions))
    }

    static askAuthCode(googleApiCredentials: GoogleApiCredentials) {

        const questions = [
            {
                type: 'input',
                name: 'auth_code',
                message: 'Enter the code from that page here:',
            },
        ];

        from(inquirer.prompt(questions))
            .pipe(
                switchMap(code => {

                    return googleApiCredentials.getTokenWithCode(`${code}`.trim())
                }),
                catchError(error => {
                    console.log(error.message);
                    return of(null)
                })
            ).subscribe(token => {
                console.log('🚀', token)
            })
    }
}