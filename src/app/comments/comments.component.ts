import { Component, OnInit } from '@angular/core';
import { CommentReplyService } from './../services/comment-reply.service';
import { Router, ActivatedRoute } from '@angular/router';

export interface comment {
  comment: string;
  name?: string;
  id?: string;
  replies?: reply[];
  commentLikedByLoggedInUser?:boolean;
  commentDislikedByLoggedInUser?:boolean;
}
export interface reply {
  reply?: string;
  reply_type: string;
  name: string;
  parent_reply_id?: number;
  id?: string;
  replyLikedByLoggedInUser?:boolean;
  replyDislikedByLoggedInUser?:boolean;
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
  commentsFromService: comment[] = [];
  repliesFromService: reply[] = [];
  loggedInUser: string = null;
  constructor(
    private commentReplyService: CommentReplyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = sessionStorage.getItem('logged_in_user_name');
    console.log(this.loggedInUser);
    this.getCommentsReplies();
  }
  getCommentsReplies() {
    this.commentReplyService.getComments().subscribe((data) => {
      this.commentsFromService = data.comments;
      console.log('Comments', this.commentsFromService);
      this.likedCommentsByTheLoggedInUser()
      this.commentReplyService.getReplies().subscribe((data) => {
        this.repliesFromService = data.replies;
        console.log('Replies', this.repliesFromService);
        this.likedCommentsByTheLoggedInUser()
      });
    });
  }
  likedCommentsByTheLoggedInUser() {
    if (this.loggedInUser) {
      //do this only if there is logged In User
      this.commentsFromService.forEach((eachComment) => {
        eachComment.replies.forEach((eachReplyToMainComment) => {
          if (eachReplyToMainComment.name === this.loggedInUser && eachReplyToMainComment.reply_type==='L') {
            console.log(
              eachComment.comment + ' was liked by ' + this.loggedInUser
            );
            eachComment.commentLikedByLoggedInUser=true
          }
          if (eachReplyToMainComment.name === this.loggedInUser && eachReplyToMainComment.reply_type==='D') {
            console.log(
              eachComment.comment + ' was disliked by ' + this.loggedInUser
            );
            eachComment.commentDislikedByLoggedInUser=true
          }
        });
      });
    }
  }
}
