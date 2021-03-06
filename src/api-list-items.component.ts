import {Injectable, Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ActivatedApi} from './current-api';
import {ApiRouteDataDefinition} from './apis-routes';
import {ApiFile, ApiVersion, ApiStaticDefinitionObject, ApiDefinition} from './api-definition';
import {StepsUtils} from './step-utils';

@Component({
  selector: 'api-list-items',
  template: `
<ul *ngIf="apiData" class="apis-list">
    <li class="api-list-item" *ngFor="let api of getFiles();" [ngClass]="{'active-step': isCurrent(createLink(api))}">
        <a class="api-item-link" [href]="createLink(api)">{{ api.apiTitle }}</a>
    </li>
</ul>`
})
@Injectable()
export class ApiListItems implements OnInit {
  private apiData: ApiRouteDataDefinition;

  constructor(private router: Router, private utils: StepsUtils, private activated: ActivatedApi, private parentRoute: ActivatedRoute) {
  }

  createLink(api) {
    if (this.apiData.isStaticApi) {
      return this.utils.createAbsoluteLink((<ApiStaticDefinitionObject>this.apiData.apiVersion).version + '/' + api.urlName, this.parentRoute);
    } else {
      return this.utils.createAbsoluteLink((<ApiVersion>this.apiData.apiVersion).name + '/' + api.apiTitle, this.parentRoute);
    }
  }

  isCurrent(url) {
    return this.router.url === url;
  }


  getFiles(): any {
    if (this.apiData.isStaticApi) {
      let staticData = <ApiStaticDefinitionObject>this.apiData.apiVersion;

      return staticData.files.map((item) => {
        return {
          apiTitle: item.name,
          urlName: item.urlName
        };
      });
    } else {
      return (<ApiDefinition>this.apiData.apiDefinition).files
        .filter((file: ApiFile) => {
          return ((<ApiVersion>this.apiData.apiVersion).exclude || []).indexOf(file.apiTitle) === -1;
        });
    }
  }

  ngOnInit() {
    this.activated.api.subscribe((data: any) => {
      this.apiData = data;
    });
  }
}
