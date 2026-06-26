/**
 * currency.js — shared currency symbol helper
 * Depends on: sessionStorage (wageClock_currentUser), localStorage
 */
(function(global){
'use strict';

var SYMBOLS = {
  'CNY': '¥',   // ¥
  'USD': '$',
  'EUR': '€',   // €
  'GBP': '£',   // £
  'JPY': '¥',   // ¥
  'KRW': '₩',   // ₩
  'TWD': 'NT$',
  'HKD': 'HK$'
};

global.getCurrencySymbol = function(){
  try {
    var CU = sessionStorage.getItem('wageClock_currentUser') || '';
    var code = localStorage.getItem('wageClock_' + CU + '_currency') || 'CNY';
    return SYMBOLS[code] || SYMBOLS['CNY'];
  } catch(e){ return SYMBOLS['CNY']; }
};

global.formatMoney = function(amount, decimals){
  decimals = (decimals === undefined) ? 2 : decimals;
  return getCurrencySymbol() + Number(amount).toFixed(decimals);
};

})(window);
