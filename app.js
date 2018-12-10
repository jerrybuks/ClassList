
//class list
class list {
    constructor(name, regNo, phoneNo, email) {
        this.name = name;
        this.regNo =  regNo;
        this.phoneNo  = phoneNo;
        this.email = email;
    }
}

//class UI
class UI {

    addPersonToList(person){
        const list = document.getElementById('person-list');

        //create  tr element;
        const row  =  document.createElement('tr');

        row.innerHTML = `
        <td>${person.name}</td>
        <td>${person.regNo}</td>
        <td>${person.phoneNo}</td>
        <td>${person.email}</td>
        <td><a href ="#" class="delete">X</a></td>
        `;
        
        list.appendChild(row);
    }

    showAlert (message, nameOfClass) {
        const div = document.createElement('div');

        //giving the div we created a class name of 'error', which we passed to it
        div.className = `${nameOfClass}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');

        const form = document.getElementById('list-form');
        container.insertBefore(div, form);

        setTimeout(function(){
            document.querySelector(`.${nameOfClass}`).remove();
        }, 3000);

    }

    deletePerson (target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('name').value = ' ';
        document.getElementById('reg-no').value = ' ';
        document.getElementById('phone-no').value = ' ';
        document.getElementById('email').value = ' ';

    }
}

class Store {
    static getPersons() {
        let persons;
        if(localStorage.getItem('persons') === null){
            persons = [];
        } else {
            //we use Json.parse to convert the persons we are collecting to an object
            persons = JSON.parse(localStorage.getItem('persons'));
        }

        return persons;
    }

    static displayPersons() {
        const persons = Store.getPersons();

        persons.forEach(person => {
            const ui = new UI;

            //Add person to UI
            ui.addPersonToList(person);
        });
    }

    static addPerson(person ) {
        const persons = Store.getPersons();

        persons.push(person);

        localStorage.setItem('persons', JSON.stringify(persons));
    }

    static removePerson(RegNo) {
        const persons = Store.getPersons();

        persons.forEach(function(person, index){
            
            if(person.regNo === RegNo){
                persons.splice(index, 1);
            }
        });

        localStorage.setItem('persons', JSON.stringify(persons));
    }
}

//DOM load Event
document.addEventListener('DOMContentLoaded', Store.displayPersons);

//Event listeners 
document.getElementById('list-form').addEventListener('submit',
    function(e) {
    //collect form values
    const name = document.getElementById('name').value,
          regNo = document.getElementById('reg-no').value,
          phoneNo = document.getElementById('phone-no').value,
          email = document.getElementById('email').value;

          const person  =  new list(name, regNo, phoneNo, email);

    e.preventDefault();

    //instantiate UI
    const ui = new UI();

    //validation
    if(name === '' || regNo === '' || phoneNo === '' || email === ''){


        ui.showAlert('please fill in all the fields', 'error');
    }else {
         //add new  pperson to  UI class
    ui.addPersonToList(person);

    //Add to local storage
    Store.addPerson(person);

    //show sucess
    ui.showAlert('new person added', 'success')
    ui.clearFields();
    }
});

//Event listener for delete
document.getElementById('person-list').addEventListener('click', function (e) {
       
    const ui = new UI();
    ui.deletePerson(e.target);

    //Remove from local , we travered the DOM to select the reg no
    Store.removePerson(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
    
    //show message
    ui.showAlert('Person Removed', 'success');

    e.preventDefault();
   })