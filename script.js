// Initialize the image configuration array
let imageConfig = loadConfiguration() || [];

// Event listener for the file input change event
document.getElementById('imageLoader').addEventListener('change', handleImageUpload, false);

// Handle image file uploads
function handleImageUpload(event) {
  const files = event.target.files;
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Push the image data into the configuration array
      imageConfig.push(e.target.result);
      // Update the UI to reflect the new list of images
      updateImageList();
    };
    reader.readAsDataURL(file); // Convert the file to a data URL
  }
}

// Update the image list UI
function updateImageList() {
  const imageList = document.getElementById('imageList');
  imageList.innerHTML = ''; // Clear out the current list

  imageConfig.forEach((imageSrc, index) => {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.classList.add('draggable');
    img.dataset.index = index;
    img.style.backgroundImage = `url(${imageSrc})`; // Set the image as the background
    imageList.appendChild(img);
  });

  // Re-initialize the drag-and-drop functionality
  makeListDraggable();
}

// Make the list of images draggable
function makeListDraggable() {
  const draggables = document.querySelectorAll('.draggable');
  const container = document.getElementById('imageList');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
      draggable.classList.add('dragging');
      e.dataTransfer.setData('text/plain', draggable.dataset.index);
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });

  container.addEventListener('drop', (e) => {
    const index = e.dataTransfer.getData('text/plain');
    const draggable = document.querySelector(`[data-index="${index}"]`);
    const afterElement = getDragAfterElement(container, e.clientY);
    const newIndex = afterElement ? afterElement.dataset.index : imageConfig.length;
    moveArrayItem(imageConfig, index, newIndex);
    updateImageList(); // Update the list to reflect the new order
  });
}

// Utility function to move an item in an array from one index to another
function moveArrayItem(arr, from, to) {
  const item = arr.splice(from, 1)[0];
  arr.splice(to, 0, item);
}

// Function to save the configuration to local storage
function saveConfiguration() {
  localStorage.setItem('imageConfig', JSON.stringify(imageConfig));
  alert('Configuration saved!');
}

// Function to load the configuration from local storage
function loadConfiguration() {
  const savedConfig = localStorage.getItem('imageConfig');
  return savedConfig ? JSON.parse(savedConfig) : [];
}

// Get the draggable element after which the current dragging element should be placed
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Initialize the list on page load
updateImageList();
