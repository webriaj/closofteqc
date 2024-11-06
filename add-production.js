//load unit dropdown
$(document).ready(function() {
    // Load sections on page load
    $.get('./assets/php/add-plan.php?type=sections', function(data) {
        const sections = JSON.parse(data);
        sections.forEach(section => {
            $('#section').append(new Option(section, section));
        });
    });

    // Load units when a section is selected
    $('#section').change(function() {
        const selectedSection = $(this).val();
        $('#unit').empty().append(new Option("Select Unit", ""));
        $('#line').empty().append(new Option("Select Line", ""));

        $.get('./assets/php/add-plan.php?type=units&section=' + selectedSection, function(data) {
            const units = JSON.parse(data);
            units.forEach(unit => {
                $('#unit').append(new Option(unit, unit));
            });
        });
    });

    // Load lines when a unit is selected, filtering by both section and unit
    $('#unit').change(function() {
        const selectedSection = $('#section').val();  // Get the selected section
        const selectedUnit = $(this).val();
        $('#line').empty().append(new Option("Select Line", ""));
    
        $.get(`./assets/php/add-plan.php?type=lines&section=${selectedSection}&unit=${selectedUnit}`, function(data) {
            const lines = JSON.parse(data);
            lines.forEach(line => {
                $('#line').append(new Option(line, line));
            });
        });
    });

    
    
});

$(document).ready(function() {
    // Set the current date in the date input field
    const today = new Date().toLocaleDateString('en-CA'); // Formats as YYYY-MM-DD
    $('#date').val(today);
    
    // Existing code for populating Section, Unit, and Line...
});

const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTAtCwt2VSBmwfOPyMqgKNl6DLODEyNGbPm8C88PSdeRJse88vanjtHHt1MgQzML-7bqxre5pEDlZs3/pub?gid=626934558&single=true&output=csv';
async function fetchBuyerData() {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Remove header row

        const selectBuyer = document.getElementById('buyer');
        const selectStyle = document.getElementById('style');
        const buyersSet = new Set(); // Set to store unique values
        const styleSet = new Set(); // Set to store unique values

        rows.forEach(row => {
            const buyer = row.split(',')[1]; // Column G (zero-indexed at 6)
            if (buyer && !buyersSet.has(buyer)) {
                buyersSet.add(buyer); // Add unique buyer to Set
            }
        });
        rows.forEach(row => {
            const style = row.split(',')[2]; // Column G (zero-indexed at 6)
            if (style && !styleSet.has(style)) {
                styleSet.add(style); // Add unique buyer to Set
            }
        });
        // Populate dropdown with unique buyers
        buyersSet.forEach(buyer => {
            const option = document.createElement('option');
            option.value = buyer;
            option.textContent = buyer;
            selectBuyer.appendChild(option);
        });
        styleSet.forEach(style => {
            const option = document.createElement('option');
            option.value = style;
            option.textContent = style;
            selectStyle.appendChild(option);
        });
        // Initialize Select2 on the populated dropdown
        $('#buyer').select2({
            placeholder: 'Select a Buyer',
            allowClear: true
        });
        $('#style').select2({
            placeholder: 'Select a Style',
            allowClear: true
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchBuyerData();

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Function to hide a modal by id
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle form submission
document.getElementById("production-update").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Show the loading modal
    showModal("loadingModal");

    // Create FormData object
    var formData = new FormData(this);

    // Replace with the URL of your deployed Google Apps Script web app
    var scriptUrl = 'https://script.google.com/macros/s/AKfycbwSgBdy1yHrKHuE1KSPd4SxUHqTKoTe_6V1JLzUBvqGlgkjDzcZHv1gz5JLMXLHQA3H/exec';

    // Use fetch to send the form data as a POST request to Google Apps Script
    fetch(scriptUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Hide the loading modal and show the success modal if the submission is successful
        hideModal("loadingModal");
        if (data.result === 'success') {
            showModal("successModal");
            // Optionally reset the form after submission
            document.getElementById("production-update").reset();

            // Hide the success modal after 3 seconds
            setTimeout(function() {
                hideModal("successModal");
            }, 3000); // 3000 ms = 3 seconds
            // Reload the current page
            location.reload();

        } else {
            alert('There was an error submitting the form.');
        }
    })
    .catch(error => {
        // Hide the loading modal and show an alert if there's an error
        hideModal("loadingModal");
        alert('Error: ' + error);
    });
});

//Show production
const sheetURLIN = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMwyJmH6f3e8CcgEsY2rk2ErV2bj5tK516ydWbw44wrsU0YrRU9GXHE9ewIULKCnoajNEW_Mj1oJN8/pub?gid=1670512835&single=true&output=csv';

// Function to fetch and parse the CSV data
function fetchSheetDataIN() {
    fetch(sheetURLIN)
        .then(response => response.text())
        .then(data => {
            // Parse CSV
            const rows = data.split('\n').map(row => row.split(','));

            // Loop through rows and insert them into the table
            const tableBody = document.querySelector('#productionTable tbody');
            rows.forEach((row, index) => {
                if (index > 0) {  // Skip the header row
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.trim(); // Trim any extra spaces
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching sheet data:', error);
        });
}

// Call the function to load data
fetchSheetDataIN();