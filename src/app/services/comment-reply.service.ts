import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpBackend,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  comment,
  reply,
  comments,
  replies,
} from './../comments/comments.component';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommentReplyService {
  constructor(private http: HttpClient, private router: Router) {}
  handleError(err: HttpErrorResponse) {
    if (err.status === 401) {
      alert('Unauthorized or token expired');
      this.router.navigate(['/login']);
    } else console.log('Some other error when calling api', err);
  }

  getComments():Observable<comments> {
    return this.http.get<comments>('/api/comments')
  }
  getReplies() {
    return this.http.get<replies>('/api/replies')
  }
  createComment(name, comment) {
    return this.http.post('/api/comment/' + name, comment).pipe(
      map((data) => data),
      catchError((err) => {
        this.handleError(err);
        return err;
      })
    );
  }
  createReply(commentId, reply) {
    return this.http.post('/api/reply/' + commentId, reply).pipe(
      map((data) => data),
      catchError((err) => {
        this.handleError(err);
        return err;
      })
    );
  }
  deleteReply(replyId) {
    return this.http.delete('/api/reply/' + replyId).pipe(
      map((data) => data),
      catchError((err) => {
        this.handleError(err);
        return err;
      })
    );
  }
}
