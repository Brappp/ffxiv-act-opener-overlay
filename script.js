document.addEventListener('DOMContentLoaded', () => {
  initializeJobs();
});

function initializeJobs() {
  const jobSelector = document.getElementById('jobSelector');
  const jobs = ['Paladin', 'Warrior', 'Dark Knight', 'Gunbreaker', /* ... more jobs ... */];

  jobs.forEach(job => {
      const option = document.createElement('option');
      option.value = job;
      option.textContent = job;
      jobSelector.appendChild(option);
  });
}

function loadSkillsForJob(jobName) {
  // Placeholder: Replace with actual logic to load skills for the selected job
  const skills = ['Skill1', 'Skill2', 'Skill3']; // Example skills
  const skillList = document.getElementById('skillList');
  skillList.innerHTML = '';

  skills.forEach(skill => {
      const skillDiv = document.createElement('div');
      skillDiv.className = 'draggable';
      skillDiv.draggable = true;
      skillDiv.textContent = skill;
      skillList.appendChild(skillDiv);
  });

  makeSkillsDraggable();
}

function makeSkillsDraggable() {
  const draggables = document.querySelectorAll('.draggable');
  const containers = [document.getElementById('skillList'), document.getElementById('orderedSkills')];

  draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', () => {
          draggable.classList.add('dragging');
      });

      draggable.addEventListener('dragend', () => {
          draggable.classList.remove('dragging');
      });
  });

  containers.forEach(container => {
      container.addEventListener('dragover', event => {
          event.preventDefault();
          const afterElement = getDragAfterElement(container, event.clientY);
          const draggable = document.querySelector('.dragging');
          if (afterElement == null) {
              container.appendChild(draggable);
          } else {
              container.insertBefore(draggable, afterElement);
          }
      });
  });
}

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

function saveConfiguration() {
  const configName = document.getElementById('configName').value;
  const skillOrders = Array.from(document.querySelectorAll('#orderedSkills .draggable')).map(el => el.textContent);
  const configData = {
      job: document.getElementById('jobSelector').value,
      skillOrders
  };

  localStorage.setItem(configName, JSON.stringify(configData));
  alert('Configuration saved!');
}

function loadConfiguration() {
  const configName = document.getElementById('configName').value;
  const configData = JSON.parse(localStorage.getItem(configName));

  if (!configData) {
      alert('Configuration not found.');
      return;
  }

  document.getElementById('jobSelector').value = configData.job;
  loadSkillsForJob(configData.job);

  setTimeout(() => {
      reorderSkillsBasedOnConfig(configData.skillOrders);
  }, 100); // Adjust timeout as needed
}

function deleteConfiguration() {
  const configName = document.getElementById('configName').value;
  localStorage.removeItem(configName);
  alert('Configuration deleted!');
}

function reorderSkillsBasedOnConfig(savedSkillOrders) {
  const skillList = document.getElementById('skillList');
  const orderedSkills = document.getElementById('orderedSkills');
  orderedSkills.innerHTML = '';

  savedSkillOrders.forEach(savedSkill => {
      const skillElement = Array.from(skillList.children).find(el => el.textContent.trim() === savedSkill);

      if (skillElement) {
          orderedSkills.appendChild(skillElement.cloneNode(true));
      }
  });

  makeSkillsDraggable();
}
