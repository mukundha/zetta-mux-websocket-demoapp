/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, Pipe } from '@angular/core';

import { AppState } from './app.service';
import {TopicService} from './services/topics'
import {Observable} from 'rxjs/Rx';


/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],  
  templateUrl: 'app.component.html',
  
})
export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  loading = false;
  name = 'Angular 2 Webpack Starter';
  private topics:any = [];
  private messages: String[] = [];
  constructor(
    public appState: AppState,
    public topicService: TopicService) {  

     this.topicService.getMessages()
       .subscribe((e)=>{
         console.log(e)
         this.messages.push(JSON.stringify(e.data) )
       })
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
      

    this.topicService.getTopics()
      .then( (res => {
        this.topics=res
        console.log(this.topics)
      } ) , 
        (err => {console.log(err)}) )
  }

  keys(){
    return Object.keys(this.topics)
  }
  subscribe(t,$event){
    if($event.checked){
      this.topicService.subscribe(t)
    }else{
      this.topicService.unsubscribe(t)
    }    
  }
}


/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
