import { Component } from '@angular/core';
import {
  Platform,
} from "@ionic/angular";
import { CodePush, InstallMode } from "@ionic-native/code-push/ngx";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor(public platform: Platform,
    private codePush: CodePush,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.codePush.notifyApplicationReady();
      // Using this function to create custom message UI to the user.
      this.codePush.checkForUpdate().then((update) => {
        console.log("---> checking for update ", JSON.stringify(update));
        if (!update) {
          console.log("---> The app is up to date.");
        } else {
          console.log("---> An update is available! Should we download it?");
          this.codePush
            .sync(
              {
                installMode: InstallMode.ON_NEXT_RESTART,
                updateDialog: {
                  appendReleaseDescription: true,
                  descriptionPrefix: "\n\n Change log:\n",
                },
              },
              (progress) => {
                console.log(
                  `Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`
                );
              }
            )
            .subscribe(
              (data) => {
                console.log("CODE PUSH SUCCESSFUL: " + data);
                // this.codePush.restartApplication();
              },
              (err) => {
                console.log("CODE PUSH ERROR: " + err);
              }
            );
        }
      });
    });
  }
}

