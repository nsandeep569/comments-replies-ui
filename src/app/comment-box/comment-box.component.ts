import {EventEmitter, Component, OnInit,Input, SimpleChanges,ChangeDetectorRef, OnChanges, Output } from '@angular/core';
import { CommentReplyService } from './../services/comment-reply.service';
import {reply} from './../comments/comments.component'

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnInit,OnChanges{
title:string;
@Input('commentId') commentId:string;
textData:string;
@Input('name') name;
@Output() clickedOnPostReply = new EventEmitter<boolean>();

@Output() clickedOnCancelReply = new EventEmitter<boolean>();
  constructor(private cdr: ChangeDetectorRef,private commentReplyService:CommentReplyService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes:SimpleChanges){
    console.log(changes)
    this.cdr.detectChanges()
  }
  createReply(){
    console.log(this.textData,this.name,this.commentId)
    this.commentReplyService.createReply(this.commentId.replace('comment_',''),
      {
        "reply":this.textData,
        "reply_type":"R",
        "name":this.name  
    
    }).subscribe(data=>{console.log('reply created',data);this.clickedOnPostReply.emit(true)},err=>console.log(err))
  }

  cancelReply(){
    this.clickedOnCancelReply.emit(true)

  }

}
