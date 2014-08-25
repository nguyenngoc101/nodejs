String.prototype.countAll = function(letter){
  var letterCount = 0;
  for(var i = 0; i < this.length; i++){
    if (this.charAt(i).toUpperCase() == letter.toUpperCase())
      ++letterCount;
  }
  return letterCount;
}

function speak(){
  console.log("Hello, I'm "+this.name);
}

function Person(name, age){
  this.name = name;
  this.age = age;
  this.speak = speak;
}

function Worker(name, age, salary) {
  Person.call(this, name, age);
  this.salary = salary;
}

Worker.prototype = Object.create(Person.prototype);


function Point(x, y) {
  this.x = x;
  this.y = y;
}

var p1 = new Point(2, 3);
var p2 = new Point(34, 40);
p2.xz = 100;
// hidden class engine V8
// speed optimization
// intilizae all object members in constructor functions
// always initialize object members in the same order
// Json = Javascript Object Notation
