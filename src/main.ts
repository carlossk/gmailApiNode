import { GoogleApiCredentials } from "./class";
import { configProject } from "./environment";
import { UiCli } from "./services/cli.service";
const { client_id, client_secret, redirect_uris } = configProject;

const gApi = GoogleApiCredentials.getInstance(client_id, client_secret, redirect_uris);

UiCli.mainMenu(gApi).subscribe(result => {
    console.log('🚀 ~result-->', result);
});
