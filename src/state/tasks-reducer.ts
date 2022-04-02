import {v1} from 'uuid';
import {TasksStateType} from "../App"
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-STATUS-TASK',
    id: string,
    isDone: boolean,
    todolistId: string
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TITLE-TASK',
    id: string,
    newTitle: string,
    todolistId: string
}
//auto type(ReturnType) - good practice
export type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
//payload - good practice,
export const removeTaskAC = (payload: { taskID: string, todolistID: string }) => {
    return {type: 'REMOVE-TASK', taskID: payload.taskID, todolistID: payload.todolistID} as const
}
export const addTaskAC = (title: string, todolistID: string) => {
    return {type: 'ADD-TASK', title, todolistID} as const
}
export const changeTaskStatusAC = (id: string, isDone: boolean, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-STATUS-TASK', id, isDone, todolistId}
}
export const changeTaskTitleAC = (id: string, newTitle: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TITLE-TASK', id, newTitle, todolistId}
}

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].filter(task => task.id !== action.taskID)
            }
        }
        case 'ADD-TASK': {
            let newTask = {id: v1(), title: action.title, isDone: false};
            return {
                ...state,
                [action.todolistID]: [newTask, ...state[action.todolistID]]
            }
        }
        case 'CHANGE-STATUS-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.id
                    ? {...t, isDone: action.isDone}
                    : t)
            }
        }
        case 'CHANGE-TITLE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.id
                    ? {...t, title: action.newTitle}
                    : t)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            let newState = {...state}
            delete newState[action.id]
            return newState
        }
        default:
            throw new Error("I don't understand this type")
    }
}

