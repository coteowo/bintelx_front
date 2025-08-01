export const sidebarOptions = [
  { name: 'Bandeja', icon: '📥' },
  { name: 'Dashboard', icon: '📊' },
  { name: 'Estadísticas', icon: '📈' },
  { name: 'Ayuda', icon: '❓' },
];

export function renderFolders(container) {
  container.innerHTML = '';
  sidebarOptions.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-gray-200';
    div.innerHTML = `<span>${opt.icon}</span><span>${opt.name}</span>`;
    container.appendChild(div);
  });
}
