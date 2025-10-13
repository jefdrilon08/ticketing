import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _authenticityToken;
var $message;
var templateErrorList;
var _setAuthenticityToken = function() {
    _authenticityToken = $("meta[name='csrf-token']").attr("content");
};

var _cacheDom = function() {
    var $areaSelect = $('#area-select');
    var $clusterSelect = $('#cluster-select');
    var $branchSelect = $('#branch-select');
    var clustersData = $('#dropdown-data').data('clusters');
    var branchesData = $('#dropdown-data').data('branches');
    var $clustersJson = $('#clusters-json');
    
    var $branchesJson = $('#branches-json');

    if ($clustersJson.length) {
        try { clustersData = JSON.parse($clustersJson.text()); } catch (e) { clustersData = []; }
    }
    if ($branchesJson.length) {
        try { branchesData = JSON.parse($branchesJson.text()); } catch (e) { branchesData = []; }
    }
    $areaSelect.on('change', function() {
        var selectedAreaId = $(this).val();
        var filteredClusters = clustersData.filter(function(c) {
            return c.area_id.toString() === selectedAreaId.toString();
        });

        $clusterSelect.empty();
        $clusterSelect.append($('<option>', { value: '', text: '--SELECT--' }));
        filteredClusters.forEach(function(c) {
            $clusterSelect.append($('<option>', { value: c.id, text: c.name }));
        });
        $branchSelect.empty();
        $branchSelect.append($('<option>', { value: '', text: '--SELECT--' }));
    });

    $clusterSelect.on('change', function() {
        var selectedClusterId = $(this).val();
        var filteredBranches = branchesData.filter(function(b) {
            return b.cluster_id.toString() === selectedClusterId.toString();
        });

        $branchSelect.empty();
        $branchSelect.append($('<option>', { value: '', text: '--SELECT--' }));
        filteredBranches.forEach(function(b) {
            $branchSelect.append($('<option>', { value: b.id, text: b.name }));
        });
    });
};

var _bindEvents = function() {
    // No events for now
};


var init = function() {
    _setAuthenticityToken();
    _cacheDom();
    _bindEvents();
};


export default { init: init };
