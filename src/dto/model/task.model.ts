

export const TaskCreateSchema= {
    type: "object",
    properties: {
        title: { type: "string" , minLength: 3},
        description: { type: "string" , minLength: 5},
        status:{type:"string",enum: ["Completed", "InProgress", "Pending"]}
              
    },
    required: [ "description","title","status"],
    additionalProperties: false
}


export const TaskUpdateSchema= {
    type: "object",
    properties: {
        title: { type: "string" , minLength: 3},
        description: { type: "string" , minLength: 5},
        status:{type:"string",enum: ["Completed", "InProgress", "Pending"]},
        taskid:{type:"string"}
              
    },
    required: [ "taskid"],
    additionalProperties: false
}