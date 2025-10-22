import { Routes } from '@angular/router';
import { Home } from './Components/Main/my-tasks/home';

export const routes: Routes = [
    {path:'', component:Home},
    {path:'profile/:id/:name',loadComponent:()=>import('./Components/Main/profile/profile').then(c=>c.Profile)},
    {path:'signin',loadComponent:()=>import('./Components/Authentication/signin/signin').then(c=>c.Signin)},
    {path:'signup', loadComponent:()=>import('./Components/Authentication/signup/signup').then(c=>c.Signup)},
    {path:'addTask', loadComponent:()=>import('./Components/Main/add-task/add-task').then(c=>c.AddTask)},
    {path:'editTask/:id', loadComponent:()=>import('./Components/Main/edit-task/edit-task').then(c=>c.EditTask)},
    {path:'completedTasks', loadComponent:()=>import('./Components/Main/completed-tasks/completed-tasks').then(c=>c.CompletedTasks)},
    {path:'taskDesc/:id', loadComponent:()=>import('./Components/Main/taskDesc/taskDesc').then(c=>c.TaskDesc)},

    {path:'**', loadComponent:()=>import('./Components/Common/page404/page404').then(c=>c.Page404)}
];
