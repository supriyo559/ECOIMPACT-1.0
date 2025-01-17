const transportMethods = document.querySelectorAll('.transport-method');
let selectedMethod = null;

// Emission factors (kg CO2 per kilometer per passenger)
const carbonEmissionFactors = {
    train: 0.031,
    truck: 0.515,
    bike: 0.026,
};

// Product-specific cost factors (₹ per kilometer per kilogram)
const productCostFactors = {
    product1: 120, // Example: ₹0.1 per km per kg for Product A
    product2: 45, // Example: ₹0.15 per km per kg for Product B
    product3: 25, // Example: ₹0.2 per km per kg for Product C
    product4: 60, // Example: ₹0.2 per km per kg for Product C
    product5: 49, // Example: ₹0.2 per km per kg for Product C
    product6: 62, // Example: ₹0.2 per km per kg for Product C
    product7: 51, // Example: ₹0.2 per km per kg for Product C
    product8: 85, // Example: ₹0.2 per km per kg for Product C
    product9: 15, // Example: ₹0.2 per km per kg for Product C
    product10: 44, // Example: ₹0.2 per km per kg for Product C
};

// Select transport method
transportMethods.forEach(method => {
    method.addEventListener('click', () => {
        transportMethods.forEach(m => m.classList.remove('active'));
        method.classList.add('active');
        selectedMethod = method.getAttribute('data-method');
    });
});

// Function to fetch distance using Google Maps Distance Matrix API
async function fetchDistance(from, to) {
    const apiKey = 'AlzaSy_IND9A5W_S2yhDOpvwaFQfixQYx-V3yBw'; // Your API key
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(to)}&mode=driving&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.rows[0].elements[0].status === "OK") {
        const distanceInMeters = data.rows[0].elements[0].distance.value;
        return distanceInMeters / 1000; // Convert to kilometers
    } else {
        throw new Error("Unable to calculate distance. Check the locations entered.");
    }
}

document.getElementById('calculate').addEventListener('click', async () => {
    const fromLocation = document.getElementById('from-location').value;
    const toLocation = document.getElementById('to-location').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const selectedProduct = document.getElementById('product').value; // Get selected product

    if (!fromLocation || !toLocation || !weight || !selectedMethod || !selectedProduct) {
        alert('Please fill in all fields, select a travel method, and choose a product.');
        return;
    }

    try {
        // Fetch the distance between locations
        const distance = await fetchDistance(fromLocation, toLocation);

        // Calculate the carbon footprint
        const emissionFactor = carbonEmissionFactors[selectedMethod];
        const carbonFootprint = (weight * distance * emissionFactor).toFixed(2);

        // Calculate the product cost
        const costPerKgPerKm = productCostFactors[selectedProduct];
        const cost = (distance * weight * costPerKgPerKm).toFixed(2);

        // Update the results on the page
        document.getElementById('carbon-footprint').textContent = `Carbon Footprint: ${carbonFootprint} kg CO2`;
        document.getElementById('product-cost').textContent = `Cost of Product: ₹${cost}`;
        document.getElementById('total-distance').textContent = `Total Distance: ${distance.toFixed(2)} km`;
    } catch (error) {
        alert(error.message);
    }
});


document.getElementById('calculate').addEventListener('click', async () => {
    const fromLocation = document.getElementById('from-location').value;
    const toLocation = document.getElementById('to-location').value;
    let weight = parseFloat(document.getElementById('weight').value);
    const weightUnit = document.getElementById('weight-unit').value; // Get selected unit
    const selectedProduct = document.getElementById('product').value; // Get selected product

    if (!fromLocation || !toLocation || !weight || !selectedMethod || !selectedProduct) {
        alert('Please fill in all fields, select a travel method, and choose a product.');
        return;
    }

    // Convert weight to kilograms if the unit is grams
    if (weightUnit === 'g') {
        weight = weight / 1000; // Convert grams to kilograms
    }

    try {
        // Fetch the distance between locations
        const distance = await fetchDistance(fromLocation, toLocation);

        // Calculate the carbon footprint
        const emissionFactor = carbonEmissionFactors[selectedMethod];
        const carbonFootprint = (weight * distance * emissionFactor).toFixed(2);

        // Calculate the product cost
        const costPerKgPerKm = productCostFactors[selectedProduct];
        const cost = ( weight * costPerKgPerKm).toFixed(2);

        // Update the results on the page
        document.getElementById('carbon-footprint').textContent = `Carbon Footprint: ${carbonFootprint} kg CO2`;
        document.getElementById('product-cost').textContent = `Cost of Product: ₹${cost}`;
        document.getElementById('total-distance').textContent = `Total Distance: ${distance.toFixed(2)} km`;
    } catch (error) {
        alert(error.message);
    }
});
