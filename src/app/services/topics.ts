import {Inject,Injectable} from '@angular/core'
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';

let subscriptions:any = {}
let Topics:any = {}

export class TopicService{
	
  private http: Http
  private zetta_url = 'http://localhost:1337/servers/Topicserver'; 
  private muxws = 'ws://localhost:1337/events'
  private ws: WebSocket;
  private observer;
  private messages:string[] = []

  constructor( @Inject(Http) h: Http){
    this.http = h
    
  }

  receive(e:MessageEvent){
    console.log(e.data)
    var d = JSON.parse(e.data)
    if(d.type=='subscribe-ack'){
        subscriptions[d.topic]=d.subscriptionId
    }
    (d=>{
      this.messages.push(d)  
      console.log(this.messages)
    })    
  }

  getMessages(): Observable<Event>{
    this.ws= new WebSocket(this.muxws)
    //this.ws.onmessage = this.receive;
    return Observable.create(observer=>{
          this.ws.onmessage = (e) => { 
            var d = JSON.parse(e.data)
            if(d.type=='subscribe-ack'){
              subscriptions[d.topic]=d.subscriptionId
            }
            observer.next(e);
          };
      }).share()
  }

 	getTopics(){  
     if(Object.keys(Topics).length==0){
          return new Promise( (resolve,reject) => {
           console.log('calling zetta')
           this.http.get(this.zetta_url)
              .subscribe( res => {                
                let body = res.json()
                console.log(body)
                body.entities.forEach(function(e){
                  var t = 'Topicserver/' + e.properties.type + '/*/*'
                  Topics[t] = {'topic': t, 'subscribed':false}
                })
                resolve(Topics)
                
              }, err => {
                reject(err)
              })
         });  
     }else{
       return Topics
     }
         
  }

  subscribe(topic){    
    var message = JSON.stringify({topic:topic,type:'subscribe'})    
    this.ws.send(message)
    console.log('subscribe sent')

  }
  unsubscribe(topic){
    
    if(subscriptions[topic]){
      this.ws.send(JSON.stringify({type:'unsubscribe',subscriptionId:subscriptions[topic]}))
    }
    console.log('will try to unsubscribe')
  }
}