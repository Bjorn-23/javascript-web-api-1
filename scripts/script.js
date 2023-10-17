async function handleForm(event) {
    event.preventDefault()

    let errors = []

    for (let i = 0; i < event.target.length; i++) {
        if (event.target[i].required) {
            errors.push(validate(event.target[i]))
        }
    }

    if (!errors.includes(false)) {
       
        const json = JSON.stringify({
            firstName: event.target['firstName'].value,
            lastName: event.target['lastName'].value,
            email: event.target['email'].value,
            phone: event.target['phone'].value,
            password: event.target['password'].value,
        })

        const res = await fetch("https://win23.azurewebsites.net/api/users", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: json
        })

        let data

        if (res.status === 200) {

            data = await res.json()
            document.getElementById("status-messages").innerHTML += `
            <div class="alert alert-success" role="alert">
                ${data} 
            </div>`
        }     
        else {
            data = await res.text()

            document.getElementById("status-messages").innerHTML = `
            <div class="alert alert-warning" role="alert">
                ${data}                
            </div>`
        }
        
        
    }

}

function validate(element) {
    let result = false
    const errorMessage = {
        firstName: "You must enter a valid first name",
        lastName: "You must enter a valid last name",
        email: "You must enter a valid email adress",
        password: "You must enter a strong valid password",
        phone: ""
    }

    switch(element.type) {
        case 'text':
            result = nameValidator(element.value)
            break;
        case 'email':
            result = emailValidator(element.value)
            break;
        case 'password':
            result = passwordValidator(element.value)
            break;
    }

    if (result) {
        document.getElementById(`${element.id}`).classList.remove('error')
        document.getElementById(`${element.id}-error`).innerText = ""
    } else {
        document.getElementById(`${element.id}`).classList.add('error')
        document.getElementById(`${element.id}-error`).innerText = errorMessage[element.id]   
    }

    return result

}

const nameValidator = (value) => {
    if (/^[a-zA-Z-'\s].{1,50}$/.test(value)) {
        return true
    }
    return false
}

const emailValidator = (value) => {
    if (/^\w+([\.-]?w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(value)) {
        return true
    }
    return false
}

const passwordValidator = (value) => {
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/.test(value)) {
        return true
    }
    return false
}