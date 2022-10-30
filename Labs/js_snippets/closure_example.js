
function NextDaysFilter(n) {
    const ending_date = 2 * n;
    //closure!
    return (task) => { return (task.date > ending_date) === true; }; //from tomorrow included
};

let myfilterfunction = NextDaysFilter(3);
//returns true if date > 3*2, false otherways

let mytask1 = { date: 8 };
let mytask2 = { date: 1 };

console.log(myfilterfunction(mytask1));
console.log(myfilterfunction(mytask2));

myfilterfunction = NextDaysFilter(5);
console.log(myfilterfunction(mytask1));
console.log(myfilterfunction(mytask2));
