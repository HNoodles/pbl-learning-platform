import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  p_id: number;
  p_name: string;

  groupers: User[];

  user1 = {
    u_id: 'S001',
    type: 'student',
    u_name: 'student_1_test',
    gender: 'man',
    description: '5student_1 for test',
    image: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  };
  user2 = {
    u_id: 'S002',
    type: 'student',
    u_name: 'student_2_test',
    gender: 'man',
    description: '3student_2 for test',
    image: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  };
  constructor(    
    private route: ActivatedRoute, 
    private userService: UserService, 
  ) { }

  ngOnInit(): void {
    // get params
    this.route.queryParams.subscribe(
      (params: {p_id: string, p_name: string}) => {
        this.p_id = 1;
        this.p_name = "pbl_learning";
      }
    );

    // get groupers
    // this.getGroupers();
    this.groupers = [this.user1, this.user2];
  }

  getGroupers(): void {
    this.userService.getGroupersByProjectId(Number(this.p_id)).subscribe((data) => {
      this.groupers = data.groupers;
    })
  }

  stringifyGroupers(): string {
    return JSON.stringify(this.groupers);
  }

}
