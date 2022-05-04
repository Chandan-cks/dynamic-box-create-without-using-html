
class Employee { 
    name:string;  
    id:number;
    constructor(name:string,id:number) { 
       this.name = name; 
       this.id = id;
    }   
    display():void { 
       console.log("Employee Name: "+this.name);
    } 
 } 
 var obj = new Employee("chandan",101);
 console.log("Employee Name: "+obj.id);  
 obj.display();