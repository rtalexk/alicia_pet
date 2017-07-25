import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";
import { HomePage } from "./home";

@NgModule({
    declarations: [
        HomePage
    ],
    imports: [
        IonicPageModule.forChild(HomePage)
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule { }