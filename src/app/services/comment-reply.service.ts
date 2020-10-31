import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpBackend } from '@angular/common/http';
import {comment,reply,comments,replies} from './../comments/comments.component'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentReplyService {

  constructor(private http:HttpClient) { }

  getComments()
  {
    return this.http.get<comments>('/api/comments')
  }
  getReplies()
  {
    return this.http.get<replies>('/api/replies')
  }
  createComment(name,comment){
    return this.http.post('/api/comment/' + name,comment)
  }
  createReply(commentId,reply){
    return this.http.post('/api/reply/' + commentId,reply)
  }
  deleteReply(replyId){
    return this.http.delete('/api/reply/' + replyId)
  }


}
