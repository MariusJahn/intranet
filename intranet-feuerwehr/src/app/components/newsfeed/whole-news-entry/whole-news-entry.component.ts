import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {NewsfeedService} from "../newsfeed.service";
import {News} from "../types/News";

@Component({
  selector: 'app-whole-news-entry',
  templateUrl: './whole-news-entry.component.html',
  styleUrls: ['./whole-news-entry.component.css']
})
export class WholeNewsEntryComponent implements OnInit {

  public newsFeed: News;

  constructor(private route: ActivatedRoute, private newsService: NewsfeedService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('newsfeedID');

      this.newsService.getNews().subscribe((allNews: Array<News>) => {
        this.newsFeed = allNews.find((news) => news.newsfeedID.toString() === id);

      });
    });

  }

}
