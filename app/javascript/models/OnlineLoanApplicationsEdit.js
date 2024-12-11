import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import "pdfmake/build/pdfmake"
const pdfMake = window["pdfMake"];
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import MembershipApplicationFormDocumentBuilder from './MembershipApplicationFormDocumentBuilder.js';

var _id;
var _authenticityToken;
var _data;

var $btnSave;
var $modalSave;
var $btnConfirmSave;
var $txtPalyaSaPagiimpok;
var $txtBilangNgAbsent;
var $txtSitDown;
var $txKasalukuyangInsurance;
var $txtTungkulinBilangCoMaker;

var $txtKitaSaNegosyo;
var $txtKitaMulaSaAsawa;
var $txtGastosSaPagkain;
var $txtGastosSaBaon;
var $txtGastosSaGamot;
var $txtBayarinSaTubig;
var $txtIbaPa;
var $txtKitaMulaSaKasama;
var $txtIbaPangPinagkakakitaan;
var $txtHuluganSaCoop;
var $txtHuluganBukodSaCoop;

var _cacheDom = function() {
  
  $modalSave = new bootstrap.Modal(
    document.getElementById("modal-edit-save")
  )

  $btnSave                         = $("#btn-save");
  $btnConfirmSave                  = $("#btn-confirm-edit-save");
  
  $txtPalyaSaPagiimpok             = $("#palya-sa-pagiimpok");
  $txtBilangNgAbsent               = $("#bilang-ng-absent");
  $txtSitDown                      = $("#sit-down");
  $txKasalukuyangInsurance         = $("#kasalukuyang-insurance");
  $txtTungkulinBilangCoMaker       = $("#tungkulin-bilang-co-maker");
  
  $txtKitaSaNegosyo                = $("#kita-sa-negosyo");
  $txtKitaMulaSaAsawa              = $("#kita-mula-sa-asawa");
  $txtKitaMulaSaKasama             = $("#kita-mula-sa-kasama");
  $txtIbaPangPinagkakakitaan       = $("#iba-pang-pinagkakakitaan");



  $txtGastosSaPagkain              = $("#gastos_sa_pagkain");
  $txtGastosSaBaon                 = $("#gastos-sa-baon");
  $txtGastosSaGamot                = $("#gastos-sa-gamot");
  $txtBayarinSaTubig               = $("#bayarin-sa-tubig");
  $txtIbaPa                        = $("#iba-pa");
  $txtHuluganSaCoop                = $("#hulugan_sa_coop");
  $txtHuluganBukodSaCoop           = $("#hulugan_bukod_sa_coop");
}

var _bindEvents = function() {
  $btnSave.on("click", function() {
    _id = $(this).data('id');
    $modalSave .show();
  });



  $btnConfirmSave.on("click", function() {
    
    $.ajax({

      url: "/api/v1/online_loan_applications/update_details",
      method: "POST",
      data: {
        id:                         _id,
        palya_sa_pagiimpok:         $txtPalyaSaPagiimpok.val(),
        bilang_ng_absent:           $txtBilangNgAbsent.val(),
        sit_down:                   $txtSitDown.val(),
        kasalukuyang_insurance:     $txKasalukuyangInsurance.val(),

        tungkulin_bilang_co_maker:  $txtTungkulinBilangCoMaker.val(),
        
        kita_sa_negosyo:            $txtKitaSaNegosyo.val(),
        kita_mula_sa_asawa:         $txtKitaMulaSaAsawa.val(),
        kita_mula_sa_kasama:        $txtKitaMulaSaKasama.val(),
        iba_pang_pinagkakakitaan:   $txtIbaPangPinagkakakitaan.val(),

  
        gastos_sa_pagkain:          $txtGastosSaPagkain.val(),
        gastos_sa_baon:             $txtGastosSaBaon.val(),
        gastos_sa_gamot:            $txtGastosSaGamot.val(),
        bayarin_sa_tubig:           $txtBayarinSaTubig.val(),
        iba_pa:                     $txtIbaPa.val(),
        hulugan_sa_coop:            $txtHuluganSaCoop.val(),
        hulugan_bukod_sa_coop:      $txtHuluganBukodSaCoop.val(),

        authenticity_token:         _authenticityToken

      },
      success: function(response) {
        alert("Success!"); 
        window.location.href = "/online_loan_applications/" + response.id;
      }
    });


  });
  

}

var init = function(options) {
  //_id                 = options.id;
  _authenticityToken  = options.authenticityToken;
  //_data               = options.data;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
