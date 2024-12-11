let arrow;
let sidebar;
let sidebarBtn;

const _cacheDom = () => {
  arrow       = document.querySelectorAll(".arrow");
  sidebar     = document.querySelector(".sidebar");
  sidebarBtn  = document.querySelector(".bi-menu");
}

const _bindEvents = () => {
  arrow.forEach((o, i) => {
    o.addEventListener("click", (e) => {
      let arrowParent = e.target.parentElement.parentElement;
      arrowParent.classList.toggle("show-menu");
    });
  });

  sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("close");
  });
}

var init = function() {
  _cacheDom();
  _bindEvents();
}

export default { init: init }
