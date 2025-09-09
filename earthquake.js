const map = L.map('map').setView([20, 0], 2);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Create a layer group for earthquake markers
        const earthquakeLayer = L.layerGroup().addTo(map);
        
        // API endpoint
        const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
        
        // Store earthquake data
        let earthquakes = [];
        
        // Function to fetch earthquake data
        async function fetchEarthquakeData() {
            showLoading();
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                earthquakes = data.features;
                processEarthquakeData();
                updateUI();
            } catch (error) {
                showError('Failed to fetch earthquake data. Please try again later.');
                console.error('Error:', error);
            }
        }
        
        // Function to process earthquake data
        function processEarthquakeData() {
            // Update the last updated time
            document.getElementById('update-time').textContent = new Date().toLocaleTimeString();
            
            // Calculate statistics
            const magnitudes = earthquakes.map(eq => eq.properties.mag);
            const depths = earthquakes.map(eq => eq.geometry.coordinates[2]);
            
            const total = earthquakes.length;
            const largestMag = Math.max(...magnitudes).toFixed(1);
            const deepest = Math.max(...depths).toFixed(0);
            const shallowest = Math.min(...depths).toFixed(0);
            
            // Update statistics
            document.getElementById('total-earthquakes').textContent = total;
            document.getElementById('largest-mag').textContent = largestMag;
            document.getElementById('deepest').textContent = deepest;
            document.getElementById('shallowest').textContent = shallowest;
        }
        
        // Function to update the UI with earthquake data
        function updateUI() {
            // Get filter values
            const magFilter = parseFloat(document.getElementById('mag-filter').value);
            const depthFilter = parseFloat(document.getElementById('depth-filter').value);
            
            // Filter earthquakes
            const filteredEarthquakes = earthquakes.filter(earthquake => {
                return earthquake.properties.mag >= magFilter && 
                       earthquake.geometry.coordinates[2] <= depthFilter;
            });
            
            // Clear existing markers
            earthquakeLayer.clearLayers();
            
            // Create earthquake list HTML
            let earthquakeListHTML = '';
            
            // Add markers for each earthquake
            filteredEarthquakes.forEach(earthquake => {
                const coords = earthquake.geometry.coordinates;
                const lat = coords[1];
                const lng = coords[0];
                const depth = coords[2];
                const mag = earthquake.properties.mag;
                const place = earthquake.properties.place;
                const time = new Date(earthquake.properties.time).toLocaleString();
                
                // Determine marker color based on magnitude
                let magClass;
                if (mag < 4.0) {
                    magClass = 'mag-low';
                } else if (mag < 6.0) {
                    magClass = 'mag-medium';
                } else {
                    magClass = 'mag-high';
                }
                
                // Create marker
                const marker = L.circleMarker([lat, lng], {
                    radius: mag * 2,
                    fillColor: getColor(mag),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                
                // Bind popup to marker
                marker.bindPopup(`
                    <strong>Location:</strong> ${place}<br>
                    <strong>Magnitude:</strong> ${mag}<br>
                    <strong>Depth:</strong> ${depth} km<br>
                    <strong>Time:</strong> ${time}
                `);
                
                // Add marker to layer
                marker.addTo(earthquakeLayer);
                
                // Add to earthquake list
                earthquakeListHTML += `
                    <div class="earthquake-item" data-lat="${lat}" data-lng="${lng}">
                        <div>
                            <span class="magnitude ${magClass}">${mag}</span>
                            <span>${place}</span>
                        </div>
                        <div>${depth} km</div>
                    </div>
                `;
            });
            
            // Update earthquake list
            const earthquakeList = document.getElementById('earthquake-list');
            if (filteredEarthquakes.length === 0) {
                earthquakeList.innerHTML = '<div class="error-message">No earthquakes match the current filters</div>';
            } else {
                earthquakeList.innerHTML = earthquakeListHTML;
                
                // Add click event to list items
                const items = earthquakeList.getElementsByClassName('earthquake-item');
                Array.from(items).forEach(item => {
                    item.addEventListener('click', () => {
                        const lat = parseFloat(item.getAttribute('data-lat'));
                        const lng = parseFloat(item.getAttribute('data-lng'));
                        map.setView([lat, lng], 5);
                        
                        // Open popup for corresponding marker
                        earthquakeLayer.eachLayer(layer => {
                            if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
                                layer.openPopup();
                            }
                        });
                    });
                });
            }
        }
        
        // Function to get color based on magnitude
        function getColor(mag) {
            return mag > 6 ? '#d73027' :
                   mag > 5 ? '#fc8d59' :
                   mag > 4 ? '#fee090' :
                   mag > 3 ? '#e0f3f8' :
                   mag > 2 ? '#91bfdb' :
                             '#4575b4';
        }
        
        // Function to show loading state
        function showLoading() {
            const earthquakeList = document.getElementById('earthquake-list');
            earthquakeList.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Loading earthquakes...</div>';
        }
        
        // Function to show error message
        function showError(message) {
            const earthquakeList = document.getElementById('earthquake-list');
            earthquakeList.innerHTML = `<div class="error-message">${message}</div>`;
        }
        
        // Event listeners for filters
        document.getElementById('mag-filter').addEventListener('input', function() {
            document.getElementById('mag-display').textContent = this.value;
            document.getElementById('mag-value').textContent = this.value + '+';
            updateUI();
        });
        
        document.getElementById('depth-filter').addEventListener('input', function() {
            const value = this.value;
            document.getElementById('depth-display').textContent = value === '300' ? '300+' : value;
            document.getElementById('depth-value').textContent = value === '300' ? 'All' : `≤ ${value} km`;
            updateUI();
        });
        
        // Event listener for refresh button
        document.getElementById('refresh-btn').addEventListener('click', fetchEarthquakeData);
        
        // Initial data fetch
        fetchEarthquakeData();