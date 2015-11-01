var moment = require('moment');
var now = moment();
console.log(now.format());

console.log(now.format('h:mma')); // 6:45 pm

//now.subtract(1, "h");

console.log(now.format('YYYY MMM Do, h:mm'));
console.log(now.month());
console.log(moment.months()[now.month()]);
//console.log(moment.date);

console.log(now.format('X'));
console.log(now.format('x'));

var timestamp = 1446341354406;
var timeMoment = moment.utc(1446408400186);
console.log(timeMoment.format('YYYY MMM Do, h:mm:ss'));
console.log(timeMoment.hours());
console.log(timeMoment.local().format('YYYY MMM Do, h:mm:ss'));
console.log(timeMoment.hours());
console.log(moment().valueOf());