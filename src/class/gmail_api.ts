import { gmail_v1 } from 'googleapis';
import { from, map, mergeMap, switchMap } from 'rxjs';
import { configProject, firebaseServiceAccount, topics } from '../environment';
import { GoogleApiCredentials } from './google_api_credentials';
const { client_id, client_secret, redirect_uris } = configProject;

//const { google } = require('googleapis');

export class GmailApi {
    private gmail: gmail_v1.Gmail;
    private googleApiCredentials

    constructor() {
        this.gmail = new gmail_v1.Gmail({

        });
        this.googleApiCredentials = GoogleApiCredentials.getInstance(client_id, client_secret, redirect_uris);
    }
    stopWatch() {
        return this.googleApiCredentials.refreshAccessToken().pipe(mergeMap(token => {
            return from(this.gmail.users.stop({
                access_token: token,
                userId: 'me',

            }))
        }))
    }

    listLabel() {
        return this.googleApiCredentials.refreshAccessToken().pipe(
            switchMap(token => {
                return from(this.gmail.users.labels.list({
                    access_token: token,
                    userId: 'me'
                }))
            })
        )
    }
    listEmails() {
        return this.googleApiCredentials.refreshAccessToken().pipe(
            switchMap(token => {
                return from(this.gmail.users.messages.list({
                    access_token: token,
                    userId: 'me',
                    labelIds: ['INBOX'],
                })).pipe(map(response => response.data))
            })
        )
    }

    listHistory(history_id: string) {
        return this.googleApiCredentials.refreshAccessToken().pipe(
            switchMap(token => {
                return from(this.gmail.users.history.list({
                    access_token: token,
                    userId: 'me',
                    historyTypes: ['messageAdded'],
                    startHistoryId: history_id
                })).pipe(map(response => response.data))
            })
        )
    }

    readEmail(email_id: string) {
        return this.googleApiCredentials.refreshAccessToken()
            .pipe(
                switchMap(token => {
                    return from(this.gmail.users.messages.get({
                        access_token: token,
                        userId: 'me',
                        id: email_id,

                    })).pipe(map(response => response.data))
                })
            )
    }

    watchEmails() {
        return this.googleApiCredentials.refreshAccessToken()
            .pipe(
                switchMap(token => {
                    return from(
                        this.gmail.users.watch({
                            userId: 'me',
                            access_token: token,

                            requestBody: {
                                labelIds: ['INBOX'],
                                topicName: `projects/${firebaseServiceAccount.project_id}/topics/${topics.myTopic}`,
                            }
                        })
                    ).pipe(map(response => response.data))
                })
            )
    }
}