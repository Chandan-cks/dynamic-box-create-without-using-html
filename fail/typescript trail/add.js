var Employee = /** @class */ (function () {
    function Employee(name, id) {
        this.name = name;
        this.id = id;
    }
    Employee.prototype.display = function () {
        console.log("Employee Name: " + this.name);
    };
    return Employee;
}());
var obj = new Employee("chandan", 101);
console.log("Employee Name: " + obj.id);
obj.display();
