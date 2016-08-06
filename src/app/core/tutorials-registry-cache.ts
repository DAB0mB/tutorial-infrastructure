import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {TutorialDefinition, TutorialBundle} from "./tutorial-definition";
const gitPatchParser = require("git-patch-parser");

function capitalizeFirstLetter(message) {
  return message.charAt(0).toUpperCase() + message.slice(1);
}

function prepareSummary(message) {
  return capitalizeFirstLetter(message.trim());
}

function parseOutStepNumberAndComment(arr) {
  arr.forEach((parsedPatch : any) => {
    let splitMessage = parsedPatch.message.split(":");

    if (splitMessage.length > 1) {
      let stepNumber = splitMessage[0].split(" ")[1];

      if (!stepNumber) {
        stepNumber = splitMessage[0].split(" ")[0];
      }

      parsedPatch.stepNumber = stepNumber.trim();

      if (splitMessage[1]) {
        parsedPatch.summary = prepareSummary(splitMessage[1]);
      }
    }
  });

  return arr;
}

function doMapping(parsedData) {
  let stepToPatch = {};

  parsedData.forEach((parsedPatch) => {
    stepToPatch[parsedPatch.stepNumber] = parsedPatch;
  });

  return stepToPatch;
}

@Injectable()
export class TutorialRegistryCache {
  private cache: Map<string, TutorialBundle>;

  constructor(private http: Http) {
    this.cache = new Map<string, TutorialBundle>();
  }

  set(id: string, patch: TutorialBundle): TutorialBundle {
    this.cache.set(id, patch);

    return patch;
  }

  count() {
    return this.cache.size;
  }

  getObject(id: string): TutorialBundle {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    } else {
      return;
    }
  }

  load(id: string, tutorialData : TutorialDefinition): Observable<TutorialBundle> {
    if (this.cache.has(id)) {
      return Observable.of(this.cache.get(id));
    } else {
      let obs = <Observable<TutorialBundle>>this.http
        .get(tutorialData.patchFile)
        .map(res => res.text())
        .map(gitPatchParser.parseMultiPatch)
        .map(parseOutStepNumberAndComment)
        .map(doMapping)
        .map(parsedTutorial => {
          return <TutorialBundle>{
            steps: parsedTutorial,
            tutorial: tutorialData
          };
        });

      obs.subscribe((patch: TutorialBundle) => {
        this.set(id, patch);
      });

      return obs.map(res => true);
    }
  }
}
