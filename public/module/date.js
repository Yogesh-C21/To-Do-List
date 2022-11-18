let today = new Date();
    locale = "en-US";
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };          
let date = today.toLocaleDateString(locale, options);

module.exports = date;
