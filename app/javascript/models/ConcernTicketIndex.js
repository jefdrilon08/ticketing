import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _authenticityToken;
var _selectedMembers = new Set();

var _cacheDom = function() {
    return {
        select: document.getElementById("team-member-select"),
        membersList: document.getElementById("members-list"),
        membersInput: document.getElementById("selected-members-input"),
    };
};

var _bindEvents = function(dom) {
    if (!dom.select || !dom.membersList) return;

    $(dom.select).on("change", function() {
        console.log("Member selected:", this.value, this.options[this.selectedIndex].text);
        _addMember(dom, this.value, this.options[this.selectedIndex].text);
    });
};

var _addMember = function(dom, memberId, memberName) {
    console.warn("Invalid memberId:", memberId);
    if (!memberId || _selectedMembers.has(memberId)) return;

    _selectedMembers.add(memberId);
    _updateHiddenInput(dom);

    console.log("Adding member:", memberId, memberName);
    
    let listItem = $(`
        <li class="list-group-item d-flex justify-content-between align-items-center bg-light border-0 shadow-sm p-1 text-sm member-item">
            ${memberName}
            <button type="button" class="btn btn-danger btn-sm remove-member">
                <i class="bi bi-dash"></i>
            </button>
        </li>
    `);

    listItem.on("mouseover", function() {
        $(this).addClass("bg-danger-subtle");
    });

    listItem.on("mouseout", function() {
        $(this).removeClass("bg-danger-subtle");
    });

    listItem.find(".remove-member").on("click", function() {
        _removeMember(dom, memberId, listItem);
    });

    $(dom.membersList).append(listItem);
};

var _removeMember = function(dom, memberId, listItem) {
    _selectedMembers.delete(memberId);
    _updateHiddenInput(dom);
    listItem.remove();
};

var _updateHiddenInput = function(dom) {
    dom.membersInput.value = Array.from(_selectedMembers).join(",");
};

var init = function(options) {
    _authenticityToken = options.authenticityToken;
    var dom = _cacheDom();
    _bindEvents(dom);
};

export default { init: init };
