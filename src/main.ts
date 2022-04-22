import { GmailApi } from "./class";


const gmail = new GmailApi();
gmail.listEmails().subscribe(data => {
    console.log('🚀 ~ file: main.ts ~ line 6 ~ gmail.watchEmails ~ data', data.data.messages);
});