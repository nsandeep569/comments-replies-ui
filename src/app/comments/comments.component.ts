import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { CommentReplyService } from './../services/comment-reply.service';
import { Router  } from '@angular/router';
import {  ChangeDetectorRef } from '@angular/core';

import {
  AfterViewInit,
  ViewContainerRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommentBoxComponent } from './../comment-box/comment-box.component';

export interface comment {
  comment: string;
  name?: string;
  id?: number;
  replies?: reply[];
  commentLikedByLoggedInUser?: boolean;
  commentDislikedByLoggedInUser?: boolean;
}
export interface reply {
  reply?: string;
  reply_type: string;
  name: string;
  parent_reply_id?: number;
  id?: number;
  replyLikedByLoggedInUser?: boolean;
  replyDislikedByLoggedInUser?: boolean;
  comment_id: number;
}
export interface comments {
  comments: comment[];
}
export interface replies {
  replies: reply[];
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  // @ViewChild('dynamicInsertCommentBox', { read: ViewContainerRef }) dynamicInsertCommentBox: ViewContainerRef;
  @ViewChildren('dynamicInsertCommentBox', { read: ViewContainerRef })
  dynamicInsertCommentBox: QueryList<ViewContainerRef>;
  commentsFromService: comment[] = [];
  repliesFromService: reply[] = [];
  loggedInUser: string = null;
  newComment: string = '';
  dynamicCommentBoxes: any = [];
  currentReplyCommentBoxId: string = null;
  constructor(
    private commentReplyService: CommentReplyService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    
    this.loggedInUser = sessionStorage.getItem('logged_in_user_name');
    
    this.getCommentsReplies();
  }
  ngAfterViewInit() {
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CommentBoxComponent);
    // const containerRef = this.viewContainerRef;
    // containerRef.clear();
    // containerRef.createComponent(componentFactory);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      CommentBoxComponent
    );
    this.dynamicInsertCommentBox.changes.subscribe(() => {
      this.dynamicInsertCommentBox.toArray().forEach((eachCommentBox) => {
        eachCommentBox.clear();
      });

      this.dynamicInsertCommentBox.toArray().forEach((element) => {
        this.dynamicCommentBoxes.push(
          <CommentBoxComponent>(
            element.createComponent(componentFactory).instance
          )
        );
      });
      this.dynamicCommentBoxes.forEach((element) => {
        element.name = this.loggedInUser;
        element.cdr.detectChanges()
        // element.instance.commentId=this.loggedInUser
      });
    });

    // dynamicCommentBox.title = 'Hello World';
  }
  getCommentsReplies() {
    this.newComment = null;
    this.commentReplyService.getComments().subscribe((data) => {
      this.commentsFromService = data.comments;
      
      this.likedCommentsByTheLoggedInUser();
      this.commentReplyService.getReplies().subscribe((data) => {
        this.repliesFromService = data.replies;
        
        this.likedCommentsByTheLoggedInUser();
        this.likedRepliesByTheLoggedInUser();
        this.mergeReplyLikesDislikes()
        
        
        // this.cdr.detectChanges()
      });
    });
  }
  likedCommentsByTheLoggedInUser() {
    if (this.loggedInUser) {
      //do this only if there is logged In User
      this.commentsFromService.forEach((eachComment) => {
        eachComment.replies.forEach((eachReplyToMainComment) => {
          if (
            eachReplyToMainComment.name === this.loggedInUser &&
            eachReplyToMainComment.reply_type === 'L' && eachReplyToMainComment.parent_reply_id===null
          ) {
        
            eachComment.commentLikedByLoggedInUser = true;
          }
          if (
            eachReplyToMainComment.name === this.loggedInUser &&
            eachReplyToMainComment.reply_type === 'D' && eachReplyToMainComment.parent_reply_id===null
          ) {
            
            eachComment.commentDislikedByLoggedInUser = true;
          }
        });
      });
    }
  }

  likedRepliesByTheLoggedInUser() {
    if (this.loggedInUser) {
      //do this only if there is logged In User
      this.commentsFromService.forEach((eachComment) => {
        eachComment.replies.forEach((eachReplyToMainComment) => {
          if (
            this.repliesFromService.filter(
              (eachreply) =>
                eachreply.parent_reply_id === eachReplyToMainComment.id &&
                eachreply.reply_type == 'L'
                && eachreply.name===this.loggedInUser
            ).length > 0
          ) {
            
            eachReplyToMainComment.replyLikedByLoggedInUser = true;
          }
          if (
            this.repliesFromService.filter(
              (eachreply) =>
                eachreply.parent_reply_id === eachReplyToMainComment.id &&
                eachreply.reply_type == 'D'
                && eachreply.name===this.loggedInUser
            ).length > 0
          ) {
            
            eachReplyToMainComment.replyDislikedByLoggedInUser = true;
          }
        });
      });
    }
  }
  createNewComment() {
    if (this.newComment) {
      this.commentReplyService
        .createComment(this.loggedInUser, { comment: this.newComment })
        .subscribe(
          (data) => {
            console.log('Comment created successfully', data);
            this.getCommentsReplies();
          },
          (err) => {
            console.log('Comment couldnt be created', err);
            alert('Error occured' + err);
          }
        );
    }
  }

  likeDislikeReply(commentId,parentReplyId,likeDislike){
    let foundLikedOrDislikedReply: boolean = false;
    
    this.repliesFromService
      .filter(
        (eachReply) =>
          eachReply.comment_id === commentId &&
          eachReply.name === this.loggedInUser &&
          eachReply.reply_type === (likeDislike ? 'L' : 'D') &&
          eachReply.parent_reply_id===parentReplyId
      )
      .forEach((eachReply) => {
        
        foundLikedOrDislikedReply = true;
        this.commentReplyService.deleteReply(eachReply.id).subscribe(
          (data) => {
            
            this.getCommentsReplies();
          },
          (err) => console.log(err)
        );
      });
      if(!foundLikedOrDislikedReply){
     
    this.commentReplyService
        .createReply(commentId, {
          reply_type: likeDislike ? 'L' : 'D',
          name: this.loggedInUser,
          "parent_reply_id":parentReplyId
        })
        .subscribe(
          (data) => this.getCommentsReplies(),
          (err) => {
            console.log('error while like dislike', err),
              alert('Error occured' + err);
          }
        );
      }

  }

  mergeReplyLikesDislikes(){
    this.repliesFromService.forEach(allreply=>{
      if(allreply.parent_reply_id){
this.commentsFromService.forEach(eachComment=>{
  eachComment.replies.forEach(eachReply=>{
    if(allreply.comment_id===eachReply.comment_id && eachReply.id === allreply.parent_reply_id
      && allreply.name===this.loggedInUser){
        
        if(allreply.reply_type==='L')eachReply.replyLikedByLoggedInUser=true;
        if(allreply.reply_type==='D')eachReply.replyDislikedByLoggedInUser=true
      }
  })
})
      }
    }
      )
  }
  likeDislikeComment(id, likeDislike) {
    let foundLikedOrDislikedComment: boolean = false;
    
    this.repliesFromService
      .filter(
        (eachReply) =>
          eachReply.comment_id === id &&
          eachReply.name === this.loggedInUser &&
          eachReply.reply_type === (likeDislike ? 'L' : 'D')
          && eachReply.parent_reply_id==null
          
      )
      .forEach((eachReply) => {
        
        foundLikedOrDislikedComment = true;
        this.commentReplyService.deleteReply(eachReply.id).subscribe(
          (data) => {
           
            this.getCommentsReplies();
          },
          (err) => console.log(err)
        );
      });
    if (!foundLikedOrDislikedComment)
      this.commentReplyService
        .createReply(id, {
          reply_type: likeDislike ? 'L' : 'D',
          name: this.loggedInUser,
        })
        .subscribe(
          (data) => this.getCommentsReplies(),
          (err) => {
            
              alert('Error occured' + err);
          }
        );
  }
  addCommentBoxBelow(commentId) {
    // var node = document.createElement("LI");
    // var textnode = document.createTextNode("Water");
    // node.appendChild(textnode);
    // document.getElementById(commentId).appendChild(node)
    // var node = document.createElement("app-comment-box")
    // document.getElementById(commentId).appendChild(node)
    this.currentReplyCommentBoxId = commentId;
    this.dynamicInsertCommentBox.changes.subscribe(() => {
      this.dynamicCommentBoxes.forEach((element) => {
        element.name = this.loggedInUser;
        element.commentId = commentId;
        element.cdr.detectChanges()
        element.clickedOnPostReply.subscribe((event) => {
          
          this.currentReplyCommentBoxId = null;
          this.getCommentsReplies();
        });
        element.clickedOnCancelReply.subscribe((event) => {
          
          this.currentReplyCommentBoxId = null;
          
        });
      });
    });
  }
}
