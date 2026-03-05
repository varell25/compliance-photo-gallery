const API_BASE = '/properties';
let currentPropertyId = null;

// DOM Elements
const propertiesList = document.getElementById('propertiesList');
const mainView = document.getElementById('mainView');
const emptyState = document.getElementById('emptyState');
const propertyDetails = document.getElementById('propertyDetails');
const selectedPropertyName = document.getElementById('selectedPropertyName');
const selectedPropertyAddress = document.getElementById('selectedPropertyAddress');
const galleryGrid = document.getElementById('galleryGrid');

// Modals
const propertyModal = document.getElementById('propertyModal');
const imageModal = document.getElementById('imageModal');
const propertyForm = document.getElementById('propertyForm');
const imageForm = document.getElementById('imageForm');

// Buttons
const addPropertyBtn = document.getElementById('addPropertyBtn');
const addImageBtn = document.getElementById('addImageBtn');
const closePropertyModal = document.getElementById('closePropertyModal');
const cancelPropertyBtn = document.getElementById('cancelPropertyBtn');
const closeImageModal = document.getElementById('closeImageModal');
const cancelImageBtn = document.getElementById('cancelImageBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', fetchProperties);

// Fetch all properties
async function fetchProperties() {
    try {
        const response = await fetch(API_BASE);
        const properties = await response.json();
        renderSidebar(properties);
    } catch (error) {
        console.error("Failed to fetch properties:", error);
        propertiesList.innerHTML = '<div class="loading-state">Error loading properties</div>';
    }
}

// Render sidebar list
function renderSidebar(properties) {
    if (properties.length === 0) {
        propertiesList.innerHTML = '<div class="loading-state">No properties yet</div>';
        return;
    }

    propertiesList.innerHTML = properties.map(prop => `
        <div class="property-item ${prop.property_id === currentPropertyId ? 'active' : ''}" 
             onclick="selectProperty('${prop.property_id}')"
             id="sidebar-item-${prop.property_id}">
            <h4>${escapeHtml(prop.property_id)}</h4>
            <p>${escapeHtml(prop.address)}</p>
        </div>
    `).join('');
}

// Select a specific property
async function selectProperty(propertyId) {
    currentPropertyId = propertyId;

    // Update sidebar UI
    document.querySelectorAll('.property-item').forEach(el => el.classList.remove('active'));
    const activeItem = document.getElementById(`sidebar-item-${propertyId}`);
    if (activeItem) activeItem.classList.add('active');

    // Fetch details
    try {
        const response = await fetch(`${API_BASE}/${propertyId}`);
        const property = await response.json();
        renderPropertyDetails(property);
    } catch (error) {
        console.error("Failed to fetch property details:", error);
    }
}

// Render property main view
function renderPropertyDetails(property) {
    emptyState.classList.add('hidden');
    propertyDetails.classList.remove('hidden');

    selectedPropertyName.textContent = property.property_id;
    selectedPropertyAddress.textContent = property.address;

    if (property.images.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary); background: white; border-radius: var(--radius); border: 2px dashed var(--border);">
                No compliance photos uploaded yet. Click "+ Add Photo Pair" to begin.
            </div>
        `;
        return;
    }

    galleryGrid.innerHTML = property.images.map(image => `
        <div class="photo-pair-card">
            <div class="card-header">
                <strong>Compliance Pair</strong>
                <span class="compliance-badge">${escapeHtml(image.compliance_id)}</span>
            </div>
            <div class="images-container">
                <div class="image-wrapper">
                    <img src="${escapeHtml(image.original_url)}" alt="Original" loading="lazy" onerror="this.src='https://via.placeholder.com/400x225?text=Image+Not+Found'">
                    <span class="image-label">Original</span>
                </div>
                <div class="image-wrapper">
                    <img src="${escapeHtml(image.edited_url)}" alt="Edited" loading="lazy" onerror="this.src='https://via.placeholder.com/400x225?text=Image+Not+Found'">
                    <span class="image-label">Edited (Compliance)</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Event Listeners for Modals
addPropertyBtn.addEventListener('click', () => propertyModal.classList.remove('hidden'));
closePropertyModal.addEventListener('click', () => propertyModal.classList.add('hidden'));
cancelPropertyBtn.addEventListener('click', () => propertyModal.classList.add('hidden'));

addImageBtn.addEventListener('click', () => imageModal.classList.remove('hidden'));
closeImageModal.addEventListener('click', () => imageModal.classList.add('hidden'));
cancelImageBtn.addEventListener('click', () => imageModal.classList.add('hidden'));

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === propertyModal) propertyModal.classList.add('hidden');
    if (e.target === imageModal) imageModal.classList.add('hidden');
});

// Form Submissions
propertyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const propId = document.getElementById('propIdInput').value;
    const address = document.getElementById('propAddressInput').value;

    try {
        const response = await fetch(API_BASE + '/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ property_id: propId, address: address })
        });

        if (response.ok) {
            propertyModal.classList.add('hidden');
            propertyForm.reset();
            await fetchProperties();
            selectProperty(propId); // Auto-select new property
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail || 'Failed to create property'}`);
        }
    } catch (error) {
        alert('Network error occurred.');
    }
});

imageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentPropertyId) return alert('No property selected.');

    const compId = document.getElementById('compIdInput').value;
    const origUrl = document.getElementById('origUrlInput').value;
    const editedUrl = document.getElementById('editedUrlInput').value;

    try {
        const response = await fetch(`${API_BASE}/${currentPropertyId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                compliance_id: compId,
                original_url: origUrl,
                edited_url: editedUrl
            })
        });

        if (response.ok) {
            imageModal.classList.add('hidden');
            imageForm.reset();
            const updatedProperty = await response.json();
            renderPropertyDetails(updatedProperty);
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail || 'Failed to add image pair'}`);
        }
    } catch (error) {
        alert('Network error occurred.');
    }
});

// Helper Function 
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
