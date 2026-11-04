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
      const expanded = arrowParent.classList.toggle("show-menu");
      arrowParent.querySelector("[data-sidebar-toggle]")?.setAttribute("aria-expanded", String(expanded));
    });
  });

  sidebar.querySelectorAll("[data-sidebar-toggle]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const expanded = trigger.closest("li").classList.toggle("show-menu");
      trigger.setAttribute("aria-expanded", String(expanded));
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
        trigger.click();
      }
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
