import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { State } from "@invenias/store";
import { Store } from "@ngrx/store";

import { PersonService } from "../../web/people/services/person.service";

@Component({
    selector: 'interview-component',
    templateUrl: './interview.component.html',
    styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit, AfterViewInit {
    @Input() personId: string;

    loadingMessage: string = 'loading...';
    currentInterviews: InterviewModel[];
    candidates: CandidateModel[];

    constructor(private personService: PersonService, private httpClient: HttpClient, private store$: Store<State>) { }

    ngOnInit() {
        this.personService.getPerson(this.personId).subscribe(
            (person: any) => {
                this.getPersonInterview(person.id);
            }
        );
    }

    ngAfterViewInit() {
        this.loadingMessage = 'loaded! :)';
    }

    getPersonInterview(personId: string) {
        this.httpClient.get('http://url.to.api/getInterviews?id=' + personId)
            .subscribe((result: InterviewModel[]) => {
                this.currentInterviews = result;
            }
            );
    }

    loadCandidateDetails(candidateIds: string[]) {
        this.store$.subscribe((state) => {
            this.candidates = [];
            candidateIds.forEach(id => {
                this.candidates.push(state.candidates.entities[id]);
            })
        })
    }

    constructTitle(name: string) {
        return 'This interview will be run by ' + name.toUpperCase + '!';
    }
}

class InterviewModel {
    id: string;
    interviewerName: string;
    date: Date;
    details: string;
    candidateIds: string[]
}

class CandidateModel {
    id: string;
    name: string;
}