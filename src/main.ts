import { GmailApi } from "./class";


const gmail = new GmailApi();
gmail.listEmails().subscribe(data => {
    console.log('🚀 ~ file: main.ts ~ line 6 ~ gmail.watchEmails ~ data', data.data.messages);
});


//eyJlbWFpbEFkZHJlc3MiOiJzcHJpbnRwYXNzZmVlZGVyQGNhcmdvc3ByaW50Z3JvdXAuY29tIiwiaGlzdG9yeUlkIjoyMDUxfQ==
/*UiCli.mainMenu()

    .subscribe(({ action }) => {
        console.log('🚀', action)
        if (action === Actions.GenerateToken) {
            UiCli.askAuthCode(googleApiCredentials);
            return;
        }

    })





console.log(oauth2.isTokenExpired(credentials_user));
oauth2.getAccessToken().subscribe(toke => {
    console.log('🚀 ', toke);
});*/

//const url = result.generateAuthUrl(accessTokenEmailAccount)
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