import readline from 'readline';
import { switchMap } from "rxjs";
import { GoogleCredentials } from "./class";
import { accessTokenEmailAccount, configProject } from "./environment";
import { FileSystemExtra } from "./utils/file_system";
const { client_id, client_secret, redirect_uris } = configProject;
const oauth2 = new GoogleCredentials(client_id, client_secret, redirect_uris);

oauth2.getAccessToken().subscribe(toke => {
    console.log('🚀 ', toke);
});

//const url = result.generateAuthUrl(accessTokenEmailAccount, configProject)
//console.log(url);
//FileSystemExtra.saveDataDefault('src/tokens/access_user_token.json',{data:'carlos'});

/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});*/


/*rl.question('Enter the code from that page here: ', (code: string) => {

    result.getToken(code.trim())
        .pipe(switchMap(token => {
            return FileSystemExtra.saveToken(token);
        }))
        .subscribe(token => {
            console.log('🚀 ~ file: main.ts ~ line 24 ~ rl.question ~ token', token)

            rl.close();
        });


})*/