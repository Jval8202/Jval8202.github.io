const item = document.getElementById("item");
const item2 = document.getElementById("item2");
const item3 = document.getElementById("item3");

const zones = document.querySelectorAll(".dropzone");

item.addEventListener("dragstart", dragStart);
item2.addEventListener("dragstart", dragStart);
item3.addEventListener("dragstart", dragStart);

zones.forEach(zone => {
  zone.addEventListener("dragover", dragOver);
  zone.addEventListener("drop", dropItem);
});

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

function dragOver(e) {
  e.preventDefault(); // Required to allow drop
}

function dropItem(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(id);
  e.target.appendChild(draggedElement);
}
