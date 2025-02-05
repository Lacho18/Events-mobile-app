function newUserValidation(newUser) {
    const keys = Object.keys(newUser);

    let emptyField = false;

    if (keys.length === 0) {
        emptyField = true;
    }

    keys.forEach(key => {
        if (newUser[key] === "" || newUser[key] === 0 || (Array.isArray(newUser[key]) && newUser[key].length === 0)) {
            emptyField = true;
        }
    });

    if (emptyField) {
        throw new Error("All fields are required");
    }

    if (!newUser.email.includes('@')) {
        throw new Error("The provided email is invalid!");
    }

    if (!validateEmail(newUser.email)) {
        throw new Error("Invalid email format");
    }

    if (newUser.password.length < 7) {
        throw new Error("Password should be at least 7 symbols!")
    }

    if (/^[0-9]+$/.test(newUser.password)) {
        throw new Error("The password should not contains only numbers!");
    }

    if (newUser.password !== newUser.confirmPassword) {
        throw new Error("Confirm your password correct!");
    }

    if (!newUser.dateOfBirth) {
        throw new Error("Select your date of birth!");
    }

    const today = new Date();

    if (today < newUser.dateOfBirth) {
        throw new Error("Invalid date of birth!");
    }

    const sixteenYearsAgo = new Date();
    sixteenYearsAgo.setFullYear(today.getFullYear() - 16);

    if (sixteenYearsAgo < newUser.dateOfBirth) {
        throw new Error("You should be at least 16 to create an account!");
    }
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export default newUserValidation;