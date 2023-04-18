import { AppConst } from 'app/shared/AppConst';

import * as _ from 'lodash';
import { Department } from '../department/model/department.model';
import { Project } from '../project/modal/project.modal';
import { User } from '../user/user.model';

export class Room 
{
    id: string;
    name: string;
    desc: string;
    project: Project;
    departments: Department;
    staff: User[];
    students: User[];
    status: boolean;
    creator: User;
    
    isNew?: boolean;
    isLoading?: boolean;
    statusLoading?: boolean;
    disabled?: boolean;
    index?: number;
    
    constructor(room?: any, index?: number)
    {
        this.id = room.id || '';
        this.name = room.name;
        this.desc = room.desc || '';
        this.project = room.projects ?  new Project(room.projects) : null;
        this.departments = room.department ? new Department(room.department): null
        this.staff = room.staff ? room.staff.map((i: any, idx: number) => new User(i, idx)) : [];
        this.students = room.students ? room.students.map((i: any, idx: number) => new User(i, idx)) : [];
        this.creator = new User(room.creator);
        this.isNew = false;
        this.isLoading = false;
        this.statusLoading = false;
        this.disabled = false;
        this.index = index || 0;
    }
}
