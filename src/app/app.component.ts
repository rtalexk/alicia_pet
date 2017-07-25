import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { RecordProvider } from "../providers/record/record";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public push: Push,
    public recordProvider: RecordProvider,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'List', component: 'ListPage' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkPushPermissions();
      this.initializePush();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

   checkPushPermissions() {
    this.push.hasPermission().then(res => {
      if (res.isEnabled) {
        console.log('we have notification permissions');
      } else {
        console.log('we HAVE NOT notification permissions');
      }
    });
  }

  initializePush() {
    const options: PushOptions = {
      android: {
        senderID: '248360045415'
      },
      ios: {
        alert: true,
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObj: PushObject = this.push.init(options);

    pushObj.on('notification').subscribe(notif => {
      if (notif.additionalData.foreground) {
        this.showAlert(notif.message);
      }
      console.log(notif);
    });
    pushObj.on('registration').subscribe(reg => {
      console.log(reg);
      this.recordProvider
        .createDevice(reg.registrationId)
        .subscribe(data => {
          
        }, err => {
          console.log(err);
        });
    });
    pushObj.on('error').subscribe(err => console.log(err));
  } 

  showAlert(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'bottom'
    });
    toast.present();
  }
}
