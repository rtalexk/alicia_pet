import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";
import { ListPage } from "./list";

@NgModule({
    declarations: [
        ListPage
    ],
    imports: [
        IonicPageModule.forChild(ListPage)
    ],
    exports: [
        ListPage
    ]
})
export class ListPageModule { }