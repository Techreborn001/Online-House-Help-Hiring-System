// $(".logo").css("color","red");

$("#user_name_profile").click( () => {
    $(".bx").toggleClass("bxs-chevron-up");
});


const dropdownInput = document.querySelector('.dropdown-input');
const dropdownOptions = document.querySelector('.dropdown-options');

// Function to add county options dynamically
function addCountyOptions() {
        const counties = [
            "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", 
            "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", 
            "Makueni",   
        "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", 
            "Samburu", "Trans-Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", 
            "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", 
            "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"   

        ];

counties.forEach(county => {
        const option = document.createElement('div');   

        option.classList.add('dropdown-option');
        option.setAttribute('data-value', county.toLowerCase());
        option.textContent = county;
        dropdownOptions.appendChild(option);
    });
}

// Call the function to add the county options
addCountyOptions();

// Get all the dynamically added options
const options = document.querySelectorAll('.dropdown-option');

dropdownInput.addEventListener('input', () => {
    const inputValue = dropdownInput.value.toLowerCase();
    let matchingOptions = false;

    options.forEach(option => {
        const optionText = option.textContent.toLowerCase();
        if (optionText.startsWith(inputValue)) {
        option.style.display = 'block';
        matchingOptions = true;
        } else {
        option.style.display = 'none';
        }
  });

    // Show options if there are matching options, hide if input is empty
    dropdownOptions.classList.toggle('show', matchingOptions && inputValue !== ''); 
});

options.forEach(option => {
        option.addEventListener('click', () => {
            dropdownInput.value = option.textContent;
            dropdownOptions.classList.remove('show');
        });
});

// Add an event listener to the document to detect clicks outside the dropdown
document.addEventListener('click', (event) => {
        const targetElement = event.target; 
        // Check if the click is outside the input field AND outside the dropdown options
        if (targetElement !== dropdownInput && !dropdownOptions.contains(targetElement)) {
            dropdownOptions.classList.remove('show');
        }
});



// generate random whilist items (for the demo)
var randomStringsArr = Array.apply(null, Array(100)).map(function () {
    return Array.apply(null, Array(~~(Math.random() * 10 + 3))).map(function () {
        return String.fromCharCode(Math.random() * (123 - 97) + 97)
    }).join('') + '@gmail.com'
})

var input = document.querySelector('.customLook'),
    button = input.nextElementSibling,
    tagify = new Tagify(input, {
        editTags: {
            keepInvalid: false, // better to auto-remove invalid tags which are in edit-mode (on blur)
        },
        // email address validation (https://stackoverflow.com/a/46181/104380)
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        whitelist: randomStringsArr,
        callbacks: {
            "invalid": onInvalidTag
        },
        dropdown: {
            position: 'text',
            enabled: 1 // show suggestions dropdown after 1 typed character
        }
    });  // "add new tag" action-button

button.addEventListener("click", onAddButtonClick)

function onAddButtonClick() {
    tagify.addEmptyTag()
}

function onInvalidTag(e) {
    console.log("invalid", e.detail)
}