// ==UserScript==
// @name         10图漫
// @namespace    http://tampermonkey2.net/
// @version      2.0.8
// @description  Multi-site comic search and chapter download userscript.
// @author       journey3510
// @homepageURL  https://github.com/zzzwannasleep/10Comic-W.Ver
// @supportURL   https://github.com/zzzwannasleep/10Comic-W.Ver/issues
// @updateURL    https://raw.githubusercontent.com/zzzwannasleep/10Comic-W.Ver/main/release/10comic.user.js
// @downloadURL  https://raw.githubusercontent.com/zzzwannasleep/10Comic-W.Ver/main/release/10comic.user.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @resource   vantcss   https://unpkg.com/vant@2.12/lib/index.css
// @require      https://unpkg.com/vue@2.6.12/dist/vue.min.js
// @require      https://unpkg.com/vant@2.12/lib/vant.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
//
// @license      GPLv3
// @include      *
// @connect      *
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 217:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".van-cell__title {\n  text-align: left;\n}\n.van-cell-group__title--inset {\n  text-align: left;\n}\n.van-button--default {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled {\n  opacity: 1 !important;\n}\n.van-tag--default {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow {\n  color: #d9d9d9 !important;\n}\n.van-popover__content {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 213:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".yi-ling-app * {\n  font-size: 14px ;\n}\n.yi-ling-app .app-container {\n  background-color: #f8f8f8;\n  padding: 10px;\n}\n.yi-ling-app ::-webkit-scrollbar {\n  width: 4px;\n  height: 5px;\n  border-radius: 15px;\n  -webkit-border-radius: 15px;\n}\n.yi-ling-app ::-webkit-scrollbar-track-piece {\n  border-radius: 15px;\n  -webkit-border-radius: 15px;\n}\n.yi-ling-app ::-webkit-scrollbar-thumb:vertical {\n  height: 5px;\n  background-color: #66ccff88;\n  border-radius: 15px;\n  -webkit-border-radius: 15px;\n}\n.yi-ling-app ::-webkit-scrollbar-thumb:horizontal {\n  width: 4px;\n  background-color: rgba(144, 147, 153, 0.5);\n  border-radius: 15px;\n  -webkit-border-radius: 15px;\n}\n.van-cell__title {\n  text-align: left;\n}\n.van-cell-group__title--inset {\n  text-align: left;\n}\n.van-button--default {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled {\n  opacity: 1 !important;\n}\n.van-tag--default {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow {\n  color: #d9d9d9 !important;\n}\n.van-popover__content {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 979:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*[data-v-5ef48958] {\n  margin: 0;\n  padding: 0;\n}\n.custom-indicator[data-v-5ef48958] {\n  position: absolute;\n  height: 700px;\n  right: 5px;\n  bottom: 5px;\n  padding: 2px 5px;\n  font-size: 14px;\n  background: rgba(0, 0, 0, 0.1);\n}\n#thebtn[data-v-5ef48958] {\n  position: fixed;\n  top: 150px;\n  right: 600px;\n  z-index: 999999 !important;\n}\n.van-cell__title[data-v-5ef48958] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-5ef48958] {\n  text-align: left;\n}\n.van-button--default[data-v-5ef48958] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-5ef48958] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-5ef48958] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-5ef48958] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-5ef48958] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-5ef48958] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-5ef48958] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 502:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".yi-ling-app[data-v-5ef48958] {\n  position: fixed;\n  z-index: 100000;\n}\n.yi-ling-app #app-right[data-v-5ef48958] {\n  height: 800px;\n  width: 420px;\n  position: fixed;\n  right: 0;\n  top: 50%;\n  transform: translateY(-50%);\n  transform-origin: right top;\n  z-index: 999999 !important;\n}\n.card[data-v-5ef48958] {\n  background-color: #f8f8f8;\n  border: solid 1px #66ccffee;\n  border-radius: 25px ;\n  transition: all 0.5s;\n  box-shadow: 2px 3px 3px 2px #66ccff55;\n}\n.card #border-top-set[data-v-5ef48958] {\n  border-top-left-radius: 25px;\n  border-top-right-radius: 25px;\n  overflow: hidden;\n}\n.card #border-bottom-set[data-v-5ef48958] {\n  border-bottom-left-radius: 25px;\n  border-bottom-right-radius: 25px;\n  overflow: hidden;\n}\n.card .swipeitem[data-v-5ef48958] {\n  height: 697px;\n  padding-bottom: 5px;\n}\n.card__btn[data-v-5ef48958] {\n  transition: all 0.5s;\n  border-radius: 30px 0 0 30px;\n  width: 30px;\n  height: 60px;\n  background-color: #66ccff96;\n  cursor: pointer;\n  position: absolute;\n  right: 100%;\n  top: 50%;\n  text-align: center;\n}\n.card__btn svg[data-v-5ef48958] {\n  height: 20px;\n  width: 20px;\n  position: absolute;\n  right: 5px;\n  top: 20px;\n  transition: all 0.5s;\n  color: #ee000088;\n}\n.card--hide[data-v-5ef48958] {\n  transform: translate(100%, -50%) !important;\n}\n.card--hide .card__btn svg[data-v-5ef48958] {\n  transform: rotate(180deg);\n}\n.test[data-v-5ef48958] {\n  position: absolute;\n  position: relative;\n  cursor: default;\n  height: 600px;\n}\n.van-cell__title[data-v-5ef48958] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-5ef48958] {\n  text-align: left;\n}\n.van-button--default[data-v-5ef48958] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-5ef48958] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-5ef48958] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-5ef48958] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-5ef48958] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-5ef48958] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-5ef48958] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 322:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".import-page[data-v-3e5333e4] {\n  display: flex;\n  flex-direction: column;\n  margin-top: 5px;\n  height: 620px;\n  max-height: 620px;\n  justify-content: space-between;\n}\n.import-page #codeTextarea[data-v-3e5333e4] {\n  border-color: #66ccff88;\n  border-radius: 8px;\n  padding: 2px;\n}\n.van-cell__title[data-v-3e5333e4] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-3e5333e4] {\n  text-align: left;\n}\n.van-button--default[data-v-3e5333e4] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-3e5333e4] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-3e5333e4] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-3e5333e4] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-3e5333e4] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-3e5333e4] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-3e5333e4] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 655:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "#search-page[data-v-4ad41bb8] {\n  width: 1100px;\n  height: 600px;\n  max-height: 600px;\n  overflow: hidden;\n  position: fixed;\n  top: 50%;\n  left: 40%;\n  transform: translate(-50%, -50%);\n  border: 1px solid #ee000066;\n  border-radius: 15px;\n  box-shadow: 2px 4px 4px 2px #ee000022;\n  background-color: #fff;\n  z-index: 9999999;\n}\n#search-page #search-page-top[data-v-4ad41bb8] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 5px;\n  border-bottom: 1px solid #66ccff88;\n}\n#search-page #search-page-top .search-input-btn[data-v-4ad41bb8] {\n  margin-left: 400px;\n  margin-top: 10px;\n  width: 320px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#search-page #search-page-top .search-input-btn input[data-v-4ad41bb8] {\n  border: 1px solid #66ccff88;\n  height: 20px;\n  width: 200px;\n  border-radius: 5px;\n  background: #fff;\n  font-size: 15px;\n  line-height: 20px;\n  padding-left: 15px;\n}\n#search-page #search-page-top .search-input-btn[data-v-4ad41bb8] .van-button--small {\n  height: 25px;\n}\n#search-page #search-page-top #close-search-btn[data-v-4ad41bb8] {\n  color: #66ccff88;\n  display: flex;\n  margin-top: 2px;\n  font-size: 40px;\n  height: 40px;\n  background-color: #fff;\n  border-radius: 20px;\n  margin-top: 5px;\n  margin-right: 5px;\n}\n#search-page #search-page-top #close-search-btn[data-v-4ad41bb8]:hover {\n  color: red;\n  transform: rotate(180deg);\n  transition: all 1s;\n}\n#search-page #search-page-bottom[data-v-4ad41bb8] {\n  height: 530px;\n  max-height: 530px;\n  overflow-y: scroll;\n}\n#search-page #search-page-bottom .origin-image-list[data-v-4ad41bb8] {\n  display: flex;\n  width: 120px;\n  flex-direction: row;\n  display: inline-block;\n  text-align: center;\n  cursor: pointer;\n  margin: 2px;\n  padding: 1px;\n}\n#search-page #search-page-bottom .origin-image-list p[data-v-4ad41bb8] {\n  overflow: hidden;\n  white-space: nowrap;\n}\n#search-page #search-page-bottom .origin-image-list[data-v-4ad41bb8]:hover {\n  border: 2px solid #66ccff88;\n}\n.van-cell__title[data-v-4ad41bb8] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-4ad41bb8] {\n  text-align: left;\n}\n.van-button--default[data-v-4ad41bb8] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-4ad41bb8] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-4ad41bb8] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-4ad41bb8] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-4ad41bb8] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-4ad41bb8] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-4ad41bb8] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 139:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".cover-page[data-v-5204468d] {\n  margin: 15px;\n  max-height: 680px;\n  overflow: auto;\n}\n.cover-hint[data-v-5204468d] {\n  color: #999;\n  font-size: 13px;\n}\n.cover-card[data-v-5204468d] {\n  margin-top: 12px;\n  padding: 12px;\n  background: #fff;\n  border-radius: 14px;\n}\n.cover-title[data-v-5204468d] {\n  margin-bottom: 10px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n}\n.cover-desc[data-v-5204468d] {\n  color: #666;\n  font-size: 13px;\n  line-height: 1.6;\n}\n.cover-actions[data-v-5204468d] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.cover-preview[data-v-5204468d] {\n  display: block;\n  max-width: 220px;\n  max-height: 280px;\n  width: auto;\n  height: auto;\n  margin-top: 10px;\n  border-radius: 10px;\n  border: 1px solid #eee;\n}\n.cover-file-input[data-v-5204468d] {\n  display: none;\n}\n.chapter-grid[data-v-5204468d] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 10px;\n}\n.chapter-thumb[data-v-5204468d] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 6px;\n  border: 1px solid #e5e5e5;\n  border-radius: 10px;\n  background: #fff;\n  cursor: pointer;\n}\n.chapter-thumb img[data-v-5204468d] {\n  width: 100%;\n  height: 120px;\n  object-fit: cover;\n  border-radius: 8px;\n}\n.chapter-thumb span[data-v-5204468d] {\n  color: #666;\n  font-size: 12px;\n}\n.chapter-thumb--active[data-v-5204468d] {\n  border-color: #1989fa;\n  box-shadow: 0 0 0 1px #1989fa inset;\n}\n.cover-bottom[data-v-5204468d] {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 16px;\n}\n.van-cell__title[data-v-5204468d] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-5204468d] {\n  text-align: left;\n}\n.van-button--default[data-v-5204468d] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-5204468d] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-5204468d] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-5204468d] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-5204468d] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-5204468d] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-5204468d] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 240:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "#downcontext[data-v-1e855a88] {\n  margin: 15px 15px;\n  max-height: 680px;\n  border-radius: 15px;\n  overflow: auto;\n}\n.comicnametag1[data-v-1e855a88] {\n  margin-left: 10px ;\n  height: 15px;\n  margin-top: 4px;\n  display: inline-block;\n  max-width: 200px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  background-color: #ee000088 !important;\n}\n#downlist[data-v-1e855a88] {\n  margin: 10px 5px;\n  padding: 5px 0px;\n  border-radius: 15px;\n  width: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  max-height: 500px;\n}\n#downlist .downitem[data-v-1e855a88] {\n  display: flex;\n  flex-direction: column;\n  width: 98%;\n}\n#downlist .downitem .itemname[data-v-1e855a88] {\n  display: flex;\n  justify-content: space-between;\n  margin: 2px 5px;\n}\n#downlist .downitem .itemname .comicnametag[data-v-1e855a88] {\n  display: inline-block;\n  width: 60px;\n  max-width: 60px;\n  text-align: center;\n  height: 18px;\n  line-height: 18px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  cursor: pointer;\n}\n#downlist .downitem .itemname .chapterspan[data-v-1e855a88] {\n  display: inline-block;\n  margin-left: 10px;\n  max-width: 200px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n#downlist .downitem .itemname .hasError[data-v-1e855a88] {\n  color: red;\n}\n.van-cell__title[data-v-1e855a88] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-1e855a88] {\n  text-align: left;\n}\n.van-button--default[data-v-1e855a88] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-1e855a88] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-1e855a88] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-1e855a88] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-1e855a88] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-1e855a88] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-1e855a88] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 386:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".follow-page[data-v-2da631cb] {\n  margin: 15px;\n  max-height: 680px;\n  overflow: auto;\n}\n.follow-page .follow-toolbar[data-v-2da631cb] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 12px;\n}\n.follow-page .follow-keyword-toolbar[data-v-2da631cb] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 12px;\n  align-items: center;\n}\n.follow-page .follow-site-panel[data-v-2da631cb],\n.follow-page .follow-result-panel[data-v-2da631cb] {\n  padding: 12px;\n  margin-bottom: 12px;\n  background: #fff;\n  border-radius: 12px;\n}\n.follow-page .follow-panel-header[data-v-2da631cb] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 10px;\n  color: #333;\n  font-size: 14px;\n  font-weight: 600;\n}\n.follow-page .follow-site-actions[data-v-2da631cb] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-bottom: 10px;\n}\n.follow-page .follow-site-grid[data-v-2da631cb] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 10px 12px;\n}\n.follow-page .follow-site-check[data-v-2da631cb] {\n  margin: 0;\n}\n.follow-page .candidate-cell[data-v-2da631cb] .van-cell__title {\n  flex: 1;\n  min-width: 0;\n}\n.follow-page .candidate-label[data-v-2da631cb] {\n  margin-top: 4px;\n  color: #666;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.follow-page .candidate-label--sub[data-v-2da631cb] {\n  font-size: 12px;\n}\n.follow-page .follow-hint[data-v-2da631cb] {\n  color: #999;\n  font-size: 13px;\n}\n.follow-page .follow-list[data-v-2da631cb] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.follow-page .follow-card[data-v-2da631cb] {\n  overflow: hidden;\n}\n.follow-page .pending-list[data-v-2da631cb] {\n  padding: 0 16px 8px;\n  color: #666;\n  font-size: 13px;\n}\n.follow-page .pending-item[data-v-2da631cb] {\n  margin-bottom: 4px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.follow-page .follow-actions[data-v-2da631cb] {\n  display: flex;\n  gap: 8px;\n  padding: 0 16px 12px;\n  flex-wrap: wrap;\n}\n.van-cell__title[data-v-2da631cb] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-2da631cb] {\n  text-align: left;\n}\n.van-button--default[data-v-2da631cb] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-2da631cb] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-2da631cb] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-2da631cb] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-2da631cb] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-2da631cb] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-2da631cb] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 647:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".homeindex[data-v-7eb2bc79] {\n  margin-top: 12px;\n  overflow-y: auto;\n  max-height: 675px;\n  min-height: 600px;\n}\n.homeindex #selectId[data-v-7eb2bc79] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.homeindex #selectId[data-v-7eb2bc79] .van-collapse-item__wrapper {\n  position: absolute;\n  width: 100%;\n}\n.homeindex #selectId[data-v-7eb2bc79] .van-collapse-item__wrapper .van-collapse-item__content {\n  background-color: #eeeeee !important;\n  border-bottom-left-radius: 15px;\n  border-bottom-right-radius: 15px;\n}\n.homeindex #selectId[data-v-7eb2bc79] .van-collapse-item__wrapper .van-collapse-item__content div:hover {\n  color: red;\n}\n.homeindex #selectId #search-ico[data-v-7eb2bc79] {\n  cursor: pointer;\n  color: #ee000088;\n  margin-right: 15px;\n}\n.van-cell__title[data-v-7eb2bc79] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-7eb2bc79] {\n  text-align: left;\n}\n.van-button--default[data-v-7eb2bc79] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-7eb2bc79] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-7eb2bc79] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-7eb2bc79] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-7eb2bc79] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-7eb2bc79] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-7eb2bc79] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 82:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".setindex .swipeitem[data-v-234d1526] {\n  display: flex;\n  flex-direction: column;\n  margin: 20px 18px 15px 18px;\n  flex: 1;\n  height: 680px;\n  max-height: 680px;\n  justify-content: space-between;\n}\n.setindex .swipeitem #setup-return[data-v-234d1526] {\n  flex: 1;\n  margin-bottom: 15px;\n  cursor: pointer;\n  font-size: 17px;\n}\n.setindex .swipeitem #setup-return[data-v-234d1526]:hover {\n  color: #ee000088;\n}\n.setindex #setpart[data-v-234d1526] {\n  border-radius: 15px;\n  background-color: #ffffff;\n  overflow: auto;\n  width: 100%;\n}\n.setindex #setpart .van-cell-group__title[data-v-234d1526] {\n  color: #78a5ff;\n  font-size: 15px;\n}\n.setindex #setpart .van-cell[data-v-234d1526] {\n  width: 100%;\n  padding: 10px 1px;\n  overflow: visible !important;\n}\n.setindex #setpart .van-cell .van-cell__value[data-v-234d1526] {\n  overflow: visible !important;\n}\n.setindex #setpart .van-cell .cellleftvalue[data-v-234d1526] {\n  flex: 1;\n}\n.setindex #setpart .van-cell .cellrightvalue[data-v-234d1526] {\n  flex: 0.5 !important;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropbtn[data-v-234d1526] {\n  width: 90px;\n  background-color: #aadafb;\n  color: white;\n  padding: 2px 5px;\n  font-size: 16px;\n  border: none;\n  cursor: pointer;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropbtn[data-v-234d1526]:hover,\n.setindex #setpart .van-cell .cellrightvalue .dropbtn[data-v-234d1526]:focus {\n  background-color: #47b1f7;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropdown[data-v-234d1526] {\n  position: relative;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropdown-content[data-v-234d1526] {\n  position: absolute;\n  right: 0;\n  background-color: #fff;\n  min-width: 90px;\n  overflow: auto;\n  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);\n  z-index: 1;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropdown-content a[data-v-234d1526] {\n  color: black;\n  padding: 0px 2px;\n  text-decoration: none;\n  text-align: center;\n  display: block;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropdown a[data-v-234d1526]:hover {\n  background-color: #ddd;\n}\n.setindex #setpart .van-cell .cellrightvalue .show[data-v-234d1526] {\n  display: block;\n}\n.setindex #setpart .van-cell .rightbutton[data-v-234d1526] {\n  flex-direction: row-reverse;\n}\n.setindex #setpart .van-cell .custom-title[data-v-234d1526] {\n  text-align: left;\n}\n.setindex #setpart .van-cell .img-down-range-input[data-v-234d1526] {\n  width: 40px;\n  height: 18px;\n  margin-right: 2px;\n  border: 1px #66ccff solid;\n  border-radius: 10px;\n  text-align: center;\n  background: #fff;\n}\n.setindex #setpart .van-cell .long-input[data-v-234d1526] {\n  width: 190px;\n  height: 18px;\n  margin-right: 2px;\n  border: 1px #66ccff solid;\n  border-radius: 10px;\n  text-align: center;\n  background: #fff;\n  padding: 0 8px;\n}\n.setindex #setpart .van-cell #max-splicing-height-input[data-v-234d1526] {\n  width: 80px;\n  height: 18px;\n  margin-right: 2px;\n  border: 1px #66ccff solid;\n  border-radius: 10px;\n  text-align: center;\n  background: #fff;\n}\n.setindex #setpart .van-cell #max-splicing-height-input[data-v-234d1526]::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n}\n.setindex #setpart .van-cell #max-splicing-height-input[data-v-234d1526]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n}\n.setindex #setpart .van-cell #hot-key-input[data-v-234d1526] {\n  width: 35px;\n  height: 18px;\n  margin-right: 2px;\n  border: 1px #66ccff solid;\n  border-radius: 10px;\n  text-align: center;\n  background: #fff;\n}\n.setindex #setpart .van-cell .rightslider[data-v-234d1526] {\n  margin: 10px 15px;\n  width: 120px;\n}\n.setindex #setpart .van-cell .rightslider .custom-button[data-v-234d1526] {\n  width: 20px;\n  color: #fff;\n  font-size: 14px;\n  line-height: 15px;\n  text-align: center;\n  background-color: #ee0a24;\n  border-radius: 100px;\n}\n.setindex #set-bottom[data-v-234d1526] {\n  display: flex;\n  justify-content: center;\n  margin-top: 7px;\n  margin-bottom: 5px;\n}\n.van-cell__title[data-v-234d1526] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-234d1526] {\n  text-align: left;\n}\n.van-button--default[data-v-234d1526] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-234d1526] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-234d1526] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-234d1526] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-234d1526] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-234d1526] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-234d1526] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 614:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".comiclist[data-v-657d4b24] {\n  margin-top: 10px;\n  position: relative;\n  height: 690px;\n  font-size: 14px !important;\n}\n#overlayDom[data-v-657d4b24] {\n  background-color: #eeeeeece;\n}\n#select-list[data-v-657d4b24] {\n  margin: 0 15px;\n}\n#select-list #select-list-top[data-v-657d4b24] {\n  display: flex;\n  flex-direction: column;\n  background-color: #fff;\n  padding: 0 10px 0 10px;\n  min-height: 30px;\n  border-bottom: 1px solid #ccc5;\n  border-radius: 10px;\n}\n#select-list #select-list-top #select-list-info[data-v-657d4b24] {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  flex: 1;\n  min-height: 30px;\n}\n#select-list #select-list-top #select-list-info #select-list-info-left[data-v-657d4b24] {\n  display: flex;\n  width: 95px;\n  justify-content: space-between;\n  align-items: center;\n}\n#select-list #select-list-top #select-list-info #select-list-info-left span.span-circle[data-v-657d4b24] {\n  width: 14px;\n  height: 14px;\n  display: flex;\n  border-radius: 7px;\n  cursor: pointer;\n}\n#select-list #select-list-top #select-list-info #select-show-edit[data-v-657d4b24] {\n  margin: 10px;\n}\n#select-list #select-list-2[data-v-657d4b24] {\n  margin-top: 5px;\n  overflow: hidden;\n}\n#select-list #select-list-2 #select-list-2-1[data-v-657d4b24] {\n  max-height: 585px;\n  overflow-y: auto;\n}\n#select-list #select-list-2 #select-list-2-1[data-v-657d4b24] ::-webkit-scrollbar-track-piece {\n  background-color: #fff !important;\n}\n#select-list #select-list-2 #select-list-2-1 .input-chaptername[data-v-657d4b24] {\n  border: 1px solid #66ccff88;\n  flex: 1;\n  border-radius: 5px;\n  background: #fff;\n  line-height: 20px;\n  padding-left: 15px;\n  padding-top: 1px;\n}\n#select-list .van-cell-group--inset[data-v-657d4b24] {\n  margin: 0 0 !important;\n  overflow: hidden;\n  border-radius: 8px;\n}\n#editItem[data-v-657d4b24] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n  margin: 3px 20px !important;\n  color: #ee000088;\n  flex-wrap: wrap;\n}\n#editItem .editItem-center[data-v-657d4b24] {\n  font-size: 18px;\n}\n#comicinfo[data-v-657d4b24] {\n  width: 280px;\n  margin: 20px auto;\n}\n#comicinfo .van-cell__title[data-v-657d4b24] {\n  max-width: 80px !important;\n}\ninput[data-v-657d4b24] {\n  margin-left: 5px;\n  margin-right: 5px;\n  width: 50px;\n}\n.van-cell__title[data-v-657d4b24] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-657d4b24] {\n  text-align: left;\n}\n.van-button--default[data-v-657d4b24] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-657d4b24] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-657d4b24] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-657d4b24] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-657d4b24] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-657d4b24] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-657d4b24] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 379:
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 569:
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ 216:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ 565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 795:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ 589:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ 555:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _config_setup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(393);
/* harmony import */ var vant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(871);
/* harmony import */ var vant__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vant__WEBPACK_IMPORTED_MODULE_1__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'Importpage',
  data() {
    return {
      codeText: ''
    }
  },
  methods: {
    getCode() {
      try {
        // eslint-disable-next-line no-eval
        const code = eval(this.codeText)
        const userWebInfo = (0,_config_setup__WEBPACK_IMPORTED_MODULE_0__/* .getStorage */ .cF)('userWebInfo')
        if (code.length > 0) {
          code.forEach(element => {
            userWebInfo.unshift(element)
          })
        }
        (0,_config_setup__WEBPACK_IMPORTED_MODULE_0__/* .setStorage */ .po)('userWebInfo', userWebInfo)
        this.$bus.$emit('getWeb')
        ;(0,vant__WEBPACK_IMPORTED_MODULE_1__.Toast)({
          message: '已导入',
          getContainer: '.card',
          position: 'bottom'
        })
        setTimeout(() => {
          this.$bus.$emit('changeSetupFirstPage')
        }, 1000)
      } catch (error) {
        (0,vant__WEBPACK_IMPORTED_MODULE_1__.Toast)({
          message: '请粘贴正确JSON文字',
          getContainer: '.card',
          position: 'bottom'
        })
      }
    }
  }
});


/***/ }),

/***/ 758:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bF": () => (/* binding */ AppVersion),
/* harmony export */   "r8": () => (/* binding */ isDev)
/* harmony export */ });
/* unused harmony exports AppName, AppEnv */
/* eslint-disable no-undef */
const AppName = (/* unused pure expression or super */ null && ("10图漫"))
const AppVersion = "2.0.8"
const AppEnv = "production"
const isDev = AppEnv === 'development'




/***/ }),

/***/ 393:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Iq": () => (/* binding */ appLoadinit),
/* harmony export */   "cF": () => (/* binding */ getStorage),
/* harmony export */   "po": () => (/* binding */ setStorage),
/* harmony export */   "zU": () => (/* binding */ setinit)
/* harmony export */ });
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(758);
/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
/* eslint-disable no-undef */


// 脚本存储信息
const configDefault = {
  version: _config_index__WEBPACK_IMPORTED_MODULE_0__/* .AppVersion */ .bF,
  appLoadDefault: {
    isShowUI: false,
    loadHotKey: 'V', // alt + loadHotKey
    rightSize: 100,
    centerSize: 100
  },
  maxChapterNum: 2,
  maxPictureNum: 3,
  downType: 0,
  maxSplicingHeight: 20000,
  imgIndexBitNum: 3,
  imgSplicingFlag: true,
  imgDownRange: [1, -1], // 章节图片下载范围  第1张至最后1张
  zipNameTemplate: '[站点名字][作者名][漫画名称][章节名称][多少P]',
  metadataSettings: {
    enableComicInfoXml: true,
    enableSeriesJson: false,
    enableSeriesCover: false,
    enableBangumiScrape: false,
    bangumiAccessToken: '',
    bangumiIncludeNsfw: false,
    languageISO: 'zh',
    publisher: ''
  },
  followSettings: {
    autoCheckOnLoad: true,
    checkCooldownMinutes: 30
  },
  followCheckState: {
    lastCheckAt: 0,
    lastUpdateCount: 0
  },
  followList: [],
  followSearchWebNames: [],
  bangumiMetadataCache: {},
  // downHistory: '[]', // 废弃
  userWebInfo: [],
  rootDir: '10Comic'
}

// 网页 localStorage 存储信息
const localStorageDefault = {
  ylComicDownHistory: '[]'
}

// 油猴脚本存储 废弃变量
const abandonDefault = ['downHistory']

const appLoadinit = () => {
  if (_config_index__WEBPACK_IMPORTED_MODULE_0__/* .isDev */ .r8) {
    return
  }

  for (const key in localStorageDefault) {
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, localStorageDefault[key])
    }
  }

  // 如条件全为false, 则更新设置
  if (GM_getValue('version') !== undefined && GM_getValue('version') === _config_index__WEBPACK_IMPORTED_MODULE_0__/* .AppVersion */ .bF) {
    console.log('不需要更新数据')
    return
  }
  for (const key in configDefault) {
    // 不存在，添加
    if (GM_getValue(key) === undefined) {
      GM_setValue(key, configDefault[key])
    }
  }

  // 油猴存储 去除废弃变量存储数量
  abandonDefault.forEach(word => {
    if (GM_getValue(word) !== undefined) {
      GM_deleteValue(word)
    }
  })

  GM_setValue('version', _config_index__WEBPACK_IMPORTED_MODULE_0__/* .AppVersion */ .bF)
  GM_setValue('maxChapterNum', 2)

  return true
}

const setinit = async() => {
  return new Promise((resolve, reject) => {
    if (_config_index__WEBPACK_IMPORTED_MODULE_0__/* .isDev */ .r8) {
      resolve(false)
    }
    for (const key in configDefault) {
      GM_setValue(key, configDefault[key])
    }
    resolve(true)
  })
}

const setStorage = (key, value, key2 = null) => {
  // console.log('value: ', value)
  if (key2) {
    const obj = GM_getValue(key)
    obj[key2] = value
    value = obj
  }
  GM_setValue(key, value)
  return true
}

const getStorage = (key) => {
  return GM_getValue(key)
}


/***/ }),

/***/ 872:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EQ": () => (/* binding */ getSearchableWebList),
/* harmony export */   "HL": () => (/* binding */ matchWeb),
/* harmony export */   "Iw": () => (/* binding */ searchComicsAcrossWebs),
/* harmony export */   "KK": () => (/* binding */ getComicInfoFromHtml),
/* harmony export */   "Ni": () => (/* binding */ searchFunTemplate_1),
/* harmony export */   "Os": () => (/* binding */ comicsWebInfo),
/* harmony export */   "Po": () => (/* binding */ currentComics),
/* harmony export */   "eT": () => (/* binding */ getWebList),
/* harmony export */   "jL": () => (/* binding */ findWebByUrl),
/* harmony export */   "lb": () => (/* binding */ getCurrentComicMeta)
/* harmony export */ });
/* unused harmony exports searchComicOnWeb, getAuthorNameFromDom, getChapterListFromRoot */
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(624);
/* harmony import */ var _config_setup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(393);
/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-eval */

// eslint-disable-next-line no-unused-vars




const searchFunTemplate_1 = async(data, keyword) => {
  // eslint-disable-next-line prefer-const
  let { search_add_url, search_pre, alllist_dom_css, minlist_dom_css, namelink_index, img_src, use_background, img_reg, match_reg_num } = data.searchTemplate_1
  namelink_index ? namelink_index-- : namelink_index = 0
  let searchUrl = ''
  if (search_pre) {
    searchUrl = search_pre + search_add_url + keyword
  } else {
    searchUrl = data.homepage + search_add_url + keyword
  }
  let headers = ''
  data.headers ? headers = data.headers : ''
  // 调试使用
  // data.webName === '' ? console.log('') : ''
  const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url: searchUrl, data: '', headers })
  const dom = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText).querySelector(alllist_dom_css)

  const domList = dom.querySelectorAll(minlist_dom_css)
  const searchList = []
  domList.forEach(element => {
    const obj = {}
    try {
      obj.name = element.querySelector('a').title
      const pathname = element.querySelector('a').pathname
      obj.url = data.homepage + pathname.slice(1, pathname.length)
      // 获取封面图片地址
      if (!use_background) {
        if (!img_reg) {
          const reg2 = eval('/' + img_src + `=('|")(.*?)('|")` + '/')
          obj.imageUrl = element.innerHTML.match(reg2)[2]
        } else {
          obj.imageUrl = element.innerHTML.match(img_reg)[match_reg_num]
        }
        // obj.imageUrl = element.querySelector('img').getAttribute(img_src)
      } else {
        obj.imageUrl = element.innerHTML.match(/background.*?(url)\('?(.*?)'?\)/)[2]
      }

      // 名称修正？
      if (obj.name === '') {
        let titleArr = element.innerHTML.match(/title=('|")(.*?)('|")/);

        (titleArr && titleArr.length >= 2) ? (obj.name = titleArr[2])
          : (titleArr = element.innerHTML.match(/alt=('|")(.*?)('|")/),
          (titleArr && titleArr.length >= 2) ? obj.name = titleArr[2] : '')
        // 文本 name  innerText
        obj.name === '' ? obj.name = element.querySelectorAll('a')[namelink_index].innerText : ''
      }
    } catch (error) {
      console.log('error: ', data.webName, error)
    }
    searchList.push(obj)
  })
  return new Promise((resolve, reject) => {
    resolve(searchList)
  })
}

const searchComicOnWeb = async(webRule, keyword) => {
  const currentWebRule = normalizeWebRule(webRule)
  if (!currentWebRule?.searchTemplate_1 && !currentWebRule?.searchFun) {
    return []
  }

  if (currentWebRule.searchTemplate_1) {
    return searchFunTemplate_1(currentWebRule, keyword)
  }

  if (currentWebRule.searchFun) {
    return currentWebRule.searchFun(keyword)
  }

  return []
}

const comicsWebInfo = [
  {
    domain: ['mangabz.com', 'www.mangabz.com'],
    homepage: 'https://mangabz.com/',
    webName: 'Mangabz',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '#chapterlistload',
    headers: {
      referer: 'https://mangabz.com/'
    },
    downHeaders: {
      referer: 'https://mangabz.com/'
    },
    readtype: 0,
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.container .mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/MANGABZ_MID=(\d+?);.*MANGABZ_CID=(\d+?);.*MANGABZ_IMAGE_COUNT=(\d+?);.*MANGABZ_VIEWSIGN="(.*?)".*MANGABZ_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://mangabz.com/m${group[2]}/chapterimage.ashx?cid=${group[2]}&page=${page}&key=&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5]}&_sign=${group[4]}`

      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', reqUrl)
      const codeText = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(codeText, /(function.*return .*?})/g)

      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'manhua.zaimanhua.com',
    homepage: 'https://manhua.zaimanhua.com/',
    webName: '再漫画',
    comicNameCss: '.wrap_intro_l_comic h1 a',
    chapterCss: '.tab-content-selected',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(1.5)
      const page_url = iframeWindow.__NUXT__.data.getChapters.data.chapterInfo.page_url
      document.getElementById(processData.frameId).remove()
      return page_url
    }
  },
  {
    domain: 'www.dm5.com',
    homepage: 'https://www.dm5.com/',
    webName: '动漫屋',
    comicNameCss: '.banner_detail_form > .info > p.title',
    chapterCss: '#detail-list-select-1',
    hasSpend: true,
    payKey: '-lock',
    readtype: 0,
    headers: {
      referer: 'https://www.dm5.com/'
    },
    downHeaders: {
      referer: ''
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      use_background: true
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/DM5_MID=(\d+?);.*DM5_CID=(\d+?);.*DM5_IMAGE_COUNT=(\d+?);.*DM5_VIEWSIGN="(.*?)".*DM5_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://www.dm5.com/ch1-${group[2]}/chapterfun.ashx?cid=${group[2]}&page=${page}&key=&language=1&gtk=6&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5].replaceAll(' ', '+').replaceAll(':', '%3A')}&_sign=${group[4]}`
      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url: reqUrl, useCookie: processData.isPay })

      const codeText = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'tel.dm5.com',
    homepage: 'https://tel.dm5.com/',
    webName: '动漫屋2',
    comicNameCss: '.banner_detail_form > .info > p.title',
    chapterCss: '#detail-list-select-1',
    hasSpend: true,
    payKey: '-lock',
    readtype: 0,
    headers: {
      referer: 'https://tel.dm5.com/'
    },
    downHeaders: {
      referer: ''
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/DM5_MID=(\d+?);.*DM5_CID=(\d+?);.*DM5_IMAGE_COUNT=(\d+?);.*DM5_VIEWSIGN="(.*?)".*DM5_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://tel.dm5.com/ch1-${group[2]}/chapterfun.ashx?cid=${group[2]}&page=${page}&key=&language=1&gtk=6&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5].replaceAll(' ', '+').replaceAll(':', '%3A')}&_sign=${group[4]}`
      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url: reqUrl, useCookie: processData.isPay })
      const codeText = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'godamh.com',
    homepage: 'https://godamh.com/',
    webName: 'GoDa',
    comicNameCss: '.container nav > ol > li:nth-child(3) a',
    chapterCss: '.chapterlists',
    chapterNameReg: /data-ct="(.*?)"/,
    readtype: 1,
    headers: {
      referer: 'https://godamh.com/'
    },
    getImgs: async function(context) {
      const ms = context.match(/data-ms="(\d+)".*data-cs="(\d+)"/)[1]
      const cs = context.match(/data-ms="(\d+)".*data-cs="(\d+)"/)[2]

      const url = `https://api-get-v2.mgsearcher.com/api/chapter/getinfo?m=${ms}&c=${cs}`
      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('GET', url)

      const info = JSON.parse(responseText).data.info
      const domain = info.images.line === 2 ? 'https://f40-1-4.g-mh.online' : 'https://t40-1-4.g-mh.online'
      const images = info.images.images.map(element => {
        return domain + element.url
      })
      return images
    }
  },
  {
    domain: 'www.comemh8.com',
    homepage: 'https://www.comemh8.com/',
    webName: '来漫画',
    comicNameCss: '.title h1',
    chapterCss: '#play_0 ul ',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      const arr = iframeWindow.getUrlpics()
      const host = iframeWindow.gethost()
      const image = arr.map(element => host + element)
      console.log('image: ', image)
      document.getElementById(processData.frameId).remove()
      return image
    }
  },
  {
    domain: 'www.rumanhua1.com',
    homepage: 'http://www.rumanhua1.com/',
    webName: 'R如漫画',
    comicNameCss: 'h1.name_mh',
    chapterCss: '.chapterList .chapterlistload ul',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeDom = document.getElementById(processData.frameId).contentDocument
      await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(1.5)
      const image = [...iframeDom.querySelectorAll('.main_img img')].map(img => img.dataset.src ?? img.src)
      document.getElementById(processData.frameId).remove()
      return image
    }
  },

  {
    domain: 'www.dongmanmanhua.cn',
    homepage: 'https://www.dongmanmanhua.cn/',
    webName: '咚漫',
    comicNameCss: 'h1.subj',
    chapterCss: '#_listUl',
    chapterNameReg: /alt="(.*?)"/,
    readtype: 1,
    headers: {
      referer: 'https://www.dongmanmanhua.cn/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="viewer_lst[\s\S]*?input/)[0]
      const imgobj = str.matchAll(/img src[\s\S]*?data-url="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.gaonaojin.com',
    homepage: 'https://www.gaonaojin.com/',
    webName: '仙漫网',
    comicNameCss: 'h1',
    chapterCss: '#detail-list-select-1',
    readtype: 1,
    getImgs: function(context) {
      const imgDomain = context.match(/imgDomain = '(.*?)'/)[1]
      let imgStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(context, /(function.*?return \S})(\(.*?{}\))/g)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      const imgArray = JSON.parse(imgStr)
      const imgarr = []
      imgArray.forEach(element => {
        imgarr.push(imgDomain + element)
      })
      return imgarr
    }
  },
  {
    domain: 'www.webtoons.com',
    homepage: 'https://www.webtoons.com/',
    webName: 'webtoons',
    comicNameCss: 'h1.subj',
    chapterCss: '#_listUl',
    chapterNameReg: /alt="(.*?)"/,
    readtype: 1,
    webDesc: '？需要魔法？',
    headers: {
      referer: 'https://www.webtoons.com/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="viewer_lst[\s\S]*?class="viewer_ad_area"/)[0]
      const imgobj = str.matchAll(/img src[\s\S]*?data-url="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.manshiduo.net',
    homepage: 'https://www.manshiduo.net/',
    webName: '漫士多',
    comicNameCss: '.comic-title',
    chapterCss: 'ul.chapter__list-box',
    readtype: 1,
    getImgs: async function(context) {
      const imgobj = context.matchAll(/data-original="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'comic.naver.com',
    homepage: 'https://comic.naver.com/',
    webName: 'comic.naver',
    comicNameCss: '#content > div.EpisodeListInfo__comic_info--yRAu0 > div > h2',
    chapterCss: '#content ul',
    chapterNameReg: /span.*?>(.*?)<\/span>/,
    webDesc: '找到漫画目录页再使用, 新打开页面需“重载列表”',
    readtype: 1,
    headers: {
      referer: 'https://comic.naver.com/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="wt_viewer"[\s\S]*?(<\/div>)/)[0]
      const imgobj = str.matchAll(/img src="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'komiic.com',
    homepage: 'https://komiic.com/',
    webName: 'Komiic漫画',
    comicNameCss: '.ComicMain__info .text-h6',
    chapterCss: '.v-card-text .v-container .v-row',
    chapterNameReg: / class="serial">(.*?)<\/span>/,
    webDesc: 'SPA页面, 新页面需“重载列表”重新匹配新名称',
    headers: {
      referer: 'https://komiic.com/'
    },
    readtype: 1,
    getImgs: async function(context, processData) {
      const { url } = processData
      const chapter_id = url.match(/chapter\/(\d*)\/images/)[1]
      const postUrl = 'https://komiic.com/api/query'
      const data = {
        'operationName': 'imagesByChapterId',
        'variables': {
          'chapterId': chapter_id
        },
        'query': 'query imagesByChapterId($chapterId: ID!) {\n  imagesByChapterId(chapterId: $chapterId) {\n    id\n    kid\n    height\n    width\n    __typename\n  }\n}\n'
      }
      const headers = { 'Content-Type': 'application/json' }
      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'post', url: postUrl, headers, data: JSON.stringify(data) })
      const img_data = JSON.parse(responseText).data.imagesByChapterId
      const saveImg = []
      img_data.forEach(element => {
        saveImg.push('https://komiic.com/api/image/' + element.kid)
      })
      return saveImg
    }
  },
  {
    domain: ['www.darpou.com', 'darpou.com'],
    homepage: 'https://www.darpou.com/',
    webName: '百漫谷',
    comicNameCss: '.fed-part-eone.fed-font-xvi a',
    chapterCss: '.fed-play-item.fed-drop-item.fed-visible .fed-part-rows:nth-child(2)',
    readtype: 1,
    getImgs: async function(context) {
      const txtUrl = context.match(/http(\S*).txt/gi)[0]
      const txtRes = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', txtUrl)
      let txtContext = txtRes.responseText
      txtContext = txtContext.replace(/img2.manga8.xyz/g, 'img4.manga8.xyz')
      txtContext = txtContext.replace(/img.manga8.xyz/g, 'img3.manga8.xyz')
      const imgReg = /http(\S*)jpg/g
      return txtContext.match(imgReg)
    }
  },
  {
    domain: ['qiximh2.com', 'www.qiximh2.com'],
    homepage: 'http://www.qiximh2.com/',
    webName: '七夕漫画',
    comicNameCss: '.cy_title h1',
    chapterCss: '.cy_plist ul',
    readtype: 1,
    useFrame: true,
    getImgs: function(context, processData) {
      const str = document.getElementById(processData.frameId).contentDocument.body.outerHTML
      const imgStr = str.match(/main_img[\s\S]*?class="cy_intro_r/)[0]
      const group = imgStr.matchAll(/data-src="(.*?)"/g)
      const imgarr = []
      for (const item of group) {
        imgarr.push(item[1])
      }
      document.getElementById(processData.frameId).remove()
      return imgarr
    }
  },
  {
    domain: ['www.copymanga.tv', 'www.mangacopy.com'],
    homepage: 'https://www.mangacopy.com/',
    webName: '拷贝漫画',
    comicNameCss: 'div.container .comicParticulars-title-right h6',
    chapterCss: '.tab-content > div.active > ul:nth-child(1)',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeDom = document.getElementById(processData.frameId).contentDocument
      const iframeWindow = document.getElementById(processData.frameId).contentWindow

      // 存在加载慢的可能性，10秒内持续检测是否存在数据
      await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .doThingsEachSecond */ .w1)(10, () => parseInt(iframeDom.querySelector('.comicCount')?.innerText))
      const totalNum = parseInt(iframeDom.querySelector('.comicCount')?.innerText)
      console.log('totalNum: ', totalNum)
      const contentEle = iframeDom.querySelector('ul.comicContent-list')

      // 结束滚动条件
      const end_condition_1 = () => {
        const curHeight = iframeWindow.innerHeight + iframeWindow.scrollY
        return curHeight >= contentEle.offsetHeight
      }
      const end_condition_2 = () => contentEle.childElementCount === totalNum

      // 等待滚动结果
      const result = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .startScroll */ .qs)(iframeWindow, [end_condition_1, end_condition_2])
      console.log('result: ', result)
      clearInterval(result[0])

      document.getElementById(processData.frameId).remove()

      return [...contentEle.querySelectorAll('img')].map(img => img.dataset.src ?? img.src)
    }
  },
  {
    domain: 'www.fengchemh.com',
    homepage: 'https://www.fengchemh.com/',
    webName: '风车漫画',
    comicNameCss: 'h1',
    chapterCss: '#ewave-playlist-1',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      const images = iframeWindow.params.images
      document.getElementById(processData.frameId).remove()
      return images
    }
  },
  {
    domain: ['manhuagui.com'],
    homepage: 'https://www.manhuagui.com/',
    webName: '漫画柜',
    comicNameCss: '.book-title h1',
    chapterCss: '.chapter-list',
    readtype: 1,
    // context 章节请求正文
    getImgs: function(context) {
      // 获取到 html请求正文 context 的一段js代码字符 并执行这代码获取到 图片地址信息
      // window["\x65\x76\x61\x6c"]  => eval
      // (function[\s\S]+?return \S*?}) 匿名函数部分
      // (\([\s\S]+?{}\)) 需要的参数
      const dataStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(context, /window\["\\x65\\x76\\x61\\x6c"\]\((function[\s\S]+?return \S*?})(\([\s\S]+?{}\))/g)
      const matchObj = /"files":(?<files>.*?),"finished".*"path":"(?<path>.*?)".*"e":(?<e>\d*),"m":"(?<m>.*)"}/g.exec(dataStr)
      var { files, path, e, m } = matchObj.groups
      files = JSON.parse(files)
      const image = files.map(ele => {
        return 'https://i.hamreus.com' + path + ele + '?e=' + e + '&m=' + m
      })
      return image
    }
  },
  {
    domain: 'www.36manga.com',
    homepage: 'https://www.36manga.com/',
    webName: '36漫画网',
    comicNameCss: '.book-title h1 span',
    chapterCss: '#chapter-list-4 li:not(:first-of-type)',
    readtype: 1,
    webDesc: '？可访问 ？',
    getImgs: function(context) {
      const group = context.matchAll(/chapterImages = ([\s\S]+?);var chapterPath = "([\s\S]+?)";var chapterPrice/g)
      let imgarr = []
      let middleStr = ''
      for (const item of group) {
        imgarr = JSON.parse(item[1])
        middleStr = item[2]
      }
      if (imgarr[0].search('http') === -1) {
        imgarr = imgarr.map((item) => {
          return 'https://img001.arc-theday.com/' + middleStr + item
        })
      }
      return imgarr
    }
  },
  {
    domain: 'www.gufengmh9.com',
    homepage: 'https://www.gufengmh9.com/',
    webName: '古风漫画网',
    comicNameCss: '.book-title h1 span',
    chapterCss: '.chapter-body',
    readtype: 1,
    readCssText: '.img_info {display: none;}.tbCenter img {border: 0px;}',
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: '.book-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
        strArr.push(item[2])
      }
      const josnRes = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
      let imgarr = JSON.parse(strArr[0])
      imgarr = imgarr.map((item) => {
        if (imgarr[0].search('http') === -1) {
          return imageDomian + '/' + strArr[1] + item
        }
        return item
      })
      return imgarr
    }
  },
  {
    domain: 'comic.acgn.cc',
    homepage: 'https://comic.acgn.cc/',
    webName: '动漫戏说',
    comicNameCss: '.list_navbox h3 a',
    chapterCss: '#comic_chapter > ul',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/_src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.77mh.xyz',
    homepage: 'https://www.77mh.xyz/',
    webName: '新新漫画',
    comicNameCss: '.ar_list_coc h1',
    chapterCss: '.ar_list_coc .ar_rlos_bor',
    readtype: 1,
    downHeaders: {
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    },
    searchTemplate_1: {
      search_add_url: 'k.php?k=',
      search_pre: 'https://so.77mh.xyz/',
      alllist_dom_css: '.ar_list_co ul',
      minlist_dom_css: 'dl',
      img_src: 'src'
    },
    getImgs: async function(context, processData) {
      const imgStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      const params = imgStr.match(/var atsvr="(.*?)";var msg='(.*?)'.*img_s=(.*?);.*colist_(.*?).htm/)
      let imgArray = params[2].split('|')

      const coid = window.location.href.match(/colist_(\d*?).html/)[1]
      const reqUrl = `https://css.gdbyhtl.net:5443/img_v1/cnlo_svr.asp?z=${params[1]}&s=${params[3]}&cid=${params[4]}&coid=${coid}`

      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', reqUrl)
      const getImgPre = responseText.match(/= "(.*?)"/)[1]

      if (imgArray[0].search('http') === -1) {
        imgArray = imgArray.map((item) => {
          return getImgPre + item
        })
      }
      return imgArray
    }
  },
  {
    domain: 'www.mhxqiu4.com',
    homepage: 'http://www.mhxqiu4.com/',
    webName: '漫画星球',
    comicNameCss: '.cy_title h1',
    chapterCss: '.cy_plist #mh-chapter-list-ol-0',
    readtype: 1,
    getImgs: function(context) {
      let imgStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(context, /(function.*?return \S})(\(.*?{}\))/g)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      const imgArray = JSON.parse(imgStr)
      return imgArray
    }
  },

  {
    domain: 'www.mhua5.com',
    homepage: 'https://www.mhua5.com/',
    webName: '漫画屋',
    comicNameCss: '.comic-title.j-comic-title',
    chapterCss: '.chapter__list-box.clearfix',
    readtype: 1,
    getImgs: function(context) {
      const group = context.matchAll(/data-original="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.yymanhua.com',
    homepage: 'https://www.yymanhua.com/',
    webName: 'yymanhua',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '.detail-list-form-con',
    readtype: 1,
    headers: {
      referer: 'https://www.yymanhua.com/'
    },
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow
      const cid = iframe.YYMANHUA_CID
      let page
      const _cid = iframe.YYMANHUA_CID
      const _mid = iframe.COMIC_MID
      const _dt = iframe.YYMANHUA_VIEWSIGN_DT
      const _sign = iframe.YYMANHUA_VIEWSIGN

      const imageArray = []
      const count = iframe.YYMANHUA_IMAGE_COUNT

      let currentCount = 0
      while (currentCount < count) {
        page = currentCount + 1
        console.log('page: ', page)
        const url = `https://www.yymanhua.com/m${cid}/chapterimage.ashx?cid=${cid}&page=${page}&key=&_cid=${_cid}&_mid=${_mid}&_dt=${_dt}&_sign=${_sign}`
        const { response } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url })
        console.log('response: ', response)
        const funStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(response, /(function.*?return \S;})(\(.*?{}\))/g)
        const newImgs = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(funStr, /(function.*?return .*?})()/g)
        imageArray.push(...newImgs)
        currentCount = imageArray.length
        await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(0.5)
      }
      document.getElementById(processData.frameId).remove()
      return imageArray
    }
  },
  {
    domain: ['www.xmanhua.com', 'xmanhua.com'],
    homepage: 'https://xmanhua.com/',
    webName: 'xmanhua',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '.detail-list-form-con',
    readtype: 1,
    headers: {
      referer: 'https://xmanhua.com/'
    },
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow

      const cid = iframe.XMANHUA_CID
      let page
      const _cid = iframe.XMANHUA_CID
      const _mid = iframe.COMIC_MID
      const _dt = iframe.XMANHUA_VIEWSIGN_DT
      const _sign = iframe.XMANHUA_VIEWSIGN

      const imageArray = []
      const count = iframe.XMANHUA_IMAGE_COUNT
      let currentCount = 0
      while (currentCount < count) {
        page = currentCount + 1
        console.log('page: ', page)
        const url = `https://xmanhua.com/m${cid}/chapterimage.ashx?cid=${cid}&page=${page}&key=&_cid=${_cid}&_mid=${_mid}&_dt=${_dt}&_sign=${_sign}`
        const { response } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url })
        const funStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(response, /(function.*?return \S;})(\(.*?{}\))/g)
        const newImgs = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(funStr, /(function.*?return .*?})()/g)
        imageArray.push(...newImgs)
        currentCount = imageArray.length
        await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(0.5)
      }
      document.getElementById(processData.frameId).remove()
      return imageArray
    }
  },
  {
    domain: 'www.cartoonmad.com',
    homepage: 'https://www.cartoonmad.com/',
    webName: '动漫狂',
    comicNameCss: 'table > tbody > tr:nth-child(3) > td:nth-child(2) > a:nth-child(6)',
    chapterCss: '#info',
    readtype: 1,
    downHeaders: {
      referer: 'https://www.cartoonmad.com/'
    },
    getImgs: function(context) {
      const preImgUrl = 'https:' + context.match(/<img src="(.*?)001.*?"/)[1]
      const suffix = context.match(/<img src="(.*?)001\.(.*?)"/)[2]
      const pageTotalNum = context.match(/<\/option>.*html">.*?(\d+).*?<\/select>/)[1]
      const imgArray = []
      for (let i = 0; i < pageTotalNum; i++) {
        const imgUrl = preImgUrl + (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .addZeroForNum */ .xo)(i + 1, 3) + '.' + suffix
        imgArray.push(imgUrl)
      }
      return imgArray
    }
  },
  {
    domain: 'www.zuimh.com',
    homepage: 'https://www.zuimh.com/',
    webName: '最漫画',
    comicNameCss: '.book-detail .book-title h1 span',
    chapterCss: '.chapter-body.clearfix #chapter-list-1',
    readtype: 1,
    readCssText: '.img_info {display: none;}.tbCenter img {border: 0px;}',
    getImgs: async function(context) {
      const imgStr = context.match(/var chapterImages = ([[\s\S]+?])[\s\S]+?var chapterPath/)[1]
      const imgs = eval(imgStr)
      return imgs
    }
  },
  {
    domain: 'www.6mh1.com',
    homepage: 'http://www.6mh1.com/',
    webName: '六漫画',
    comicNameCss: 'h1.name_mh',
    chapterCss: '#chapter-list1',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow
      const newImgs = JSON.parse(JSON.stringify(iframe.newImgs))
      document.getElementById(processData.frameId).remove()
      return newImgs
    }
  },
  {
    domain: 'www.mhxin.com',
    homepage: 'https://www.mhxin.com/',
    webName: '漫画芯',
    comicNameCss: '.wrap_intro_l_comic .comic_deCon h1',
    chapterCss: '.zj_list_con #chapter-list-1',
    readtype: 1,
    readCssText: '.img_info {display: none;}.comic_wraCon img {border: 0px;margin-top:0px;}',
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
        strArr.push(item[2])
      }
      let imgarr = JSON.parse(strArr[0])
      const josnRes = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
      imgarr = imgarr.map((item) => {
        if (imgarr[0].search('http') === -1) {
          return imageDomian + '/' + strArr[1] + item
        }
        return item
      })
      return imgarr
    }
  },
  {
    domain: ['www.baozimhcn.com', 'www.baozimh.com', 'cn.baozimhcn.com'],
    homepage: 'https://www.baozimh.com/',
    webName: '包子漫画',
    comicNameCss: 'h1.comics-detail__title',
    chapterCss: '.comics-detail > .l-content:nth-of-type(3) #chapter-items',
    chapterCss_2: '.comics-detail > .l-content:nth-of-type(3) .pure-g',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search/?keyword=',
      alllist_dom_css: '.pure-g.classify-items',
      minlist_dom_css: 'div.comics-card',
      img_reg: /src=('|")(.*?)\?/,
      match_reg_num: 2
    },
    getImgs: async function(context, processData) {
      const imgArray = []
      const nextReg = /next_chapter"><a href="(.*)?"[\s\S]{1,10}点击进入下一页/
      let hasNext = false
      let nextHtml = ''
      do {
        const group = context.matchAll(/<img.*src="(.*?)"/g)
        for (const item of group) {
          if (!imgArray.includes(item[1])) {
            imgArray.push(item[1])
          }
        }
        hasNext = nextReg.test(context)
        if (hasNext) {
          nextHtml = context.match(nextReg)[1]
          const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', nextHtml)
          context = responseText
        }
      } while (hasNext)
      return imgArray
    }
  },
  {
    domain: 'www.guoman.net',
    homepage: 'https://www.guoman.net/',
    webName: '爱国漫',
    comicNameCss: '.detail-info > .detail-info-title',
    chapterCss: '#chapterlistload',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/<img.*src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: ['zcymh.com', 'www.zcymh.com'],
    homepage: 'https://zcymh.com/',
    webName: '最次元',
    comicNameCss: 'h1',
    chapterCss: '#detail-chapter .bd',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/chapter-pid="[\s\S]*?<img src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.kanman.com',
    homepage: 'https://www.kanman.com/',
    webName: '看漫画',
    comicNameCss: 'h1.title',
    chapterCss: '#j_chapter_list',
    readtype: 1,
    getImgs: async function(context) {
      const imgStr = context.match(/chapter_img_list:(\[.*?\])/)[1]
      let imgArray = eval(imgStr)
      imgArray = imgArray.map(element => {
        element = element.replace('hw-chapter2', 'hw-chapter3')
        return element
      })
      return imgArray
    }
  },
  {
    domain: 'www.manhua88888.com',
    homepage: 'https://www.manhua88888.com/',
    webName: '好漫8',
    comicNameCss: '.content .title',
    chapterCss: '#j_chapter_list',
    readtype: 1,
    getImgs: function(context) {
      const group = context.matchAll(/data-echo="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  }
]

const getUserStorageList = (key) => {
  const data = (0,_config_setup__WEBPACK_IMPORTED_MODULE_1__/* .getStorage */ .cF)(key) || []
  if ((0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getType */ .oL)(data) === 'Array') {
    return data
  }
  if ((0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getType */ .oL)(data) === 'String') {
    return eval(data || '[]')
  }
  return []
}

const getWebList = () => {
  const userWebInfo = getUserStorageList('userWebInfo')
  const originalInfo = comicsWebInfo
  return { originalInfo, userWebInfo }
}

const getUserWebList = () => {
  return getUserStorageList('userWebInfo')
}

const normalizeWebRule = (webRule) => {
  if (webRule && typeof webRule.getImgs === 'string') {
    window.request = _utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY
    webRule.getImgs = funSplicing(webRule.getImgs)
  }
  if (webRule && typeof webRule.searchFun === 'string') {
    window.request = _utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY
    webRule.searchFun = funSplicing(webRule.searchFun)
  }
  return webRule
}

const getAllWebList = () => {
  return comicsWebInfo.concat(getUserWebList()).map(item => normalizeWebRule(item))
}

const getSearchableWebList = () => {
  return getAllWebList().filter(item => item.searchTemplate_1 || item.searchFun)
}

const searchComicsAcrossWebs = async(keyword, selectedWebNames = []) => {
  const result = []
  const selectedWebNameSet = new Set((selectedWebNames || []).filter(Boolean))
  const webList = getSearchableWebList().filter((item) => {
    if (selectedWebNameSet.size === 0) {
      return true
    }
    return selectedWebNameSet.has(item.webName)
  })
  for (let i = 0; i < webList.length; i++) {
    const webRule = webList[i]
    try {
      const findres = await searchComicOnWeb(webRule, keyword)
      result.push({
        webName: webRule.webName,
        webRule,
        findres: Array.isArray(findres) ? findres : []
      })
    } catch (error) {
      result.push({
        webName: webRule.webName,
        webRule,
        findres: [],
        error
      })
    }
  }
  return result
}

const findWebByUrl = (url) => {
  const hname = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getdomain */ .m1)(url)
  const allWebList = getAllWebList()

  for (let i = 0; i < allWebList.length; i++) {
    const webRule = allWebList[i]
    if ((0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getType */ .oL)(webRule.domain) === 'Array') {
      if (webRule.domain.some(domain => hname.includes(domain) || domain.includes(hname))) {
        return normalizeWebRule(webRule)
      }
    } else if (hname.includes(webRule.domain)) {
      return normalizeWebRule(webRule)
    }
  }
  return null
}

const getDomText = (root, selector) => {
  try {
    const dom = root.querySelector(selector)
    if (!dom) {
      return ''
    }
    return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)((dom.innerText || dom.textContent || '').trim())
  } catch (error) {
    return ''
  }
}

const authorPrefixReg = /^(作者|作者名|作者\/作画|作者\/作畫|作画|作畫|漫畫|漫画|原著|原作|编剧|編劇|脚本|腳本|著者|繪者|绘者|畫師|画师|原案|author(?:\(s\))?|writer(?:\(s\))?|artist(?:\(s\))?|illustrator(?:\(s\))?|creator(?:\(s\))?|story|story by|written by|script|script by|art by|illustrated by)\s*[：:：-]?\s*/i
const authorHintReg = /(作者|作者名|作画|作畫|原著|原作|编剧|編劇|脚本|腳本|著者|繪者|绘者|畫師|画师|原案|\bauthor\b|\bwriter\b|\bartist\b|\billustrator\b|\bcreator\b|\bstory\b|\bscript\b|\bwritten by\b|\bart by\b|\billustrated by\b)/i
const authorNoiseReg = /(状态|狀態|连载中|連載中|已完结|已完結|完结|完結|题材|題材|标签|標籤|类型|類型|分类|分類|更新|最新|人气|人氣|地区|地區|年份|别名|別名|简介|簡介|评分|評分|收藏|点击|點擊|进度|進度|\bstatus\b|\bongoing\b|\bcompleted\b|\bcomplete\b|\bgenre\b|\btag(?:s)?\b|\btype\b|\bcategory\b|\bcategories\b|\bupdate(?:d)?\b|\blatest\b|\bpopular(?:ity)?\b|\bregion\b|\byear\b|\balias(?:es)?\b|\bsummary\b|\bdescription\b|\brating\b|\bscore\b|\bfavorite(?:s)?\b|\bviews?\b|\bprogress\b)/i
const authorStopPatterns = [
  /状态/i, /狀態/i, /连载中/i, /連載中/i, /已完结/i, /已完結/i, /完结/i, /完結/i,
  /题材/i, /題材/i, /标签/i, /標籤/i, /类型/i, /類型/i, /分类/i, /分類/i,
  /更新/i, /最新/i, /人气/i, /人氣/i, /地区/i, /地區/i, /年份/i, /别名/i, /別名/i,
  /简介/i, /簡介/i, /评分/i, /評分/i, /收藏/i, /点击/i, /點擊/i, /进度/i, /進度/i,
  /\bstatus\b/i, /\bongoing\b/i, /\bcompleted\b/i, /\bcomplete\b/i,
  /\bgenre\b/i, /\btag\b/i, /\btags\b/i, /\btype\b/i, /\bcategory\b/i, /\bcategories\b/i,
  /\bupdate\b/i, /\bupdated\b/i, /\blatest\b/i, /\bpopularity\b/i, /\bpopular\b/i,
  /\bregion\b/i, /\byear\b/i, /\balias\b/i, /\baliases\b/i, /\bsummary\b/i, /\bdescription\b/i,
  /\brating\b/i, /\bscore\b/i, /\bfavorites\b/i, /\bfavorite\b/i, /\bview\b/i, /\bviews\b/i, /\bprogress\b/i
]

const splitAuthorTextSegments = (text) => {
  return String(text || '')
    .replace(/\r/g, '\n')
    .split(/\n|[|｜;；]/)
    .map(item => item.trim())
    .filter(Boolean)
}

const stripAuthorNoise = (text) => {
  let value = String(text || '').trim()
  let stopIndex = value.length
  authorStopPatterns.forEach((pattern) => {
    const match = value.match(pattern)
    if (match && match.index > 0 && match.index < stopIndex) {
      stopIndex = match.index
    }
  })
  if (stopIndex !== value.length) {
    value = value.slice(0, stopIndex)
  }
  value = value
    .replace(/^[\s:：/／|｜,，;；·•\-()[\]{}<>]+/, '')
    .replace(/[\s:：/／|｜,，;；·•\-()[\]{}<>]+$/, '')
    .replace(/\b(?:by)\b\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return value
}

const normalizeAuthorName = (text, allowLoose = false) => {
  if (!text) {
    return ''
  }

  const segments = splitAuthorTextSegments(text)
  const candidateList = segments.length > 0 ? segments : [String(text)]
  const preferredSegments = candidateList.filter(item => authorHintReg.test(item))
  const targetSegments = preferredSegments.length > 0 ? preferredSegments : (allowLoose ? candidateList : [])

  for (let i = 0; i < targetSegments.length; i++) {
    let authorName = targetSegments[i]
    const hasPrefix = authorPrefixReg.test(authorName)
    authorName = authorName.replace(authorPrefixReg, '')
    authorName = stripAuthorNoise(authorName)
    if (!authorName) {
      continue
    }
    if (authorNoiseReg.test(authorName)) {
      continue
    }
    if (!allowLoose && !hasPrefix) {
      continue
    }
    if (authorName.length > 40) {
      continue
    }
    return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(authorName)
  }
  return ''
}

const getAuthorNameFromDom = (root, webConfig) => {
  const selectors = []
  if (webConfig?.authorCss) {
    if ((0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getType */ .oL)(webConfig.authorCss) === 'Array') {
      selectors.push(...webConfig.authorCss)
    } else {
      selectors.push(webConfig.authorCss)
    }
  }
  selectors.push(
    '[itemprop="author"]',
    '[itemprop="creator"]',
    '[class*=author i]',
    '[id*=author i]',
    '[class*=writer i]',
    '[class*=artist i]',
    '[class*=creator i]',
    '[class*=illustrator i]',
    '[id*=writer i]',
    '[id*=artist i]',
    '[id*=creator i]',
    '[id*=illustrator i]',
    '[data-testid*=author i]'
  )

  for (let i = 0; i < selectors.length; i++) {
    const authorName = normalizeAuthorName(getDomText(root, selectors[i]), true)
    if (authorName) {
      return authorName
    }
  }

  try {
    const textDomList = root.querySelectorAll('p, span, div, li, dd, dt, a, strong')
    for (let i = 0; i < textDomList.length; i++) {
      const text = (textDomList[i].innerText || textDomList[i].textContent || '').trim()
      if (text.length === 0 || text.length > 120) {
        continue
      }
      if (authorHintReg.test(text)) {
        const authorName = normalizeAuthorName(text)
        if (authorName) {
          return authorName
        }
      }
    }
  } catch (error) {
    //
  }
  return ''
}

const getCurrentComicMeta = (webConfig, root = document) => {
  const comicName = webConfig?.comicNameCss ? getDomText(root, webConfig.comicNameCss).split('\n')[0] : ''
  const authorName = getAuthorNameFromDom(root, webConfig)
  return {
    comicName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(comicName),
    authorName
  }
}

const getChapterNameByElement = (element, chapterNameReg) => {
  let chapterName = ''
  try {
    if (!chapterNameReg) {
      chapterName = element.innerText || element.textContent || ''
    } else {
      chapterName = element.outerHTML.match(chapterNameReg)[1]
    }
  } catch (error) {
    chapterName = ''
  }
  return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(chapterName)
}

const getElementUrl = (element, baseUrl) => {
  const href = element.getAttribute('href')
  if (!href || href.startsWith('javascript:')) {
    return 'javascript:void();'
  }
  try {
    return new URL(href, baseUrl).href
  } catch (error) {
    return href
  }
}

const pushChapterData = (list, nodeList, currentWeb, type, pageUrl, comicName, authorName) => {
  const hasSpend = currentWeb.hasSpend
  const chapterNameReg = currentWeb.chapterNameReg
  nodeList.forEach(dom => {
    const urls = dom.querySelectorAll('a')
    const readtype = currentWeb.readtype

    urls.forEach((element) => {
      const chapterName = getChapterNameByElement(element, chapterNameReg)
      let currentIsPay = false
      if (hasSpend) {
        const payKey = currentWeb.payKey
        const parent = element.parentElement
        if (parent && parent.outerHTML.indexOf(payKey) > 0) {
          currentIsPay = true
        }
      }

      const data = {
        comicName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(comicName),
        authorName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(authorName || ''),
        comicPageUrl: pageUrl,
        webName: currentWeb.webName,
        chapterNumStr: '',
        chapterName,
        downChapterName: '',
        url: getElementUrl(element, pageUrl),
        characterType: type,
        readtype,
        isPay: currentIsPay,
        isSelect: false
      }

      if (data.chapterName !== '') {
        list.push(data)
      }
    })
  })
}

const getChapterListFromRoot = (root, currentWeb, pageUrl, comicName, authorName = '') => {
  const list = []
  const nodeList = root.querySelectorAll(currentWeb.chapterCss)
  pushChapterData(list, nodeList, currentWeb, 'one', pageUrl, comicName, authorName)

  if (currentWeb.chapterCss_2) {
    const nodeList2 = root.querySelectorAll(currentWeb.chapterCss_2)
    pushChapterData(list, nodeList2, currentWeb, 'many', pageUrl, comicName, authorName)
  }
  return list
}

const getComicInfoFromHtml = (html, currentWeb, pageUrl) => {
  const root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(html)
  const { comicName, authorName } = getCurrentComicMeta(currentWeb, root)
  const chapters = getChapterListFromRoot(root, currentWeb, pageUrl, comicName, authorName)
  return {
    comicName,
    authorName,
    chapters
  }
}

let currentComics = null

// 网站匹配
const matchWeb = (url) => {
  currentComics = findWebByUrl(url)
}

function funSplicing(funStr) {
  const getImgsGroup = funStr.match(/((async )?function\(.*{)([\s\S]*)/)
  const funHead = getImgsGroup[1]
  const funTail = getImgsGroup[3]
  let insertCode = ''
  if (funStr.includes('funstrToData')) {
    insertCode = insertCode + _utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData.toString */ .D.toString() + '\n'
  }
  if (funStr.includes('request')) {
    insertCode = insertCode + 'const request = window.request' + '\n'
  }
  const code = `
  (function(){
    return ${funHead}
  // 注入开始
  ${insertCode}
  // 注入结束
  ${funTail}
  })()`
  const fun = eval(code)
  // console.log('fun: ', fun.toString())
  return fun
}



/***/ }),

/***/ 624:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": () => (/* binding */ funstrToData),
/* harmony export */   "HM": () => (/* binding */ loadStyle2),
/* harmony export */   "Sc": () => (/* binding */ trimSpecial),
/* harmony export */   "U3": () => (/* binding */ parseToDOM),
/* harmony export */   "WY": () => (/* binding */ request),
/* harmony export */   "Xr": () => (/* binding */ loadStyle),
/* harmony export */   "gJ": () => (/* binding */ getImage),
/* harmony export */   "gw": () => (/* binding */ delay),
/* harmony export */   "m1": () => (/* binding */ getdomain),
/* harmony export */   "oL": () => (/* binding */ getType),
/* harmony export */   "qs": () => (/* binding */ startScroll),
/* harmony export */   "w1": () => (/* binding */ doThingsEachSecond),
/* harmony export */   "xo": () => (/* binding */ addZeroForNum),
/* harmony export */   "zd": () => (/* binding */ downFile)
/* harmony export */ });
/* unused harmony export getCookie */
/* harmony import */ var _utils_comics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(872);
/* harmony import */ var _config_setup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(393);



const loadStyle = (url, name, text) => {
  const head = document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.name = name
  style.id = name
  style.innerText = text
  head.appendChild(style)
}

const loadStyle2 = (url) => {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = url
    link.media = 'all'
    head.appendChild(link)
    setTimeout(() => {
      resolve(true)
    }, 1200)
  })
}

function trimSpecial(string) {
  if (string !== '') {
    const pattern = /[`~!@#$^\&*|{}'<>?:;~']/g
    string = string.replace(pattern, '')
    string = string.replace(/\n|\r/g, '').trim()
  }
  return string
}

const getType = (obj) => {
  const type = typeof obj
  if (type !== 'object') {
    return type
  }
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1')
}

const getFrameContent = async(id, url) => {
  const iframePromise = new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.id = id
    iframe.height = 150
    iframe.class = '10comicframe'
    iframe.style.visibility = 'hidden'
    iframe.src = url
    document.body.appendChild(iframe)
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', function() {
        resolve(iframe.contentDocument.body.outerHTML)
      })
    } else {
      iframe.onload = function() {
        resolve(iframe.contentDocument.body.outerHTML)
      }
    }
  })

  return new Promise((resolve, reject) => {
    iframePromise.then(
      (success) => {
        resolve(success)
      },
      error => {
        console.log(error)
        reject('')
      }
    )
  })
}

const getImage = async(processData) => {
  try {
    const url = processData.url
    let response = ''
    // 获取网页内容
    if (!_utils_comics__WEBPACK_IMPORTED_MODULE_0__/* .currentComics.useFrame */ .Po.useFrame) {
      const data = await request({ method: 'get', url, useCookie: processData.isPay })
      response = data.response
    } else {
      const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      const random1 = Math.round(Math.random() * 25) + 0
      const random2 = Math.round(Math.random() * 25) + 0
      const id = 'ifr' + new Date().getTime() + arr[random1] + arr[random2]
      response = await getFrameContent(id, url)
      processData.frameId = id
    }

    const imgs = await _utils_comics__WEBPACK_IMPORTED_MODULE_0__/* .currentComics.getImgs */ .Po.getImgs(response, processData)
    return new Promise((resolve, reject) => {
      resolve(imgs)
    })
  } catch (error) {
    console.log('getImageError: ', error)
    return new Promise((resolve, reject) => {
      reject([])
    })
  }
}

const request = async function request(...details) {
  let method, url, data, headers, responseType, timeout, useCookie, cookie, onload, onerror, ontimeout, tail
  // 只有一个参数
  if (details.length === 1) {
    ({ method, url, data, headers, responseType, timeout, useCookie, onload, onerror, ontimeout } = details[0])
    useCookie ? cookie = document.cookie : ''
  } else { // 含多个参数时 [*method, *url, data, headers]
    [method, url, ...tail] = details
    if (tail) {
      tail.length > 0 ? (data = tail[0]) : ''
      tail.length > 1 ? (headers = tail[1]) : ''
    }
  }

  // 设置currentComics中的 headers
  if (!headers && _utils_comics__WEBPACK_IMPORTED_MODULE_0__/* .currentComics */ .Po !== null) {
    headers = _utils_comics__WEBPACK_IMPORTED_MODULE_0__/* .currentComics.headers */ .Po.headers
  }

  // 无效地址
  if (url === null || url === '') {
    return new Promise((resolve, reject) => {
      resolve('')
    })
  }

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      method,
      url,
      headers: (headers || ''),
      data: (data || null),
      responseType,
      timeout: (timeout || 30 * 1000),
      cookie: (cookie || ''),
      onload: (onload || function(res) {
        resolve(res)
      }),
      onerror: (onerror || function(e) {
        console.log('request-e: ', e)
        resolve('onerror')
      }),
      ontimeout: (ontimeout || function() {
        console.log('ontimeout: ', ontimeout)
        resolve('timeout')
      })
    })
  })
}

let rootDir = '10Comic'

try {
  rootDir = (0,_config_setup__WEBPACK_IMPORTED_MODULE_1__/* .getStorage */ .cF)('rootDir')
} catch (error) {
  //
}

const downFile = async(...detail) => {
  let url, name, headers, onload, onerror, ontimeout
  if (detail.length === 1) {
    ({ url, name, headers, onload, onerror, ontimeout } = detail[0])
  } else {
    url = detail[0]
    name = detail[1]
  }
  name = name.replace(/\s+/ig, ' ')

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_download({
      url,
      name: rootDir + '\\' + name,
      headers: headers,
      onload: (onload || function(res) {
        resolve(true)
      }),
      onerror: (onerror || function(e) {
        console.log('downFile-e: ', e)
        resolve(false)
      }),
      ontimeout: (ontimeout || function() {
        resolve(false)
      })
    })
  })
}

const addZeroForNum = (num, bitNum) => {
  let newNum = num + ''
  if (newNum.length < bitNum) {
    const zeroStr = new Array(bitNum + 1).join('0')
    newNum = zeroStr + newNum
    newNum = newNum.slice(-bitNum)
    return newNum
  }
  return newNum
}

// 网站匹配
const getdomain = (url) => {
  if (!url) {
    url = window.location.href
  }
  let hname = ''
  var domain = url.split('/')
  if (domain[2]) {
    hname = domain[2]
  } else {
    hname = ''
  }
  return hname
}

const parseToDOM = (str) => {
  var div = document.createElement('div')
  if (typeof str === 'string') {
    div.innerHTML = str
  }
  return div
}

function delay(n) {
  return new Promise(function(resolve) {
    setTimeout(resolve, n * 1000)
  })
}

// 在规定时间内坚持做某事，直到事情成功为止
// @param {num, func} (secondNum, somethimefunc)
// * secondNum 秒数
// * somethimefunc  事情函数，执行时返回值为“true”代表成功了
async function doThingsEachSecond(secondNum, somethimefunc) {
  let i = 0; let res
  do {
    res = somethimefunc()
    if (res) {
      i = secondNum // res 成功了，还没有结束，偷偷改个时间吧
    } else {
      await delay(1)
    }
    i++
  } while (i < secondNum)
}

// 窗口滚动
// @param {window, funcArray} (scrollWindow, conditions)
// * scrollWindow 滚动窗口
// * conditions  结束滚动窗口条件函数数组
async function startScroll(scrollWindow, conditions) {
  return new Promise((resolve, reject) => {
    const id = setInterval(function() {
      scrollWindow.scrollBy(0, 50)
      conditions.forEach((func, index) => {
        // 执行func
        if (func()) {
          clearInterval(id)
          resolve([id, `condition_${index + 1}`])
        }
      })
    }, 200)
  })
}

const funstrToData = function funstrToData(str, reg) {
  const group = str.matchAll(reg)
  const func = []
  for (const item of group) {
    // 匿名函数主体
    // function (str){
    //     console.log(str);
    // }
    func.push(item[1])
    // 函数 执行参数部分
    func.push(item[2]) // ("aaaaa")
  }
  // 如没有 参数
  if (!func[1]) {
    func[1] = '()'
  }
  const code = '(' + func[0] + ')' + func[1]
  // code =>
  // (function (str){
  //   //此时会输出 aaaaa
  //   console.log(str);
  // })("aaaaa")

  // eslint-disable-next-line no-eval
  const data = eval(code)
  return data
}

const getCookie = (cookieName) => {
  const strCookie = document.cookie
  const cookieList = strCookie.split(';')

  for (let i = 0; i < cookieList.length; i++) {
    const arr = cookieList[i].split('=')
    if (cookieName === arr[0].trim()) {
      return arr[1]
    }
  }

  return ''
}


/***/ }),

/***/ 871:
/***/ ((module) => {

module.exports = vant;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: external "Vue"
const external_Vue_namespaceObject = Vue;
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_namespaceObject);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=template&id=5ef48958&scoped=true&
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "yi-ling-app" },
    [
      _c(
        "div",
        {
          staticClass: "card",
          class: { "card--hide": _vm.isHide },
          attrs: { id: "app-right" },
        },
        [
          _c(
            "div",
            [
              _c("van-nav-bar", {
                attrs: { id: "border-top-set", title: _vm.titles[this.active] },
              }),
              _vm._v(" "),
              _c(
                "van-swipe",
                {
                  ref: "swipe",
                  staticClass: "my-swipe",
                  staticStyle: { cursor: "default" },
                  attrs: {
                    "indicator-color": "white",
                    touchable: false,
                    duration: 5,
                    "initial-swipe": _vm.active,
                    "show-indicators": false,
                  },
                },
                [
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Home")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Table")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Cover")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Down")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Follow")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Setting")],
                    1
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "app-container " },
                [
                  _c(
                    "van-tabbar",
                    {
                      staticStyle: { position: "absolute" },
                      attrs: {
                        id: "border-bottom-set",
                        "active-color": "#ee0000",
                        "inactive-color": "#000",
                      },
                      model: {
                        value: _vm.active,
                        callback: function ($$v) {
                          _vm.active = $$v
                        },
                        expression: "active",
                      },
                    },
                    [
                      _c("van-tabbar-item", { attrs: { icon: "home-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "todo-list-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "photo-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "underway-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "clock-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "setting-o" } }),
                    ],
                    1
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c("div", { staticClass: "card__btn", on: { click: _vm.hide } }, [
                _c(
                  "svg",
                  {
                    staticClass: "icon",
                    attrs: {
                      t: "1663828267105",
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      "p-id": "2601",
                    },
                  },
                  [
                    _c("path", {
                      attrs: {
                        d: "M312.888889 995.555556c-17.066667 0-28.444444-5.688889-39.822222-17.066667-22.755556-22.755556-17.066667-56.888889 5.688889-79.644445l364.088888-329.955555c11.377778-11.377778 17.066667-22.755556 17.066667-34.133333 0-11.377778-5.688889-22.755556-17.066667-34.133334L273.066667 187.733333c-22.755556-22.755556-28.444444-56.888889-5.688889-79.644444 22.755556-22.755556 56.888889-28.444444 79.644444-5.688889l364.088889 312.888889c34.133333 28.444444 56.888889 73.955556 56.888889 119.466667s-17.066667 85.333333-51.2 119.466666l-364.088889 329.955556c-11.377778 5.688889-28.444444 11.377778-39.822222 11.377778z",
                        "p-id": "2134",
                        fill: "#ee000088",
                      },
                    }),
                  ]
                ),
              ]),
            ],
            1
          ),
        ]
      ),
      _vm._v(" "),
      _c("Search"),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true


;// CONCATENATED MODULE: ./src/app.vue?vue&type=template&id=5ef48958&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/home.vue?vue&type=template&id=7eb2bc79&scoped=true&
var homevue_type_template_id_7eb2bc79_scoped_true_render = function () {
  var this$1 = this
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "homeindex" },
    [
      _c(
        "div",
        {
          style: {
            position: "relative",
            margin: "-5px 0 2px 15px",
            zIndex: 999999,
          },
          attrs: { id: "selectId" },
          on: { mouseleave: _vm.leaveCollapse },
        },
        [
          _c(
            "van-collapse",
            {
              staticStyle: { width: "200px" },
              model: {
                value: _vm.activeNames,
                callback: function ($$v) {
                  _vm.activeNames = $$v
                },
                expression: "activeNames",
              },
            },
            [
              _c(
                "van-collapse-item",
                {
                  staticClass: "xxx",
                  attrs: { title: _vm.checkTitle, name: "1" },
                },
                [
                  _c(
                    "div",
                    {
                      on: {
                        click: function ($event) {
                          return _vm.checkContent(1, "原列表")
                        },
                      },
                    },
                    [_vm._v("原列表")]
                  ),
                  _vm._v(" "),
                  _c("br"),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      on: {
                        click: function ($event) {
                          return _vm.checkContent(2, "导入规则列表")
                        },
                      },
                    },
                    [_vm._v("导入规则列表")]
                  ),
                ]
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c("van-icon", {
            attrs: {
              id: "search-ico",
              name: "search",
              size: "30",
              color: "#ee0000",
            },
            on: {
              click: function () {
                this$1.$bus.$emit("showSearchPage")
              },
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _vm.checkValue == 1
        ? _c(
            "van-cell-group",
            { attrs: { inset: "" } },
            _vm._l(_vm.originalInfo, function (item, index) {
              return _c("van-cell", {
                key: index,
                attrs: { "is-link": "" },
                on: {
                  click: function ($event) {
                    return _vm.jump(item.homepage)
                  },
                },
                scopedSlots: _vm._u(
                  [
                    {
                      key: "title",
                      fn: function () {
                        return [
                          _c("span", [_vm._v(_vm._s(item.webName))]),
                          _vm._v(" "),
                          item.webDesc
                            ? _c("van-icon", {
                                attrs: {
                                  title: item.webDesc,
                                  name: "info-o",
                                  color: "red",
                                },
                              })
                            : _vm._e(),
                        ]
                      },
                      proxy: true,
                    },
                  ],
                  null,
                  true
                ),
              })
            }),
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.checkValue == 2
        ? _c(
            "div",
            [
              _c(
                "van-cell-group",
                { attrs: { inset: "" } },
                _vm._l(_vm.userWebInfo, function (item, index) {
                  return _c("van-cell", {
                    key: index,
                    attrs: { "is-link": "" },
                    on: {
                      click: function ($event) {
                        return _vm.jump(item.homepage)
                      },
                    },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", [_vm._v(_vm._s(item.webName))]),
                              _vm._v(" "),
                              item.webDesc
                                ? _c("van-icon", {
                                    attrs: {
                                      title: item.webDesc,
                                      name: "info-o",
                                      color: "red",
                                    },
                                  })
                                : _vm._e(),
                            ]
                          },
                          proxy: true,
                        },
                      ],
                      null,
                      true
                    ),
                  })
                }),
                1
              ),
            ],
            1
          )
        : _vm._e(),
    ],
    1
  )
}
var homevue_type_template_id_7eb2bc79_scoped_true_staticRenderFns = []
homevue_type_template_id_7eb2bc79_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/home.vue?vue&type=template&id=7eb2bc79&scoped=true&

// EXTERNAL MODULE: ./src/utils/comics.js
var comics = __webpack_require__(872);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/home.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ const homevue_type_script_lang_js_ = ({
  name: 'Index',
  data() {
    return {
      originalInfo: [],
      userWebInfo: [],
      //
      activeNames: [1],
      checkValue: 1,
      checkTitle: '原列表'

    }
  },
  created() {
    this.getWeb()
  },
  mounted() {
    this.$bus.$on('getWeb', this.getWeb)
  },
  methods: {
    getWeb() {
      const { originalInfo, userWebInfo } = (0,comics/* getWebList */.eT)()
      this.originalInfo = originalInfo.filter((item) => { return item.showInList !== false })
      this.userWebInfo = userWebInfo
    },
    checkContent(val, title) {
      this.checkValue = val
      this.checkTitle = title
      this.activeNames = []
    },
    leaveCollapse() {
      this.activeNames = []
    },
    jump(url) {
      window.open(url, '_blank')
      // window.location.href = url
    }
  }
});

;// CONCATENATED MODULE: ./src/views/home.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_homevue_type_script_lang_js_ = (homevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/home.vue?vue&type=style&index=0&id=7eb2bc79&lang=less&scoped=true&
var homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_ = __webpack_require__(647);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/home.vue?vue&type=style&index=0&id=7eb2bc79&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_/* default */.Z, options);




       /* harmony default export */ const views_homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_ = (homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_/* default */.Z && homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_/* default.locals */.Z.locals ? homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/home.vue?vue&type=style&index=0&id=7eb2bc79&lang=less&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// CONCATENATED MODULE: ./src/views/home.vue



;


/* normalize component */

var component = normalizeComponent(
  views_homevue_type_script_lang_js_,
  homevue_type_template_id_7eb2bc79_scoped_true_render,
  homevue_type_template_id_7eb2bc79_scoped_true_staticRenderFns,
  false,
  null,
  "7eb2bc79",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/home.vue"
/* harmony default export */ const home = (component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/table.vue?vue&type=template&id=657d4b24&scoped=true&
var tablevue_type_template_id_657d4b24_scoped_true_render = function () {
  var this$1 = this
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { ref: "comiclist", staticClass: "comiclist" },
    [
      _c(
        "van-popup",
        {
          style: {
            position: "absolute",
            width: "100%",
            height: "40%",
            borderTop: "1px solid #fcadad",
            marginTop: "-15px",
          },
          attrs: {
            "get-container": "#chapterpage",
            round: "",
            position: "top",
          },
          model: {
            value: _vm.show,
            callback: function ($$v) {
              _vm.show = $$v
            },
            expression: "show",
          },
        },
        [
          _c(
            "van-cell-group",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                width: "350px",
                margin: "10px auto",
              },
              attrs: { title: "选项", inset: "" },
            },
            [
              _c(
                "label",
                {
                  staticStyle: {
                    "margin-top": "5px",
                    "margin-left": "16px",
                    "text-align": "left",
                  },
                },
                [_vm._v("本次下载(临时更改)")]
              ),
              _vm._v(" "),
              _c("van-cell", {
                attrs: { title: "" },
                scopedSlots: _vm._u([
                  {
                    key: "right-icon",
                    fn: function () {
                      return [
                        _c("br"),
                        _vm._v(" "),
                        _c(
                          "van-radio-group",
                          {
                            attrs: { direction: "horizontal" },
                            model: {
                              value: _vm.downType,
                              callback: function ($$v) {
                                _vm.downType = $$v
                              },
                              expression: "downType",
                            },
                          },
                          [
                            _c("van-radio", { attrs: { name: 0 } }, [
                              _vm._v("直接下载"),
                            ]),
                            _vm._v(" "),
                            _c("van-radio", { attrs: { name: 1 } }, [
                              _vm._v("压缩下载"),
                            ]),
                            _vm._v(" "),
                            _c(
                              "van-radio",
                              {
                                attrs: {
                                  name: 2,
                                  title: "拼接后单张高度不超过 10000 像素",
                                },
                              },
                              [
                                _vm._v("拼接下载"),
                                _c("van-icon", {
                                  attrs: { name: "info-o", color: "red" },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        ),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              }),
              _vm._v(" "),
              _c("van-cell", [
                _c(
                  "div",
                  {
                    style: { display: "flex", justifyContent: "space-between" },
                  },
                  [
                    _c(
                      "van-checkbox",
                      {
                        attrs: { "label-position": "left" },
                        on: { change: _vm.characterSequenceChange },
                        model: {
                          value: _vm.useCharacterNum,
                          callback: function ($$v) {
                            _vm.useCharacterNum = $$v
                          },
                          expression: "useCharacterNum",
                        },
                      },
                      [_vm._v("章节补充序号\n          ")]
                    ),
                    _vm._v(" "),
                    _c(
                      "van-checkbox",
                      {
                        attrs: {
                          disabled: !_vm.useCharacterNum,
                          "label-position": "left",
                        },
                        on: { change: _vm.characterSequenceChange },
                        model: {
                          value: _vm.characterNumSequence,
                          callback: function ($$v) {
                            _vm.characterNumSequence = $$v
                          },
                          expression: "characterNumSequence",
                        },
                      },
                      [_vm._v("—序号反序\n          ")]
                    ),
                  ],
                  1
                ),
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticStyle: {
                    "margin-top": "8px",
                    display: "flex",
                    height: "25px",
                    "line-height": "25px",
                    "justify-content": "space-between",
                  },
                },
                [
                  _c(
                    "label",
                    {
                      staticStyle: {
                        "margin-left": "16px",
                        "text-align": "left",
                      },
                      attrs: { for: "" },
                    },
                    [_vm._v("下载当前阅读章节 (测试)")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { type: "default", size: "mini" },
                      on: { click: _vm.getCurrentWebData },
                    },
                    [_vm._v("获取")]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c("van-cell", {
                staticStyle: { "padding-top": "0px" },
                attrs: { title: "" },
                scopedSlots: _vm._u([
                  {
                    key: "right-icon",
                    fn: function () {
                      return [
                        _c("van-field", {
                          attrs: {
                            name: "defineComicName",
                            placeholder: "漫画名",
                          },
                          model: {
                            value: _vm.defineComicName,
                            callback: function ($$v) {
                              _vm.defineComicName = $$v
                            },
                            expression: "defineComicName",
                          },
                        }),
                        _vm._v(" "),
                        _c("van-field", {
                          attrs: {
                            name: "definechapterName",
                            placeholder: "章节名",
                          },
                          model: {
                            value: _vm.definechapterName,
                            callback: function ($$v) {
                              _vm.definechapterName = $$v
                            },
                            expression: "definechapterName",
                          },
                        }),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              }),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { attrs: { id: "editItem" } }, [
        _c(
          "div",
          [
            _c(
              "van-button",
              {
                attrs: { size: "mini", disabled: !_vm.showSelectList },
                on: { click: _vm.selectAll },
              },
              [_vm._v("全选")]
            ),
            _vm._v(" "),
            _c(
              "van-button",
              {
                attrs: { size: "mini", disabled: !_vm.showSelectList },
                on: { click: _vm.CancelSelect },
              },
              [_vm._v("取消")]
            ),
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "editItem-center" },
          [
            _vm._v("\n      选\n      "),
            _c("van-icon", {
              style: { cursor: "pointer" },
              attrs: { name: "more-o", color: "#ee0000", size: "25" },
              on: {
                click: function () {
                  this$1.show = !this$1.show
                },
              },
            }),
            _vm._v(" 项\n    "),
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticStyle: { display: "flex", gap: "8px" } },
          [
            _c(
              "van-button",
              {
                staticStyle: { width: "95px" },
                attrs: {
                  size: "mini",
                  round: "",
                  disabled: _vm.comicName === "------",
                },
                on: { click: _vm.addCurrentComicToFollow },
              },
              [_vm._v("加入追更")]
            ),
            _vm._v(" "),
            _c(
              "van-button",
              {
                staticStyle: { width: "80px" },
                attrs: {
                  size: "mini",
                  round: "",
                  disabled: !_vm.showSelectList,
                },
                on: { click: _vm.downSelectList },
              },
              [_vm._v("下载")]
            ),
          ],
          1
        ),
      ]),
      _vm._v(" "),
      _c(
        "van-divider",
        {
          style: {
            color: "#1989fa",
            borderColor: "#1989fa",
            padding: "0 15px",
            height: "10px",
          },
        },
        [
          _c(
            "code",
            {
              staticStyle: { cursor: "pointer" },
              on: { click: _vm.reloadList },
            },
            [_vm._v("重载列表")]
          ),
        ]
      ),
      _vm._v(" "),
      !_vm.showSelectList
        ? _c(
            "div",
            [
              _c("van-empty", { attrs: { description: "漫画章节" } }, [
                _c(
                  "div",
                  {
                    staticStyle: {
                      display: "flex",
                      gap: "10px",
                      "justify-content": "center",
                    },
                  },
                  [
                    _c(
                      "van-button",
                      {
                        staticClass: "bottom-button",
                        staticStyle: { width: "120px" },
                        attrs: {
                          round: "",
                          disabled: _vm.comicName === "------",
                        },
                        on: { click: _vm.getSelectList },
                      },
                      [_vm._v(" 加载 ")]
                    ),
                    _vm._v(" "),
                    _c(
                      "van-button",
                      {
                        staticClass: "bottom-button",
                        staticStyle: { width: "120px" },
                        attrs: {
                          round: "",
                          disabled: _vm.comicName === "------",
                        },
                        on: { click: _vm.addCurrentComicToFollow },
                      },
                      [_vm._v(" 加入追更 ")]
                    ),
                  ],
                  1
                ),
              ]),
              _vm._v(" "),
              _c(
                "van-cell-group",
                { attrs: { id: "comicinfo", inset: "" } },
                [
                  _c("van-cell", {
                    attrs: { title: "网站", value: _vm.webname },
                  }),
                  _vm._v(" "),
                  _c("van-cell", {
                    attrs: { title: "漫画", value: _vm.comicName },
                  }),
                  _vm._v(" "),
                  _c("van-cell", {
                    attrs: { title: "作者", value: _vm.authorName || "--" },
                  }),
                ],
                1
              ),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c("van-overlay", { attrs: { id: "overlayDom", show: _vm.overlayShow } }),
      _vm._v(" "),
      _vm.showSelectList
        ? _c(
            "div",
            {
              staticStyle: { "border-radius": "25px" },
              attrs: { id: "select-list" },
            },
            [
              _c("div", { attrs: { id: "select-list-top" } }, [
                _c("div", { attrs: { id: "select-list-info" } }, [
                  _vm._m(0),
                  _vm._v(" "),
                  _c(
                    "div",
                    { attrs: { id: "select-list-info-right" } },
                    [
                      _c("van-icon", {
                        style: { cursor: "pointer" },
                        attrs: {
                          name: "edit",
                          color: "#66ccff",
                          size: "18",
                          title: "编辑",
                        },
                        on: { click: _vm.editList },
                      }),
                      _vm._v(" "),
                      _c("van-icon", {
                        style: { cursor: "pointer" },
                        attrs: {
                          name: "sort",
                          color: "#ee000088",
                          size: "18",
                          title: "排序",
                        },
                        on: { click: _vm.reverseList },
                      }),
                    ],
                    1
                  ),
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.isEditList,
                        expression: "isEditList",
                      },
                    ],
                    attrs: { id: "select-show-edit" },
                  },
                  [
                    _c(
                      "div",
                      {
                        staticStyle: {
                          display: "flex",
                          "align-items": "center",
                        },
                      },
                      [
                        _c(
                          "label",
                          {
                            staticStyle: {
                              "text-align": "left",
                              "margin-right": "20px",
                            },
                            attrs: { for: "" },
                          },
                          [_vm._v("删除所选章节首个字符")]
                        ),
                        _vm._v(" "),
                        _c(
                          "van-button",
                          {
                            attrs: { type: "default", size: "mini" },
                            on: {
                              click: function ($event) {
                                return _vm.delOnechapterNameFont(1)
                              },
                            },
                          },
                          [_vm._v("删除")]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticStyle: {
                          display: "flex",
                          "align-items": "center",
                          "margin-top": "3px",
                          "margin-bottom": "3px",
                        },
                      },
                      [
                        _c(
                          "label",
                          {
                            staticStyle: {
                              "text-align": "left",
                              "margin-right": "20px",
                            },
                            attrs: { for: "" },
                          },
                          [_vm._v("删除所选章节末尾一个字符")]
                        ),
                        _vm._v(" "),
                        _c(
                          "van-button",
                          {
                            attrs: { type: "default", size: "mini" },
                            on: {
                              click: function ($event) {
                                return _vm.delOnechapterNameFont(-1)
                              },
                            },
                          },
                          [_vm._v("删除")]
                        ),
                      ],
                      1
                    ),
                  ]
                ),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { attrs: { id: "select-list-2" } },
                [
                  _c(
                    "van-cell-group",
                    {
                      style: _vm.isEditList
                        ? "max-height: 530px;"
                        : "max-height: 585px;",
                      attrs: { id: "select-list-2-1", inset: "" },
                    },
                    _vm._l(_vm.list, function (item, index) {
                      return _c("van-cell", {
                        key: index,
                        style: _vm.titleStyle(
                          item.url,
                          item.isPay,
                          item.characterType
                        ),
                        attrs: {
                          title: _vm.showComicTitleName(
                            item.chapterNumStr,
                            item.chapterName
                          ),
                        },
                        scopedSlots: _vm._u(
                          [
                            _vm.isEditList
                              ? {
                                  key: "title",
                                  fn: function () {
                                    return [
                                      _c(
                                        "div",
                                        {
                                          staticStyle: {
                                            display: "flex",
                                            "justify-content": "space-around",
                                          },
                                        },
                                        [
                                          _c(
                                            "label",
                                            {
                                              attrs: {
                                                for: item.chapterNumStr,
                                              },
                                            },
                                            [_vm._v(_vm._s(item.chapterNumStr))]
                                          ),
                                          _vm._v(" "),
                                          _c("input", {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: item.chapterName,
                                                expression: "item.chapterName",
                                              },
                                            ],
                                            staticClass: "input-chaptername",
                                            attrs: { type: "text" },
                                            domProps: {
                                              value: item.chapterName,
                                            },
                                            on: {
                                              input: function ($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.$set(
                                                  item,
                                                  "chapterName",
                                                  $event.target.value
                                                )
                                              },
                                            },
                                          }),
                                        ]
                                      ),
                                    ]
                                  },
                                  proxy: true,
                                }
                              : null,
                            {
                              key: "right-icon",
                              fn: function () {
                                return [
                                  _c("van-checkbox", {
                                    staticClass: "selectChapter",
                                    attrs: {
                                      name: index,
                                      disabled:
                                        item.url !== "javascript:void();"
                                          ? false
                                          : true,
                                      "icon-size": "24px",
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.radioSelect(
                                          item.isSelect,
                                          index
                                        )
                                      },
                                    },
                                    model: {
                                      value: item.isSelect,
                                      callback: function ($$v) {
                                        _vm.$set(item, "isSelect", $$v)
                                      },
                                      expression: "item.isSelect",
                                    },
                                  }),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      })
                    }),
                    1
                  ),
                ],
                1
              ),
            ]
          )
        : _vm._e(),
    ],
    1
  )
}
var tablevue_type_template_id_657d4b24_scoped_true_staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { attrs: { id: "select-list-info-left" } }, [
      _c("span", [_vm._v("颜色")]),
      _vm._v(" "),
      _c("span", {
        staticClass: "span-circle",
        staticStyle: { background: "blue" },
        attrs: { title: "免费" },
      }),
      _vm._v(" "),
      _c("span", {
        staticClass: "span-circle",
        staticStyle: { background: "#AA6680" },
        attrs: { title: "最新/其它/单行本/卷" },
      }),
      _vm._v(" "),
      _c("span", {
        staticClass: "span-circle",
        staticStyle: { background: "red" },
        attrs: { title: "付费" },
      }),
      _vm._v(" "),
      _c("span", {
        staticClass: "span-circle",
        staticStyle: { background: "#ccc" },
        attrs: { title: "无效" },
      }),
    ])
  },
]
tablevue_type_template_id_657d4b24_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/table.vue?vue&type=template&id=657d4b24&scoped=true&

// EXTERNAL MODULE: ./src/config/setup.js
var setup = __webpack_require__(393);
// EXTERNAL MODULE: ./src/utils/index.js
var utils = __webpack_require__(624);
;// CONCATENATED MODULE: ./src/utils/follow.js





const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value || []))
}

const dedupeChapters = (chapterList) => {
  const urlSet = new Set()
  const result = []
  chapterList.forEach((item) => {
    if (!item?.url || item.url === 'javascript:void();' || urlSet.has(item.url)) {
      return
    }
    urlSet.add(item.url)
    result.push(item)
  })
  return result
}

const normalizeCompareText = (value) => {
  return (0,utils/* trimSpecial */.Sc)(String(value || ''))
    .toLowerCase()
    .replace(/[【】\[\]()（）「」『』《》〈〉]/g, '')
    .replace(/[·•:：]/g, '')
    .replace(/\s+/g, '')
}

const scoreSearchResultName = (keyword, resultName) => {
  const target = normalizeCompareText(keyword)
  const current = normalizeCompareText(resultName)
  if (!target || !current) {
    return 0
  }
  if (target === current) {
    return 120
  }
  if (current.includes(target) || target.includes(current)) {
    return 80
  }
  let prefixLen = 0
  while (prefixLen < target.length && prefixLen < current.length && target[prefixLen] === current[prefixLen]) {
    prefixLen++
  }
  if (prefixLen >= 2) {
    return 30 + prefixLen
  }
  return 0
}

const pickBestSearchResult = (keyword, resultList = []) => {
  const candidates = (resultList || [])
    .map(item => ({
      ...item,
      _score: scoreSearchResultName(keyword, item.name)
    }))
    .filter(item => item._score > 0)
    .sort((a, b) => b._score - a._score)

  if (candidates.length === 0 || candidates[0]._score < 60) {
    return null
  }
  return candidates[0]
}

const mergeKnownUrl = (item, chapterUrls) => {
  const urlSet = new Set(item.knownChapterUrls || [])
  chapterUrls.forEach(url => urlSet.add(url))
  item.knownChapterUrls = [...urlSet]
}

const getFollowInfoByRequest = async(webRule, comicPageUrl) => {
  const { responseText } = await (0,utils/* request */.WY)({ method: 'get', url: comicPageUrl, headers: webRule.headers || '' })
  return (0,comics/* getComicInfoFromHtml */.KK)(responseText, webRule, comicPageUrl)
}

const searchFollowCandidatesByKeyword = async(keyword, selectedWebNames = []) => {
  const currentKeyword = (0,utils/* trimSpecial */.Sc)(keyword || '')
  if (!currentKeyword) {
    return {
      candidates: [],
      skippedSites: []
    }
  }

  const searchResultList = await (0,comics/* searchComicsAcrossWebs */.Iw)(currentKeyword, selectedWebNames)
  const candidates = []
  const skippedSites = []

  for (let i = 0; i < searchResultList.length; i++) {
    const item = searchResultList[i]
    const bestResult = pickBestSearchResult(currentKeyword, item.findres || [])
    if (!bestResult?.url) {
      skippedSites.push({
        webName: item.webName,
        reason: item.error ? 'search-error' : 'no-match'
      })
      continue
    }

    try {
      const info = await getFollowInfoByRequest(item.webRule || (0,comics/* findWebByUrl */.jL)(bestResult.url), bestResult.url)
      const chapterList = dedupeChapters(info.chapters || [])
      if (chapterList.length === 0) {
        skippedSites.push({
          webName: item.webName,
          reason: 'no-chapters'
        })
        continue
      }
      candidates.push({
        key: `${item.webName}__${bestResult.url}`,
        comicName: info.comicName || bestResult.name || currentKeyword,
        authorName: info.authorName || '',
        webName: item.webName,
        comicPageUrl: bestResult.url,
        chapters: chapterList,
        seriesChapterCount: chapterList.length,
        latestChapterName: chapterList[0]?.chapterName || '',
        latestChapterUrl: chapterList[0]?.url || '',
        matchedName: bestResult.name || ''
      })
    } catch (error) {
      skippedSites.push({
        webName: item.webName,
        reason: 'fetch-error',
        error
      })
    }
  }

  return {
    candidates,
    skippedSites
  }
}

const addFollowCandidates = (candidateList = []) => {
  const addedItems = []
  candidateList.forEach((candidate) => {
    const followItem = upsertFollowItem({
      comicName: candidate.comicName,
      authorName: candidate.authorName,
      webName: candidate.webName,
      comicPageUrl: candidate.comicPageUrl,
      chapters: candidate.chapters || []
    })
    addedItems.push(followItem)
  })
  return addedItems
}

const addFollowItemsByKeyword = async(keyword, selectedWebNames = []) => {
  const result = await searchFollowCandidatesByKeyword(keyword, selectedWebNames)
  const matchedItems = addFollowCandidates(result.candidates)
  return {
    matchedItems,
    skippedSites: result.skippedSites
  }
}

const getFollowList = () => {
  return cloneData((0,setup/* getStorage */.cF)('followList') || [])
}

const saveFollowList = (followList) => {
  ;(0,setup/* setStorage */.po)('followList', followList)
  return true
}

const getFollowSettings = () => {
  return (0,setup/* getStorage */.cF)('followSettings') || {}
}

const getFollowCheckState = () => {
  return (0,setup/* getStorage */.cF)('followCheckState') || { lastCheckAt: 0, lastUpdateCount: 0 }
}

const setFollowCheckState = (state) => {
  ;(0,setup/* setStorage */.po)('followCheckState', state)
}

const canAutoCheckFollow = () => {
  const settings = getFollowSettings()
  if (settings.autoCheckOnLoad === false) {
    return false
  }
  const state = getFollowCheckState()
  const cooldownMinutes = parseInt(settings.checkCooldownMinutes || 30)
  return Date.now() - (state.lastCheckAt || 0) >= cooldownMinutes * 60 * 1000
}

const findFollowItem = (comicPageUrl, webName, comicName) => {
  const followList = getFollowList()
  return followList.find(item => {
    return (comicPageUrl && item.comicPageUrl === comicPageUrl) ||
      (item.webName === webName && item.comicName === comicName)
  }) || null
}

const buildFollowItem = ({ comicName, authorName, webName, comicPageUrl, chapters }) => {
  const latestChapter = chapters[0] || null
  return {
    id: `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    comicName,
    authorName: authorName || '',
    webName,
    comicPageUrl,
    knownChapterUrls: chapters.map(item => item.url),
    pendingChapters: [],
    latestChapterName: latestChapter?.chapterName || '',
    latestChapterUrl: latestChapter?.url || '',
    seriesChapterCount: chapters.length,
    lastCheckedAt: Date.now(),
    lastError: '',
    autoDownload: false
  }
}

const upsertFollowItem = (followPayload) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.comicPageUrl === followPayload.comicPageUrl)
  if (index === -1) {
        const followItem = buildFollowItem(followPayload)
    followList.unshift(followItem)
    saveFollowList(followList)
    return followItem
  }

  const currentItem = followList[index]
  currentItem.comicName = followPayload.comicName
  currentItem.authorName = followPayload.authorName || currentItem.authorName || ''
  currentItem.webName = followPayload.webName
  currentItem.seriesChapterCount = followPayload.chapters.length
  currentItem.latestChapterName = followPayload.chapters[0]?.chapterName || currentItem.latestChapterName
  currentItem.latestChapterUrl = followPayload.chapters[0]?.url || currentItem.latestChapterUrl
  currentItem.lastCheckedAt = Date.now()
  currentItem.lastError = ''
  followList.splice(index, 1, currentItem)
  saveFollowList(followList)
  return currentItem
}

const updateFollowItem = (followItemId, updater) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.id === followItemId)
  if (index === -1) {
    return null
  }
  const nextItem = updater(cloneData(followList[index]))
  followList.splice(index, 1, nextItem)
  saveFollowList(followList)
  return nextItem
}

const removeFollowItem = (followItemId) => {
  const followList = getFollowList().filter(item => item.id !== followItemId)
  saveFollowList(followList)
  return followList
}

const clearPendingChapters = (followItemId, chapterUrls = []) => {
  return updateFollowItem(followItemId, (item) => {
    const clearSet = new Set(chapterUrls)
    if (chapterUrls.length > 0) {
      mergeKnownUrl(item, chapterUrls)
      item.pendingChapters = (item.pendingChapters || []).filter(chapter => !clearSet.has(chapter.url))
    } else {
      mergeKnownUrl(item, (item.pendingChapters || []).map(chapter => chapter.url))
      item.pendingChapters = []
    }
    return item
  })
}

const syncFollowItem = async(followItem) => {
  const webRule = (0,comics/* findWebByUrl */.jL)(followItem.comicPageUrl)
  if (!webRule) {
    return {
      ...followItem,
      lastCheckedAt: Date.now(),
      lastError: '未找到站点规则'
    }
  }

  const info = await getFollowInfoByRequest(webRule, followItem.comicPageUrl)
  const chapterList = dedupeChapters(info.chapters || [])
  const knownUrlSet = new Set([...(followItem.knownChapterUrls || []), ...((followItem.pendingChapters || []).map(item => item.url))])
  const newChapters = chapterList.filter(item => !knownUrlSet.has(item.url))

  const nextItem = cloneData(followItem)
  nextItem.comicName = info.comicName || followItem.comicName
  nextItem.authorName = followItem.authorName || info.authorName || ''
  nextItem.latestChapterName = chapterList[0]?.chapterName || followItem.latestChapterName
  nextItem.latestChapterUrl = chapterList[0]?.url || followItem.latestChapterUrl
  nextItem.seriesChapterCount = chapterList.length
  nextItem.lastCheckedAt = Date.now()
  nextItem.lastError = ''
  nextItem.pendingChapters = dedupeChapters([...(followItem.pendingChapters || []), ...newChapters])
  return nextItem
}

const checkFollowItem = async(followItemId) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.id === followItemId)
  if (index === -1) {
    return null
  }

  try {
    const nextItem = await syncFollowItem(followList[index])
    followList.splice(index, 1, nextItem)
    saveFollowList(followList)
    return nextItem
  } catch (error) {
    followList[index].lastCheckedAt = Date.now()
    followList[index].lastError = error.message || String(error)
    saveFollowList(followList)
    return followList[index]
  }
}

const checkAllFollowItems = async() => {
  const followList = getFollowList()
  const result = []

  for (let i = 0; i < followList.length; i++) {
    try {
      const nextItem = await syncFollowItem(followList[i])
      followList.splice(i, 1, nextItem)
      result.push(nextItem)
    } catch (error) {
      followList[i].lastCheckedAt = Date.now()
      followList[i].lastError = error.message || String(error)
      result.push(followList[i])
    }
  }
  saveFollowList(followList)
  const updateCount = followList.reduce((sum, item) => sum + ((item.pendingChapters || []).length > 0 ? 1 : 0), 0)
  setFollowCheckState({
    lastCheckAt: Date.now(),
    lastUpdateCount: updateCount
  })
  return followList
}

// EXTERNAL MODULE: external "vant"
var external_vant_ = __webpack_require__(871);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/table.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//









/* harmony default export */ const tablevue_type_script_lang_js_ = ({
  name: 'Table',
  data() {
    return {
      list: [],
      downResult: [],
      lastSelectIndex: null,
      onShfit: false,

      showSelectList: false,
      overlayShow: false,
      show: false,
      isEditList: false,

      currentComics: '',
      webname: '未匹配',
      comicName: '------',
      authorName: '',

      paylogoArr: [],
      downType: 0,
      useCharacterNum: false,
      characterNumSequence: false,

      defineComicName: '',
      definechapterName: ''

    }
  },
  computed: {

  },
  mounted() {
    this.watchKeyEvent()
    this.getInfo()
  },
  methods: {
    titleStyle: function(url, isPay, type) {
      if (url === 'javascript:void();') {
        return { color: '#ccc' }
      }
      if (isPay === true) {
        return { color: 'red' }
      }
      if (type === 'many') {
        return { color: '#AA6680' }
      }
      return `color: blue`
    },
    showComicTitleName(numStr, name) {
      let showname = ''
      if (numStr !== '') {
        const newname = name === '' ? '' : ('-' + name)
        showname = numStr + newname
        return showname
      }
      return name
    },
    editList() {
      this.overlayShow = true
      this.isEditList = !this.isEditList
      this.overlayShow = false
    },
    // 删除章节一个字符
    delOnechapterNameFont(pos) {
      this.list.forEach((element, index) => {
        if (element.isSelect === true && element.chapterName.length >= 1) {
          if (pos === 1) {
            element.chapterName = element.chapterName.slice(1)
          } else {
            element.chapterName = element.chapterName.slice(0, -1)
          }
        }
      })
    },
    getInfo(times) {
      try {
        this.currentComics = comics/* currentComics */.Po
        if (comics/* currentComics */.Po === null) {
          return
        }
        this.webname = comics/* currentComics.webName */.Po.webName
        const { comicName, authorName } = (0,comics/* getCurrentComicMeta */.lb)(this.currentComics)
        const followItem = findFollowItem(window.location.href, this.currentComics.webName, comicName)

        this.comicName = comicName
        this.authorName = followItem?.authorName || authorName || ''
        if (this.comicName === '') {
          setTimeout(() => {
            this.getInfo(1)
          }, 1500)
          return
        }
        this.$bus.$emit('getComicName', this.comicName)
        //
        this.downType = (0,setup/* getStorage */.cF)('downType')
      // eslint-disable-next-line no-empty
      } catch (error) {
        if (times === undefined) {
          setTimeout(() => {
            this.getInfo(1)
          }, 1500)
        }
        console.log('getInfo-e: ', error)
      }
      this.lastSelectIndex = null
      return
    },
    decorateChapterList(list) {
      const followItem = findFollowItem(window.location.href, comics/* currentComics.webName */.Po.webName, this.comicName)
      const authorName = followItem?.authorName || this.authorName || ''
      const seriesChapterCount = list.length
      return list.map((item) => {
        return {
          webName: comics/* currentComics.webName */.Po.webName,
          authorName,
          comicPageUrl: window.location.href,
          seriesChapterCount,
          ...item
        }
      })
    },
    reverseList() {
      this.overlayShow = true
      this.list = this.list.reverse()
      this.lastSelectIndex = null
      this.overlayShow = false
    },
    selectAll() {
      this.list.forEach((element, index) => {
        if (element.url !== 'javascript:void();') {
          element.isSelect = true
        }
      })
      this.lastSelectIndex = null
    },
    CancelSelect() {
      this.list.forEach((element, index) => {
        element.isSelect = false
      })
      this.lastSelectIndex = null
    },
    radioSelect(isSelect, index) {
      if (!isSelect) {
        this.lastSelectIndex = null
        return
      }
      let minIndex, maxIndex
      if (this.lastSelectIndex < index) {
        minIndex = this.lastSelectIndex
        maxIndex = index
      } else {
        minIndex = index
        maxIndex = this.lastSelectIndex
      }

      if (this.onShfit && this.lastSelectIndex !== null) {
        for (let i = minIndex; i < maxIndex; i++) {
          if (this.list[i].url !== 'javascript:void();') {
            this.list[i].isSelect = true
          }
        }
      }
      this.lastSelectIndex = index
    },
    watchKeyEvent() {
      const setKeyStatus = (keyCode, status) => {
        switch (keyCode) {
          case 16:
            if (this.onShfit === status) return
            this.onShfit = status
            break
        }
      }
      const dom = this.$refs.comiclist
      dom.onkeydown = (e) => {
        setKeyStatus(e.keyCode, true)
      }
      dom.onkeyup = (e) => {
        setKeyStatus(e.keyCode, false)
      }
    },
    async getSelectList() {
      this.overlayShow = true
      try {
        // 优先 getComicInfo 获取章节信息
        if (comics/* currentComics.getComicInfo */.Po.getComicInfo) {
          const list = await comics/* currentComics.getComicInfo */.Po.getComicInfo(this.comicName)
          if (list) {
            this.list = this.decorateChapterList(list)
            this.overlayShow = false
            this.showSelectList = true
            return
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100))
        // 单章数据
        const nodeList = document.querySelectorAll(comics/* currentComics.chapterCss */.Po.chapterCss)
        this.getChapterData(nodeList, comics/* currentComics */.Po, 'one')

        // （如果存在）分卷数据
        if (comics/* currentComics.chapterCss_2 */.Po.chapterCss_2) {
          const nodeList_2 = document.querySelectorAll(comics/* currentComics.chapterCss_2 */.Po.chapterCss_2)
          this.getChapterData(nodeList_2, comics/* currentComics */.Po, 'many')
        }

        this.list = this.decorateChapterList(this.list)

        this.overlayShow = false
        this.showSelectList = true
      } catch (error) {
        console.log('getSelectList-e: ', error)
        ;(0,external_vant_.Toast)({
          message: '网站未匹配或方法已失效',
          getContainer: '.card',
          position: 'bottom'
        })
        setTimeout(() => {
          this.overlayShow = false
        }, 3000)
      }
    },
    // 获取章节数据
    getChapterData(nodeList, currentComics, type) {
      const hasSpend = currentComics.hasSpend
      const chapterNameReg = currentComics.chapterNameReg
      nodeList.forEach(dom => {
        const urls = dom.querySelectorAll('a')
        const readtype = currentComics.readtype

        urls.forEach((element, index) => {
          let chapterName = ''
          try {
            if (!chapterNameReg) {
              chapterName = element.innerText
            } else {
              chapterName = element.outerHTML.match(chapterNameReg)[1]
            }
            chapterName = (0,utils/* trimSpecial */.Sc)(chapterName)
          } catch (error) {
            // console.log()
          }

          // 获取付费标志
          let currentIsPay = false
          if (hasSpend) {
            const payKey = currentComics.payKey
            const parent = element.parentElement
            if (parent.outerHTML.indexOf(payKey) > 0) {
              currentIsPay = true
            } else {
              currentIsPay = false
            }
          }

          const data = {
            comicName: (0,utils/* trimSpecial */.Sc)(this.comicName),
            chapterNumStr: '',
            chapterName,
            downChapterName: '',
            url: element.href,
            characterType: type,
            readtype,
            isPay: currentIsPay,
            isSelect: false
          }

          if (data.chapterName !== '') {
            this.list.push(data)
          }
        })
      })
    },

    // 已进入原网站漫画章节页面阅读，获取章节 下载
    startDownload(downloadItems) {
      if (downloadItems.length === 1 && downloadItems[0].downType === 1) {
        this.$bus.$emit('openCoverSelector', downloadItems[0])
        this.$bus.$emit('changTab', 2)
        return
      }
      this.$bus.$emit('selectDown', downloadItems)
      this.$bus.$emit('changTab', 3)
    },
    getCurrentWebData() {
      if (!comics/* currentComics */.Po) {
        (0,external_vant_.Toast)({
          message: '未在匹配网站',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.defineComicName === '' || this.definechapterName === '') {
        (0,external_vant_.Toast)({
          message: '请输入名称',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      const item = {
        comicName: this.defineComicName,
        authorName: this.authorName,
        webName: comics/* currentComics.webName */.Po.webName,
        comicPageUrl: window.location.href,
        seriesChapterCount: 1,
        chapterNumStr: '',
        chapterName: this.definechapterName,
        downChapterName: this.definechapterName,
        url: window.location.href,
        characterType: 'one',
        readtype: comics/* currentComics.readtype */.Po.readtype,
        isPay: comics/* currentComics.hasSpend */.Po.hasSpend,
        downType: this.downType,
        downHeaders: comics/* currentComics.downHeaders */.Po.downHeaders
      }
      this.downResult.push(item)
      this.startDownload(this.downResult)
      this.downResult = []
      this.show = false
    },
    downSelectList() {
      let hasSelect = false
      this.list.forEach((item, index) => {
        if (item.isSelect) {
          item.downType = this.downType
          item.downHeaders = comics/* currentComics.downHeaders */.Po.downHeaders
          if (!hasSelect && item.isSelect) {
            hasSelect = true
          }

          if (item.chapterNumStr !== '' && item.chapterNumStr !== undefined) {
            const newName = item.chapterName === '' ? '' : ('-' + item.chapterName)
            item.downChapterName = item.chapterNumStr + newName
          } else {
            item.downChapterName = item.chapterName
          }

          // 下载的章节名可能修改为空，为空跳过
          if (item.downChapterName !== '') {
            this.downResult.push(item)
            item.isSelect = false
          }
        }
      })

      if (!hasSelect) {
        (0,external_vant_.Toast)({
          message: '请选择章节',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }

      this.startDownload(this.downResult)
      this.downResult = []
    },
    async addCurrentComicToFollow() {
      if (!comics/* currentComics */.Po || this.comicName === '------') {
        (0,external_vant_.Toast)({
          message: '请先进入漫画目录页',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }

      if (this.list.length === 0) {
        await this.getSelectList()
      }

      if (this.list.length === 0) {
        (0,external_vant_.Toast)({
          message: '当前页面未获取到章节列表',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }

      const followItem = upsertFollowItem({
        comicName: this.comicName,
        authorName: this.authorName,
        webName: comics/* currentComics.webName */.Po.webName,
        comicPageUrl: window.location.href,
        chapters: this.decorateChapterList(this.list)
      })
      this.authorName = followItem.authorName || this.authorName
      this.$bus.$emit('refreshFollowList')
      this.$bus.$emit('changTab', 4)
      ;(0,external_vant_.Toast)({
        message: '已加入追更',
        getContainer: '.card',
        position: 'bottom'
      })
    },
    reloadList() {
      this.list = []
      this.getInfo(1)
      this.getSelectList()
    },
    characterSequenceChange() {
      if (!this.useCharacterNum) {
        // 删除 前几个字符
        this.list.forEach((item, index) => {
          item.chapterNumStr = ''
        })
        return
      }

      if (this.characterNumSequence === true) {
        const len = this.list.length
        this.list.forEach((item, index) => {
          item.chapterNumStr = (0,utils/* addZeroForNum */.xo)(len - index, 3)
        })
      } else {
        this.list.forEach((item, index) => {
          item.chapterNumStr = (0,utils/* addZeroForNum */.xo)(index + 1, 3)
        })
      }
    }

  }
});

;// CONCATENATED MODULE: ./src/views/table.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_tablevue_type_script_lang_js_ = (tablevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/table.vue?vue&type=style&index=0&id=657d4b24&lang=less&scoped=true&
var tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_ = __webpack_require__(614);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/table.vue?vue&type=style&index=0&id=657d4b24&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options = {};

tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_/* default */.Z, tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options);




       /* harmony default export */ const views_tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_ = (tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_/* default */.Z && tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_/* default.locals */.Z.locals ? tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/table.vue?vue&type=style&index=0&id=657d4b24&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/table.vue



;


/* normalize component */

var table_component = normalizeComponent(
  views_tablevue_type_script_lang_js_,
  tablevue_type_template_id_657d4b24_scoped_true_render,
  tablevue_type_template_id_657d4b24_scoped_true_staticRenderFns,
  false,
  null,
  "657d4b24",
  null
  
)

/* hot reload */
if (false) { var table_api; }
table_component.options.__file = "src/views/table.vue"
/* harmony default export */ const table = (table_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/cover.vue?vue&type=template&id=5204468d&scoped=true&
var covervue_type_template_id_5204468d_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "cover-page" },
    [
      !_vm.pendingItem
        ? _c("van-empty", { attrs: { description: "暂无待设置封面的章节" } }, [
            _c("p", { staticClass: "cover-hint" }, [
              _vm._v("单章压缩下载时会自动跳转到这里。"),
            ]),
          ])
        : [
            _c(
              "van-cell-group",
              { attrs: { inset: "" } },
              [
                _c("van-cell", {
                  attrs: { title: "漫画", value: _vm.pendingItem.comicName },
                }),
                _vm._v(" "),
                _c("van-cell", {
                  attrs: {
                    title: "章节",
                    value:
                      _vm.pendingItem.downChapterName ||
                      _vm.pendingItem.chapterName,
                  },
                }),
                _vm._v(" "),
                _c("van-cell", {
                  attrs: { title: "输出", value: ".cbz + 同名封面图(按需)" },
                }),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "cover-card" },
              [
                _c("div", { staticClass: "cover-title" }, [_vm._v("封面来源")]),
                _vm._v(" "),
                _c(
                  "van-radio-group",
                  {
                    on: { change: _vm.handleModeChange },
                    model: {
                      value: _vm.coverMode,
                      callback: function ($$v) {
                        _vm.coverMode = $$v
                      },
                      expression: "coverMode",
                    },
                  },
                  [
                    _c("van-cell", {
                      attrs: { clickable: "" },
                      on: {
                        click: function ($event) {
                          _vm.coverMode = "first"
                          _vm.handleModeChange("first")
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("van-radio", { attrs: { name: "first" } }, [
                                _vm._v("使用章节第一张"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: { clickable: "" },
                      on: {
                        click: function ($event) {
                          _vm.coverMode = "upload"
                          _vm.handleModeChange("upload")
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("van-radio", { attrs: { name: "upload" } }, [
                                _vm._v("导入自定义封面"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: { clickable: "" },
                      on: {
                        click: function ($event) {
                          _vm.coverMode = "chapter"
                          _vm.handleModeChange("chapter")
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("van-radio", { attrs: { name: "chapter" } }, [
                                _vm._v("从章节图片里选择"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: { clickable: "" },
                      on: {
                        click: function ($event) {
                          _vm.coverMode = "bangumi"
                          _vm.handleModeChange("bangumi")
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("van-radio", { attrs: { name: "bangumi" } }, [
                                _vm._v("使用 Bangumi 封面"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
              ],
              1
            ),
            _vm._v(" "),
            _vm.coverMode === "first"
              ? _c(
                  "div",
                  { staticClass: "cover-card" },
                  [
                    _c("div", { staticClass: "cover-title" }, [
                      _vm._v("默认封面"),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "cover-desc" }, [
                      _vm._v(
                        "Komga 会直接使用章节第一页作为这本 CBZ 的默认封面。"
                      ),
                    ]),
                    _vm._v(" "),
                    _vm.chapterImageUrls[0]
                      ? _c("img", {
                          staticClass: "cover-preview",
                          attrs: {
                            src: _vm.chapterImageUrls[0],
                            alt: "default cover",
                          },
                        })
                      : _vm.chapterLoading
                      ? _c("van-loading", { attrs: { size: "24px" } }, [
                          _vm._v("加载章节图片中"),
                        ])
                      : _vm._e(),
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.coverMode === "upload"
              ? _c("div", { staticClass: "cover-card" }, [
                  _c("div", { staticClass: "cover-title" }, [
                    _vm._v("自定义封面"),
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    ref: "coverUploadInput",
                    staticClass: "cover-file-input",
                    attrs: { type: "file", accept: "image/*" },
                    on: { change: _vm.handleUploadChange },
                  }),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "cover-actions" },
                    [
                      _c(
                        "van-button",
                        {
                          attrs: { size: "small", type: "primary" },
                          on: { click: _vm.triggerUpload },
                        },
                        [_vm._v("选择图片")]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.uploadedCoverDataUrl
                    ? _c("img", {
                        staticClass: "cover-preview",
                        attrs: {
                          src: _vm.uploadedCoverDataUrl,
                          alt: "uploaded cover",
                        },
                      })
                    : _vm._e(),
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.coverMode === "chapter"
              ? _c(
                  "div",
                  { staticClass: "cover-card" },
                  [
                    _c("div", { staticClass: "cover-title" }, [
                      _vm._v("章节图片"),
                    ]),
                    _vm._v(" "),
                    _vm.chapterLoading
                      ? _c("van-loading", { attrs: { size: "24px" } }, [
                          _vm._v("加载章节图片中"),
                        ])
                      : _vm.chapterImageUrls.length === 0
                      ? _c("div", { staticClass: "cover-desc" }, [
                          _vm._v("当前没有可选图片。"),
                        ])
                      : _c(
                          "div",
                          { staticClass: "chapter-grid" },
                          _vm._l(_vm.chapterImageUrls, function (url, index) {
                            return _c(
                              "button",
                              {
                                key: index + "_" + url,
                                staticClass: "chapter-thumb",
                                class: {
                                  "chapter-thumb--active":
                                    _vm.selectedChapterImageUrl === url,
                                },
                                attrs: { type: "button" },
                                on: {
                                  click: function ($event) {
                                    _vm.selectedChapterImageUrl = url
                                  },
                                },
                              },
                              [
                                _c("img", {
                                  attrs: {
                                    src: url,
                                    alt: "chapter-" + (index + 1),
                                  },
                                }),
                                _vm._v(" "),
                                _c("span", [_vm._v(_vm._s(index + 1))]),
                              ]
                            )
                          }),
                          0
                        ),
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.coverMode === "bangumi"
              ? _c("div", { staticClass: "cover-card" }, [
                  _c("div", { staticClass: "cover-title" }, [
                    _vm._v("Bangumi 封面"),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "cover-actions" },
                    [
                      _c(
                        "van-button",
                        {
                          attrs: {
                            size: "small",
                            type: "primary",
                            loading: _vm.bangumiLoading,
                          },
                          on: { click: _vm.loadBangumiCover },
                        },
                        [
                          _vm._v(
                            "\n          " +
                              _vm._s(
                                _vm.bangumiCoverUrl ? "重新获取" : "获取封面"
                              ) +
                              "\n        "
                          ),
                        ]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.bangumiCoverUrl
                    ? _c("img", {
                        staticClass: "cover-preview",
                        attrs: {
                          src: _vm.bangumiCoverUrl,
                          alt: "bangumi cover",
                        },
                      })
                    : !_vm.bangumiLoading
                    ? _c("div", { staticClass: "cover-desc" }, [
                        _vm._v("未获取到 Bangumi 封面。"),
                      ])
                    : _vm._e(),
                ])
              : _vm._e(),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "cover-bottom" },
              [
                _c(
                  "van-button",
                  { attrs: { round: "" }, on: { click: _vm.cancelSelection } },
                  [_vm._v("返回")]
                ),
                _vm._v(" "),
                _c(
                  "van-button",
                  {
                    attrs: {
                      round: "",
                      type: "primary",
                      loading: _vm.submitting,
                    },
                    on: { click: _vm.confirmSelection },
                  },
                  [_vm._v("开始下载")]
                ),
              ],
              1
            ),
          ],
    ],
    2
  )
}
var covervue_type_template_id_5204468d_scoped_true_staticRenderFns = []
covervue_type_template_id_5204468d_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/cover.vue?vue&type=template&id=5204468d&scoped=true&

;// CONCATENATED MODULE: ./src/utils/metadata.js



const invalidFileNameReg = /[\\/:*?"<>|]/g
const defaultZipNameTemplate = '[站点名字][作者名][漫画名称][章节名称][多少P]'
const legacyDefaultZipNameTemplate = '[站点名字][作者名][漫画名称][章节名称][多少P]P'

const metadataSettingsDefault = {
  enableComicInfoXml: true,
  enableSeriesJson: false,
  enableSeriesCover: false,
  enableBangumiScrape: false,
  bangumiAccessToken: '',
  bangumiIncludeNsfw: false,
  languageISO: 'zh',
  publisher: ''
}

const escapeXml = (value) => {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const cleanFileName = (value) => {
  return (0,utils/* trimSpecial */.Sc)(String(value || ''))
    .replace(invalidFileNameReg, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const getTokenMap = (downloadItem, pageCount) => {
  return {
    '[站点名字]': cleanFileName(downloadItem.webName),
    '[作者名]': cleanFileName(downloadItem.authorName),
    '[漫画名称]': cleanFileName(downloadItem.comicName),
    '[章节名称]': cleanFileName(downloadItem.downChapterName || downloadItem.chapterName),
    '[章节序号]': cleanFileName(downloadItem.chapterNumStr),
    '[多少P]': String(pageCount || 0)
  }
}

const pushXmlTag = (arr, name, value) => {
  if (value === undefined || value === null || value === '') {
    return
  }
  arr.push(`  <${name}>${escapeXml(value)}</${name}>`)
}

const getChapterNumber = (downloadItem) => {
  if (downloadItem.chapterNumStr) {
    return downloadItem.chapterNumStr
  }
  const match = String(downloadItem.chapterName || '').match(/(\d+(\.\d+)?)/)
  return match ? match[1] : ''
}

const uniqList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const splitDateParts = (dateValue) => {
  if (!dateValue) {
    return {}
  }
  const match = String(dateValue).match(/(\d{4})(?:[-/.年](\d{1,2}))?(?:[-/.月](\d{1,2}))?/)
  if (!match) {
    return {}
  }
  return {
    year: match[1],
    month: match[2] ? String(parseInt(match[2])) : '',
    day: match[3] ? String(parseInt(match[3])) : ''
  }
}

const buildNotes = (downloadItem, externalMetadata) => {
  const notes = []
  if (downloadItem.webName) {
    notes.push(`来源站点: ${downloadItem.webName}`)
  }
  if (externalMetadata?.originalTitle && externalMetadata.originalTitle !== externalMetadata.seriesTitle) {
    notes.push(`原始标题: ${externalMetadata.originalTitle}`)
  }
  if (externalMetadata?.subjectUrl) {
    notes.push(`Bangumi: ${externalMetadata.subjectUrl}`)
  }
  return notes.join('\n')
}

const getSeriesName = (downloadItem, externalMetadata) => {
  return externalMetadata?.seriesTitle || downloadItem.comicName
}

const getPublisher = (settings, externalMetadata) => {
  return externalMetadata?.publisher || settings.publisher || ''
}

const getIssueCount = (downloadItem, externalMetadata) => {
  return downloadItem.seriesChapterCount || externalMetadata?.issueCount || externalMetadata?.volumeCount || undefined
}

const getWriter = (downloadItem, externalMetadata) => {
  const writerList = uniqList([...(externalMetadata?.writers || []), downloadItem.authorName])
  return writerList.join(', ')
}

const getPenciller = (externalMetadata) => {
  return uniqList(externalMetadata?.illustrators || []).join(', ')
}

const getGenre = (externalMetadata) => {
  return uniqList(externalMetadata?.tags || []).join(', ')
}

const getMetadataSettings = () => {
  return {
    ...metadataSettingsDefault,
    ...((0,setup/* getStorage */.cF)('metadataSettings') || {})
  }
}

const getZipNameTemplate = () => {
  const currentTemplate = (0,setup/* getStorage */.cF)('zipNameTemplate')
  if (!currentTemplate || currentTemplate === legacyDefaultZipNameTemplate) {
    return defaultZipNameTemplate
  }
  return currentTemplate
}

const buildArchiveName = (downloadItem, pageCount) => {
  let result = getZipNameTemplate()
  const tokenMap = getTokenMap(downloadItem, pageCount)
  Object.keys(tokenMap).forEach((key) => {
    result = result.replaceAll(key, tokenMap[key] || '')
  })
  result = cleanFileName(result).replace(/\[\]/g, '')
  return result || cleanFileName(downloadItem.downChapterName || downloadItem.chapterName || downloadItem.comicName || 'chapter')
}

const buildComicInfoXml = (downloadItem, pageCount, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<ComicInfo>']
  const seriesName = getSeriesName(downloadItem, externalMetadata)
  const dateParts = splitDateParts(externalMetadata?.releaseDate)

  pushXmlTag(lines, 'Series', seriesName)
  pushXmlTag(lines, 'Title', downloadItem.downChapterName || downloadItem.chapterName)
  pushXmlTag(lines, 'Number', getChapterNumber(downloadItem))
  pushXmlTag(lines, 'Count', getIssueCount(downloadItem, externalMetadata))
  pushXmlTag(lines, 'Summary', externalMetadata?.summary || '')
  pushXmlTag(lines, 'Writer', getWriter(downloadItem, externalMetadata))
  pushXmlTag(lines, 'Penciller', getPenciller(externalMetadata))
  pushXmlTag(lines, 'Genre', getGenre(externalMetadata))
  pushXmlTag(lines, 'Tags', getGenre(externalMetadata))
  pushXmlTag(lines, 'PageCount', pageCount)
  pushXmlTag(lines, 'Web', downloadItem.url || downloadItem.comicPageUrl)
  pushXmlTag(lines, 'Publisher', getPublisher(settings, externalMetadata))
  pushXmlTag(lines, 'LanguageISO', settings.languageISO || externalMetadata?.languageISO || 'zh')
  pushXmlTag(lines, 'Year', dateParts.year)
  pushXmlTag(lines, 'Month', dateParts.month)
  pushXmlTag(lines, 'Day', dateParts.day)
  pushXmlTag(lines, 'Notes', buildNotes(downloadItem, externalMetadata))
  lines.push('</ComicInfo>')
  return lines.join('\n')
}

const buildSeriesJson = (downloadItem, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const dateParts = splitDateParts(externalMetadata?.releaseDate)
  const seriesInfo = {
    name: getSeriesName(downloadItem, externalMetadata) || '',
    publisher: getPublisher(settings, externalMetadata),
    description_text: externalMetadata?.summary || `${downloadItem.webName || ''}`.trim(),
    total_issues: getIssueCount(downloadItem, externalMetadata),
    status: externalMetadata?.status || undefined,
    age_rating: externalMetadata?.ageRating || undefined,
    year: dateParts.year || undefined
  }
  return JSON.stringify(seriesInfo, null, 2)
}

const getMetadataFileFlags = () => {
  const settings = getMetadataSettings()
  return {
    enableComicInfoXml: settings.enableComicInfoXml !== false,
    enableSeriesJson: settings.enableSeriesJson === true,
    enableSeriesCover: settings.enableSeriesCover === true,
    enableBangumiScrape: settings.enableBangumiScrape === true
  }
}

;// CONCATENATED MODULE: ./src/utils/bangumi.js





const BANGUMI_SEARCH_API = 'https://api.bgm.tv/v0/search/subjects'
const BANGUMI_SUBJECT_API = 'https://api.bgm.tv/v0/subjects'
const BANGUMI_WEB_URL = 'https://bgm.tv/subject'
const CACHE_KEY = 'bangumiMetadataCache'
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000
const MAX_CANDIDATE_COUNT = 4
const pendingMetadataMap = new Map()

const normalizeText = (value) => {
  return (0,utils/* trimSpecial */.Sc)(String(value || ''))
    .replace(/[【】\[\]()（）「」『』《》〈〉]/g, ' ')
    .replace(/[·•:：]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const bangumi_normalizeCompareText = (value) => {
  return normalizeText(value)
    .toLowerCase()
    .replace(/\s+/g, '')
}

const normalizeKeyword = (value) => {
  return normalizeText(value)
    .replace(/(?:第?\s*\d+(?:\.\d+)?\s*(?:话|話|卷|章|冊|集)|单行本|單行本|漫画|漫畫|コミック|comics?)$/i, '')
    .trim()
}

const buildCacheKey = (downloadItem) => {
  return [
    bangumi_normalizeCompareText(downloadItem.comicName),
    bangumi_normalizeCompareText(downloadItem.authorName),
    bangumi_normalizeCompareText(downloadItem.webName)
  ].join('::')
}

const bangumi_cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

const getCacheMap = () => {
  return (0,setup/* getStorage */.cF)(CACHE_KEY) || {}
}

const getCachedMetadata = (cacheKey) => {
  const cacheMap = getCacheMap()
  const item = cacheMap[cacheKey]
  if (!item?.savedAt || !item.data) {
    return null
  }
  if (Date.now() - item.savedAt > CACHE_TTL) {
    return null
  }
  return bangumi_cloneData(item.data)
}

const saveCachedMetadata = (cacheKey, data) => {
  const cacheMap = getCacheMap()
  cacheMap[cacheKey] = {
    savedAt: Date.now(),
    data
  }
  ;(0,setup/* setStorage */.po)(CACHE_KEY, cacheMap)
  return data
}

const getBangumiHeaders = (settings) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': '10Comic Metadata Scraper'
  }
  if (settings.bangumiAccessToken) {
    headers.Authorization = `Bearer ${settings.bangumiAccessToken}`
  }
  return headers
}

const parseResponseJson = (response) => {
  const raw = response?.responseText || response?.response || ''
  if (!raw) {
    return null
  }
  if (typeof raw === 'object') {
    return raw
  }
  try {
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

const toText = (value) => {
  if (value === undefined || value === null) {
    return ''
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim()
  }
  if (Array.isArray(value)) {
    return value.map(item => toText(item)).filter(Boolean).join(' / ')
  }
  if (typeof value === 'object') {
    return toText(value.v || value.value || value.k || value.name || '')
  }
  return ''
}

const getInfoboxEntries = (subject) => {
  return Array.isArray(subject?.infobox) ? subject.infobox : []
}

const matchInfoboxKey = (key = '', words = []) => {
  return words.some(word => key.toLowerCase().includes(word.toLowerCase()))
}

const pickInfoboxTexts = (subject, keyWords = []) => {
  return getInfoboxEntries(subject)
    .filter(item => matchInfoboxKey(item?.key || '', keyWords))
    .map(item => toText(item?.value))
    .filter(Boolean)
}

const pickFirstInfoboxText = (subject, keyWords = []) => {
  return pickInfoboxTexts(subject, keyWords)[0] || ''
}

const buildAliasList = (subject) => {
  const aliases = []
  ;['别名', '中文名', '英文名', '日文名', '罗马字', 'romanji', 'alias'].forEach((keyWord) => {
    pickInfoboxTexts(subject, [keyWord]).forEach((item) => aliases.push(item))
  })
  if (subject?.name_cn) {
    aliases.push(subject.name_cn)
  }
  if (subject?.name) {
    aliases.push(subject.name)
  }
  return [...new Set(aliases.map(item => normalizeText(item)).filter(Boolean))]
}

const parseCount = (value) => {
  const match = String(value || '').match(/(\d+)/)
  return match ? parseInt(match[1]) : undefined
}

const splitPersonNames = (value) => {
  return String(value || '')
    .split(/[\/／&＆,，、]/)
    .map(item => normalizeText(item))
    .filter(Boolean)
}

const dedupeList = (list = []) => {
  return [...new Set((list || []).map(item => normalizeText(item)).filter(Boolean))]
}

const buildSearchKeywords = (downloadItem) => {
  const keywords = []
  const title = normalizeKeyword(downloadItem.comicName)
  const authorName = normalizeText(downloadItem.authorName)
  if (title) {
    keywords.push(title)
  }
  if (title && authorName) {
    keywords.push(`${title} ${authorName}`)
  }
  if (downloadItem.comicName && downloadItem.comicName !== title) {
    keywords.push(normalizeText(downloadItem.comicName))
  }
  return [...new Set(keywords.filter(Boolean))]
}

const searchBangumiSubjects = async(keyword, settings) => {
  const query = `${BANGUMI_SEARCH_API}?limit=10&offset=0`
  const payload = {
    keyword,
    sort: 'rank',
    filter: {
      type: [1],
      nsfw: settings.bangumiIncludeNsfw === true
    }
  }
  const response = await (0,utils/* request */.WY)({
    method: 'post',
    url: query,
    data: JSON.stringify(payload),
    headers: getBangumiHeaders(settings)
  })
  const result = parseResponseJson(response)
  if (!result) {
    return []
  }
  if (Array.isArray(result)) {
    return result
  }
  if (Array.isArray(result.data)) {
    return result.data
  }
  if (Array.isArray(result.list)) {
    return result.list
  }
  return []
}

const getBangumiSubject = async(subjectId, settings) => {
  const response = await (0,utils/* request */.WY)({
    method: 'get',
    url: `${BANGUMI_SUBJECT_API}/${subjectId}`,
    headers: getBangumiHeaders(settings)
  })
  return parseResponseJson(response)
}

const getBangumiSubjectPersons = async(subjectId, settings) => {
  try {
    const response = await (0,utils/* request */.WY)({
      method: 'get',
      url: `${BANGUMI_SUBJECT_API}/${subjectId}/persons`,
      headers: getBangumiHeaders(settings)
    })
    const result = parseResponseJson(response)
    if (Array.isArray(result)) {
      return result
    }
    if (Array.isArray(result?.data)) {
      return result.data
    }
  } catch (error) {
    //
  }
  return []
}

const getPlatformPenalty = (subject) => {
  const platform = normalizeText(subject?.platform || pickFirstInfoboxText(subject, ['平台', '类型', '類型']))
  if (!platform) {
    return 0
  }
  if (/(小说|小説|novel)/i.test(platform)) {
    return -80
  }
  if (/(漫画|漫畫|コミック|manga)/i.test(platform)) {
    return 30
  }
  return 0
}

const hasAuthorMatch = (subject, downloadItem) => {
  const authorName = bangumi_normalizeCompareText(downloadItem.authorName)
  if (!authorName) {
    return false
  }
  const authorFields = [
    ...pickInfoboxTexts(subject, ['作者', '作画', '作畫', '原作', '脚本', '脚本协力', '漫畫']),
    ...(subject._personNames || [])
  ]
  return authorFields.some(item => bangumi_normalizeCompareText(item).includes(authorName) || authorName.includes(bangumi_normalizeCompareText(item)))
}

const scoreBangumiSubject = (subject, downloadItem) => {
  const targetTitle = bangumi_normalizeCompareText(downloadItem.comicName)
  const compareTitles = dedupeList([subject?.name_cn, subject?.name, ...buildAliasList(subject)])
  let score = 0

  compareTitles.forEach((title) => {
    const value = bangumi_normalizeCompareText(title)
    if (!value) {
      return
    }
    if (value === targetTitle) {
      score += 140
      return
    }
    if (value.includes(targetTitle) || targetTitle.includes(value)) {
      score += 80
    }
  })

  if (hasAuthorMatch(subject, downloadItem)) {
    score += 70
  }

  score += getPlatformPenalty(subject)

  if (subject?.rating?.score) {
    score += Math.min(Math.round(subject.rating.score * 2), 20)
  }

  if (subject?.rank) {
    score += Math.max(0, 20 - Math.floor(subject.rank / 100))
  }

  if (subject?.date) {
    score += 5
  }

  return score
}

const enrichWithPersons = async(subject, settings) => {
  const persons = await getBangumiSubjectPersons(subject.id, settings)
  const writerList = []
  const illustratorList = []
  const personNames = []

  persons.forEach((person) => {
    const name = normalizeText(person?.name_cn || person?.name || '')
    const relation = normalizeText(person?.relation || person?.type || '')
    if (!name) {
      return
    }
    personNames.push(name)
    if (/(作者|原作|脚本|编剧|編劇)/i.test(relation)) {
      writerList.push(name)
    }
    if (/(作画|作畫|绘师|繪師|插画|插畫)/i.test(relation)) {
      illustratorList.push(name)
    }
  })

  return {
    ...subject,
    _personNames: personNames,
    _personWriters: dedupeList(writerList),
    _personIllustrators: dedupeList(illustratorList)
  }
}

const buildStatus = (subject) => {
  const statusText = pickFirstInfoboxText(subject, ['连载状态', '連載狀態', '状态', '狀態'])
  if (/(完结|完結|已完|finished|completed)/i.test(statusText)) {
    return 'ended'
  }
  if (/(连载|連載|ongoing|连载中|連載中)/i.test(statusText)) {
    return 'ongoing'
  }
  if (pickFirstInfoboxText(subject, ['结束', '完结', '完結'])) {
    return 'ended'
  }
  return undefined
}

const normalizeScrapedMetadata = (subject) => {
  const writers = dedupeList([
    ...splitPersonNames(pickFirstInfoboxText(subject, ['作者', '原作', '脚本', '编剧', '編劇'])),
    ...(subject?._personWriters || [])
  ])
  const illustrators = dedupeList([
    ...splitPersonNames(pickFirstInfoboxText(subject, ['作画', '作畫', '绘师', '繪師', '插画', '插畫'])),
    ...(subject?._personIllustrators || [])
  ])
  const tags = dedupeList((subject?.tags || []).slice(0, 8).map(item => item?.name || item))
  const publisher = pickFirstInfoboxText(subject, ['出版社', '连载杂志', '連載雜誌', 'レーベル', 'label'])
  const issueCount = parseCount(pickFirstInfoboxText(subject, ['话数', '話數', '章节数', '章數', '总话数', '總話數']))
  const volumeCount = parseCount(pickFirstInfoboxText(subject, ['册数', '冊數', '卷数', '卷數', '单行本', '單行本']))
  const subjectUrl = `${BANGUMI_WEB_URL}/${subject.id}`
  const seriesTitle = normalizeText(subject?.name_cn || subject?.name)

  return {
    source: 'Bangumi',
    subjectId: subject.id,
    subjectUrl,
    seriesTitle,
    originalTitle: normalizeText(subject?.name),
    aliases: buildAliasList(subject),
    summary: (0,utils/* trimSpecial */.Sc)(subject?.summary || ''),
    publisher,
    writers,
    illustrators,
    tags,
    issueCount,
    volumeCount,
    releaseDate: subject?.date || '',
    status: buildStatus(subject),
    coverUrl: subject?.images?.large || subject?.images?.common || subject?.images?.medium || subject?.images?.small || '',
    languageISO: '',
    confidence: subject?._matchScore || 0
  }
}

const pickBestSubject = async(searchResults, downloadItem, settings) => {
  const detailCandidates = await Promise.all(
    searchResults
      .slice(0, MAX_CANDIDATE_COUNT)
      .map(async(item) => {
        const subject = await getBangumiSubject(item.id, settings)
        if (!subject) {
          return null
        }
        const enrichedSubject = await enrichWithPersons(subject, settings)
        enrichedSubject._matchScore = scoreBangumiSubject(enrichedSubject, downloadItem)
        return enrichedSubject
      })
  )

  const validCandidates = detailCandidates.filter(Boolean).sort((a, b) => b._matchScore - a._matchScore)
  if (validCandidates.length === 0) {
    return null
  }
  if (validCandidates[0]._matchScore < 60) {
    return null
  }
  return validCandidates[0]
}

const fetchBangumiMetadata = async(downloadItem, settings) => {
  const keywords = buildSearchKeywords(downloadItem)
  for (let i = 0; i < keywords.length; i++) {
    const searchResults = await searchBangumiSubjects(keywords[i], settings)
    if (searchResults.length === 0) {
      continue
    }
    const bestSubject = await pickBestSubject(searchResults, downloadItem, settings)
    if (bestSubject) {
      return normalizeScrapedMetadata(bestSubject)
    }
  }
  return null
}

const getBangumiMetadata = async(downloadItem, options = {}) => {
  const settings = getMetadataSettings()
  if (settings.enableBangumiScrape !== true && options.force !== true) {
    return null
  }

  const cacheKey = buildCacheKey(downloadItem)
  const cachedData = getCachedMetadata(cacheKey)
  if (cachedData) {
    return cachedData
  }

  if (pendingMetadataMap.has(cacheKey)) {
    return pendingMetadataMap.get(cacheKey)
  }

  const promise = fetchBangumiMetadata(downloadItem, settings)
    .then((data) => {
      if (!data) {
        return null
      }
      return saveCachedMetadata(cacheKey, data)
    })
    .finally(() => {
      pendingMetadataMap.delete(cacheKey)
    })

  pendingMetadataMap.set(cacheKey, promise)
  return promise
}

;// CONCATENATED MODULE: ./src/utils/chapterImages.js



const applyImageRange = (imgList) => {
  const imgDownRange = (0,setup/* getStorage */.cF)('imgDownRange') || [1, -1]
  const start = Math.max(parseInt(imgDownRange[0] || 1), 1)
  const end = parseInt(imgDownRange[1] || -1)
  if (end === -1) {
    return imgList.slice(start - 1)
  }
  return imgList.slice(start - 1, end + 1)
}

const getChapterImageUrls = async(downloadItem) => {
  if (!downloadItem) {
    return []
  }

  if (downloadItem.readtype === 1) {
    const imgs = await (0,utils/* getImage */.gJ)({
      url: downloadItem.url,
      isPay: downloadItem.isPay
    })
    return applyImageRange(Array.isArray(imgs) ? imgs : [])
  }

  const imageUrls = []
  const visitedPageUrls = new Set()
  const processData = {
    url: downloadItem.url,
    imgIndex: 0,
    totalNumber: 0,
    isPay: downloadItem.isPay,
    otherData: undefined
  }

  while (processData.url && !visitedPageUrls.has(processData.url)) {
    visitedPageUrls.add(processData.url)
    const result = await (0,utils/* getImage */.gJ)(processData)
    const currentList = Array.isArray(result?.imgUrlArr) ? result.imgUrlArr : []
    imageUrls.push(...currentList)
    processData.otherData = result?.otherData
    processData.totalNumber = parseInt(result?.imgCount || imageUrls.length || 0)

    if (!result?.nextPageUrl || (processData.totalNumber > 0 && imageUrls.length >= processData.totalNumber)) {
      break
    }

    processData.imgIndex = imageUrls.length
    processData.url = result.nextPageUrl
  }

  return applyImageRange(imageUrls)
}

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/cover.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






const covervue_type_script_lang_js_cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

/* harmony default export */ const covervue_type_script_lang_js_ = ({
  name: 'Cover',
  data() {
    return {
      pendingItem: null,
      coverMode: 'first',
      chapterImageUrls: [],
      selectedChapterImageUrl: '',
      chapterLoading: false,
      bangumiLoading: false,
      bangumiCoverUrl: '',
      uploadedCoverDataUrl: '',
      uploadedCoverMimeType: 'image/jpeg',
      submitting: false
    }
  },
  mounted() {
    this.$bus.$on('openCoverSelector', this.openCoverSelector)
  },
  methods: {
    resetCoverState() {
      this.coverMode = 'first'
      this.chapterImageUrls = []
      this.selectedChapterImageUrl = ''
      this.chapterLoading = false
      this.bangumiLoading = false
      this.bangumiCoverUrl = ''
      this.uploadedCoverDataUrl = ''
      this.uploadedCoverMimeType = 'image/jpeg'
      this.submitting = false
      if (this.$refs.coverUploadInput) {
        this.$refs.coverUploadInput.value = ''
      }
    },
    async openCoverSelector(item) {
      this.pendingItem = covervue_type_script_lang_js_cloneData(item)
      this.resetCoverState()
      await this.loadChapterImages()
    },
    async loadChapterImages() {
      if (!this.pendingItem || this.chapterLoading || this.chapterImageUrls.length > 0) {
        return
      }
      this.chapterLoading = true
      try {
        const imageUrls = await getChapterImageUrls(this.pendingItem)
        this.chapterImageUrls = imageUrls
        this.selectedChapterImageUrl = imageUrls[0] || ''
      } catch (error) {
        (0,external_vant_.Toast)({
          message: '章节图片加载失败',
          getContainer: '.card',
          position: 'bottom'
        })
      } finally {
        this.chapterLoading = false
      }
    },
    async loadBangumiCover() {
      if (!this.pendingItem || this.bangumiLoading) {
        return
      }
      this.bangumiLoading = true
      try {
        const metadata = await getBangumiMetadata(this.pendingItem, { force: true })
        this.bangumiCoverUrl = metadata?.coverUrl || ''
        if (!this.bangumiCoverUrl) {
          (0,external_vant_.Toast)({
            message: '未匹配到 Bangumi 封面',
            getContainer: '.card',
            position: 'bottom'
          })
        }
      } finally {
        this.bangumiLoading = false
      }
    },
    handleModeChange(mode) {
      if (mode === 'chapter' || mode === 'first') {
        this.loadChapterImages()
      }
      if (mode === 'bangumi' && !this.bangumiCoverUrl) {
        this.loadBangumiCover()
      }
    },
    triggerUpload() {
      this.$refs.coverUploadInput?.click()
    },
    handleUploadChange(event) {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        this.uploadedCoverDataUrl = reader.result
        this.uploadedCoverMimeType = file.type || 'image/jpeg'
        this.coverMode = 'upload'
      }
      reader.readAsDataURL(file)
    },
    cancelSelection() {
      this.$bus.$emit('changTab', 1)
    },
    async confirmSelection() {
      if (!this.pendingItem) {
        return
      }
      if (this.coverMode === 'upload' && !this.uploadedCoverDataUrl) {
        (0,external_vant_.Toast)({
          message: '请先导入封面',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.coverMode === 'chapter' && !this.selectedChapterImageUrl) {
        (0,external_vant_.Toast)({
          message: '请选择章节图片',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.coverMode === 'bangumi' && !this.bangumiCoverUrl) {
        await this.loadBangumiCover()
        if (!this.bangumiCoverUrl) {
          return
        }
      }

      this.submitting = true
      const nextItem = {
        ...covervue_type_script_lang_js_cloneData(this.pendingItem),
        coverOption: this.buildCoverOption()
      }
      this.$bus.$emit('selectDown', [nextItem])
      this.$bus.$emit('changTab', 3)
      this.submitting = false
    },
    buildCoverOption() {
      switch (this.coverMode) {
        case 'upload':
          return {
            type: 'upload',
            dataUrl: this.uploadedCoverDataUrl,
            mimeType: this.uploadedCoverMimeType
          }
        case 'chapter':
          return {
            type: 'chapter',
            imageUrl: this.selectedChapterImageUrl
          }
        case 'bangumi':
          return {
            type: 'bangumi',
            imageUrl: this.bangumiCoverUrl
          }
        default:
          return {
            type: 'first'
          }
      }
    }
  }
});

;// CONCATENATED MODULE: ./src/views/cover.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_covervue_type_script_lang_js_ = (covervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/cover.vue?vue&type=style&index=0&id=5204468d&lang=less&scoped=true&
var covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_ = __webpack_require__(139);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/cover.vue?vue&type=style&index=0&id=5204468d&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options = {};

covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_/* default */.Z, covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options);




       /* harmony default export */ const views_covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_ = (covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_/* default */.Z && covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_/* default.locals */.Z.locals ? covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/cover.vue?vue&type=style&index=0&id=5204468d&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/cover.vue



;


/* normalize component */

var cover_component = normalizeComponent(
  views_covervue_type_script_lang_js_,
  covervue_type_template_id_5204468d_scoped_true_render,
  covervue_type_template_id_5204468d_scoped_true_staticRenderFns,
  false,
  null,
  "5204468d",
  null
  
)

/* hot reload */
if (false) { var cover_api; }
cover_component.options.__file = "src/views/cover.vue"
/* harmony default export */ const cover = (cover_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/setting.vue?vue&type=template&id=234d1526&scoped=true&
var settingvue_type_template_id_234d1526_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "setindex" },
    [
      _c(
        "van-swipe",
        {
          ref: "swipe2",
          staticClass: "my-swipe",
          staticStyle: { cursor: "default" },
          attrs: { "initial-swipe": 0, duration: 5, "show-indicators": false },
        },
        [
          _c("van-swipe-item", { staticClass: "swipeitem" }, [
            _c(
              "div",
              { attrs: { id: "setpart" } },
              [
                _c(
                  "van-cell-group",
                  { attrs: { id: "app-loadset", title: "app加载", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("随网页加载UI界面"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right-start",
                                    "get-container": "#app-loadset",
                                    offset: [-2, 10],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.showUiPopover = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.showUiPopover = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.showUiPopover,
                                    callback: function ($$v) {
                                      _vm.showUiPopover = $$v
                                    },
                                    expression: "showUiPopover",
                                  },
                                },
                                [
                                  _c("code", { staticClass: "popovertext" }, [
                                    _vm._v("关闭后可通过快捷键唤起"),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "appLoadDefault",
                                      _vm.appLoadDefault.isShowUI,
                                      "isShowUI"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.appLoadDefault.isShowUI,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.appLoadDefault,
                                      "isShowUI",
                                      $$v
                                    )
                                  },
                                  expression: "appLoadDefault.isShowUI",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("加载界面快捷键"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("div", [
                                _c("code", { staticStyle: { width: "35px" } }, [
                                  _vm._v("Alt + "),
                                ]),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.appLoadDefault.loadHotKey,
                                      expression: "appLoadDefault.loadHotKey",
                                    },
                                  ],
                                  staticClass: "rightbutton",
                                  attrs: { id: "hot-key-input" },
                                  domProps: {
                                    value: _vm.appLoadDefault.loadHotKey,
                                  },
                                  on: {
                                    input: [
                                      function ($event) {
                                        if ($event.target.composing) {
                                          return
                                        }
                                        _vm.$set(
                                          _vm.appLoadDefault,
                                          "loadHotKey",
                                          $event.target.value
                                        )
                                      },
                                      _vm.loadHotKeyChange,
                                    ],
                                  },
                                }),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("右边大小缩放(%)"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-stepper", {
                                staticClass: "rightbutton",
                                attrs: {
                                  min: "75",
                                  max: "125",
                                  "default-value": 100,
                                  step: "1",
                                  integer: "",
                                  "button-size": "20px",
                                },
                                on: {
                                  change: function ($event) {
                                    return _vm.changeRightSize(_vm.appRightSize)
                                  },
                                },
                                model: {
                                  value: _vm.appRightSize,
                                  callback: function ($$v) {
                                    _vm.appRightSize = $$v
                                  },
                                  expression: "appRightSize",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("中间大小缩放(%)"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-stepper", {
                                staticClass: "rightbutton",
                                attrs: {
                                  min: "75",
                                  max: "125",
                                  "default-value": 100,
                                  step: "1",
                                  integer: "",
                                  "button-size": "20px",
                                },
                                on: {
                                  change: function ($event) {
                                    return _vm.changeCenterSize(
                                      _vm.appCenterSize
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.appCenterSize,
                                  callback: function ($$v) {
                                    _vm.appCenterSize = $$v
                                  },
                                  expression: "appCenterSize",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { id: "downpart", title: "下载", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: { label: "*下载前生效", center: "" },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c(
                                "span",
                                {
                                  staticClass: "custom-title",
                                  staticStyle: { width: "300px" },
                                },
                                [_vm._v("最大下载章节数")]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c(
                                "div",
                                { staticStyle: { display: "flex" } },
                                [
                                  _vm._v(
                                    "\n                1 \n                "
                                  ),
                                  _c("van-slider", {
                                    staticClass: "rightslider",
                                    attrs: { min: 1, max: 3 },
                                    on: {
                                      change: function ($event) {
                                        return _vm.onChangeData(
                                          "maxChapterNum",
                                          _vm.maxChapterNum
                                        )
                                      },
                                    },
                                    scopedSlots: _vm._u([
                                      {
                                        key: "button",
                                        fn: function () {
                                          return [
                                            _c(
                                              "div",
                                              { staticClass: "custom-button" },
                                              [
                                                _vm._v(
                                                  _vm._s(_vm.maxChapterNum)
                                                ),
                                              ]
                                            ),
                                          ]
                                        },
                                        proxy: true,
                                      },
                                    ]),
                                    model: {
                                      value: _vm.maxChapterNum,
                                      callback: function ($$v) {
                                        _vm.maxChapterNum = $$v
                                      },
                                      expression: "maxChapterNum",
                                    },
                                  }),
                                  _vm._v(" 3\n              "),
                                ],
                                1
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: { label: "*下载前生效", center: "" },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c(
                                "span",
                                {
                                  staticClass: "custom-title",
                                  staticStyle: { width: "300px" },
                                },
                                [_vm._v("每章最大下载图片数")]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c(
                                "div",
                                { staticStyle: { display: "flex" } },
                                [
                                  _vm._v(
                                    "\n                1 \n                "
                                  ),
                                  _c("van-slider", {
                                    staticClass: "rightslider",
                                    attrs: { min: 1, max: 5 },
                                    on: {
                                      change: function ($event) {
                                        return _vm.onChangeData(
                                          "maxPictureNum",
                                          _vm.maxPictureNum
                                        )
                                      },
                                    },
                                    scopedSlots: _vm._u([
                                      {
                                        key: "button",
                                        fn: function () {
                                          return [
                                            _c(
                                              "div",
                                              { staticClass: "custom-button" },
                                              [
                                                _vm._v(
                                                  _vm._s(_vm.maxPictureNum)
                                                ),
                                              ]
                                            ),
                                          ]
                                        },
                                        proxy: true,
                                      },
                                    ]),
                                    model: {
                                      value: _vm.maxPictureNum,
                                      callback: function ($$v) {
                                        _vm.maxPictureNum = $$v
                                      },
                                      expression: "maxPictureNum",
                                    },
                                  }),
                                  _vm._v(" 5\n              "),
                                ],
                                1
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "*本次默认设置，修改后下次启动默认生效",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("下载方式"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right",
                                    "get-container": "#downpart",
                                    offset: [-8, 10],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.downTypePopover = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.downTypePopover = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.downTypePopover,
                                    callback: function ($$v) {
                                      _vm.downTypePopover = $$v
                                    },
                                    expression: "downTypePopover",
                                  },
                                },
                                [
                                  _c("div", [
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v(
                                        "* 如需保存在文件夹需要设置油猴下载模式为浏览器API"
                                      ),
                                    ]),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c(
                                "div",
                                {
                                  staticClass: "dropdown",
                                  on: {
                                    mouseover: function ($event) {
                                      _vm.showDropDown = true
                                    },
                                    mouseleave: function ($event) {
                                      _vm.showDropDown = false
                                    },
                                  },
                                },
                                [
                                  _c("button", { staticClass: "dropbtn" }, [
                                    _vm._v(
                                      _vm._s(_vm.dropItem[_vm.downType].Text)
                                    ),
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: _vm.showDropDown,
                                          expression: "showDropDown",
                                        },
                                      ],
                                      staticClass: "dropdown-content",
                                      attrs: { id: "myDropdown" },
                                    },
                                    _vm._l(
                                      _vm.dropItem,
                                      function (item, index) {
                                        return _c(
                                          "a",
                                          {
                                            key: index,
                                            attrs: { href: "#" },
                                            on: {
                                              click: function ($event) {
                                                return _vm.changeDownType(
                                                  item.value
                                                )
                                              },
                                            },
                                          },
                                          [
                                            _c(
                                              "div",
                                              { attrs: { title: item.hint } },
                                              [
                                                _vm._v(
                                                  "\n                      " +
                                                    _vm._s(item.Text) +
                                                    "\n                      "
                                                ),
                                                _c("van-icon", {
                                                  directives: [
                                                    {
                                                      name: "show",
                                                      rawName: "v-show",
                                                      value: item.hint,
                                                      expression: "item.hint",
                                                    },
                                                  ],
                                                  attrs: {
                                                    name: "info-o",
                                                    color: "red",
                                                  },
                                                }),
                                              ],
                                              1
                                            ),
                                          ]
                                        )
                                      }
                                    ),
                                    0
                                  ),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "*下载拼接前生效",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("拼接图片最大高度"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right",
                                    "get-container": "#downpart",
                                    offset: [-8, 10],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.splicingHeightPopover = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.splicingHeightPopover = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.splicingHeightPopover,
                                    callback: function ($$v) {
                                      _vm.splicingHeightPopover = $$v
                                    },
                                    expression: "splicingHeightPopover",
                                  },
                                },
                                [
                                  _c("div", [
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v("* chrome和Edge 最大不超过 65530"),
                                    ]),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("div", [
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.maxSplicingHeight,
                                      expression: "maxSplicingHeight",
                                    },
                                  ],
                                  staticClass: "rightbutton",
                                  attrs: {
                                    id: "max-splicing-height-input",
                                    type: "number",
                                    min: 10000,
                                    max: 65530,
                                    onkeyup:
                                      "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                  },
                                  domProps: { value: _vm.maxSplicingHeight },
                                  on: {
                                    blur: _vm.splicingHeightBlur,
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.maxSplicingHeight =
                                        $event.target.value
                                    },
                                  },
                                }),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "*本次启动默认设置,修改刷新生效",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("图片序号最少位数"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right",
                                    "get-container": "#downpart",
                                    offset: [-5, 5],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.addZeroHint = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.addZeroHint = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.addZeroHint,
                                    callback: function ($$v) {
                                      _vm.addZeroHint = $$v
                                    },
                                    expression: "addZeroHint",
                                  },
                                },
                                [
                                  _c("div", [
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v('* 不足则向前补充"0"'),
                                    ]),
                                    _c("br"),
                                    _vm._v(" "),
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v("* 选择1，则默认数字序号"),
                                    ]),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-stepper", {
                                staticClass: "rightbutton",
                                attrs: {
                                  max: "5",
                                  integer: "",
                                  "button-size": "20px",
                                },
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "imgIndexBitNum",
                                      _vm.imgIndexBitNum
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.imgIndexBitNum,
                                  callback: function ($$v) {
                                    _vm.imgIndexBitNum = $$v
                                  },
                                  expression: "imgIndexBitNum",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "原默认设置 1至-1",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("图片下载范围"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right",
                                    "get-container": "#downpart",
                                    offset: [-5, 5],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.imgDownRangeHint = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.imgDownRangeHint = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.imgDownRangeHint,
                                    callback: function ($$v) {
                                      _vm.imgDownRangeHint = $$v
                                    },
                                    expression: "imgDownRangeHint",
                                  },
                                },
                                [
                                  _c("div", [
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v(
                                        "*1至-1 代表从第一张图片下载至最后一张"
                                      ),
                                    ]),
                                    _c("br"),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("div", [
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.imgDownRange[0],
                                      expression: "imgDownRange[0]",
                                    },
                                  ],
                                  staticClass: "img-down-range-input",
                                  attrs: {
                                    type: "number",
                                    min: "1",
                                    onkeyup:
                                      "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                  },
                                  domProps: { value: _vm.imgDownRange[0] },
                                  on: {
                                    blur: _vm.imgDownRangeBlur,
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.imgDownRange,
                                        0,
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                                _vm._v(" "),
                                _c("code", { staticStyle: { width: "10px" } }, [
                                  _vm._v(" - "),
                                ]),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.imgDownRange[1],
                                      expression: "imgDownRange[1]",
                                    },
                                  ],
                                  staticClass: "img-down-range-input",
                                  attrs: {
                                    type: "number",
                                    max: "-1",
                                    onkeyup:
                                      "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                  },
                                  domProps: { value: _vm.imgDownRange[1] },
                                  on: {
                                    blur: _vm.imgDownRangeBlur,
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.imgDownRange,
                                        1,
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { title: "压缩包与元数据", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label:
                          "可用占位符: [站点名字][作者名][漫画名称][章节名称][章节序号][多少P]",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("压缩包命名模板"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.zipNameTemplate,
                                    expression: "zipNameTemplate",
                                  },
                                ],
                                staticClass: "long-input",
                                attrs: { type: "text" },
                                domProps: { value: _vm.zipNameTemplate },
                                on: {
                                  blur: function ($event) {
                                    return _vm.onChangeData(
                                      "zipNameTemplate",
                                      _vm.zipNameTemplate
                                    )
                                  },
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.zipNameTemplate = $event.target.value
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("写入 ComicInfo.xml"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.enableComicInfoXml,
                                      "enableComicInfoXml"
                                    )
                                  },
                                },
                                model: {
                                  value:
                                    _vm.metadataSettings.enableComicInfoXml,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableComicInfoXml",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableComicInfoXml",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "输出到漫画目录下，便于 Komga 识别系列信息",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("生成 series.json"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.enableSeriesJson,
                                      "enableSeriesJson"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.metadataSettings.enableSeriesJson,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableSeriesJson",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableSeriesJson",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "下载系列封面到漫画目录下的 cover.jpg",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("生成系列封面"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.enableSeriesCover,
                                      "enableSeriesCover"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.metadataSettings.enableSeriesCover,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableSeriesCover",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableSeriesCover",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "下载前自动用 Bangumi 检索并补全元数据",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("启用 Bangumi 刮削"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.enableBangumiScrape,
                                      "enableBangumiScrape"
                                    )
                                  },
                                },
                                model: {
                                  value:
                                    _vm.metadataSettings.enableBangumiScrape,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableBangumiScrape",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableBangumiScrape",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label:
                          "开启后会尝试匹配 NSFW 条目，建议配合 Access Token 使用",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("允许 NSFW 条目"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.bangumiIncludeNsfw,
                                      "bangumiIncludeNsfw"
                                    )
                                  },
                                },
                                model: {
                                  value:
                                    _vm.metadataSettings.bangumiIncludeNsfw,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "bangumiIncludeNsfw",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.bangumiIncludeNsfw",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label:
                          "可选。填写后可提高 Bangumi API 的稳定性与权限范围",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("Bangumi Access Token"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.metadataSettings.bangumiAccessToken,
                                    expression:
                                      "metadataSettings.bangumiAccessToken",
                                  },
                                ],
                                staticClass: "long-input",
                                attrs: { type: "text" },
                                domProps: {
                                  value:
                                    _vm.metadataSettings.bangumiAccessToken,
                                },
                                on: {
                                  blur: _vm.bangumiTokenBlur,
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "bangumiAccessToken",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("语言 ISO"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.metadataSettings.languageISO,
                                    expression: "metadataSettings.languageISO",
                                  },
                                ],
                                staticClass: "rightbutton",
                                attrs: { type: "text" },
                                domProps: {
                                  value: _vm.metadataSettings.languageISO,
                                },
                                on: {
                                  blur: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.languageISO || "zh",
                                      "languageISO"
                                    )
                                  },
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "languageISO",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("出版社"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.metadataSettings.publisher,
                                    expression: "metadataSettings.publisher",
                                  },
                                ],
                                staticClass: "long-input",
                                attrs: { type: "text" },
                                domProps: {
                                  value: _vm.metadataSettings.publisher,
                                },
                                on: {
                                  blur: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.publisher,
                                      "publisher"
                                    )
                                  },
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "publisher",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { title: "追更", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("打开页面自动检查"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "followSettings",
                                      _vm.followSettings.autoCheckOnLoad,
                                      "autoCheckOnLoad"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.followSettings.autoCheckOnLoad,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.followSettings,
                                      "autoCheckOnLoad",
                                      $$v
                                    )
                                  },
                                  expression: "followSettings.autoCheckOnLoad",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "避免频繁请求，单位分钟",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("检查冷却时间"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.followSettings.checkCooldownMinutes,
                                    expression:
                                      "followSettings.checkCooldownMinutes",
                                  },
                                ],
                                staticClass: "rightbutton",
                                attrs: {
                                  type: "number",
                                  min: "0",
                                  onkeyup:
                                    "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                },
                                domProps: {
                                  value:
                                    _vm.followSettings.checkCooldownMinutes,
                                },
                                on: {
                                  blur: _vm.followCooldownBlur,
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.followSettings,
                                      "checkCooldownMinutes",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  {
                    attrs: {
                      id: "webpart",
                      title: "原网站阅读样式修改",
                      inset: "",
                    },
                  },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "去除部分漫画网站图片上下间隔",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("图片拼接"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right-start",
                                    "get-container": "#webpart",
                                    offset: [0, 10],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.showPopover = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.showPopover = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.showPopover,
                                    callback: function ($$v) {
                                      _vm.showPopover = $$v
                                    },
                                    expression: "showPopover",
                                  },
                                },
                                [
                                  _c("code", { staticClass: "popovertext" }, [
                                    _vm._v("建议浏览长条漫画时开启"),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: { change: _vm.webImgSplicing },
                                model: {
                                  value: _vm.imgSplicingFlag,
                                  callback: function ($$v) {
                                    _vm.imgSplicingFlag = $$v
                                  },
                                  expression: "imgSplicingFlag",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { title: "自定义规则", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        title: "导入规则",
                        "is-link": "",
                        center: "",
                      },
                      on: {
                        click: function ($event) {
                          return _vm.changeSwipe(1)
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        title: "清空导入的规则",
                        "is-link": "",
                        center: "",
                      },
                      on: {
                        click: function ($event) {
                          return _vm.deleteAllUserWeb()
                        },
                      },
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { id: "otherpart", title: "其他", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        title: "脚本反馈/评分",
                        "is-link": "",
                        center: "",
                      },
                      on: {
                        click: function ($event) {
                          return _vm.jump(
                            "https://greasyfork.org/zh-CN/scripts/447819/feedback"
                          )
                        },
                      },
                    }),
                  ],
                  1
                ),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { attrs: { id: "set-bottom" } },
              [
                _c(
                  "van-button",
                  {
                    style: {
                      width: "120px",
                      background: "#ee000055 !important",
                    },
                    attrs: { size: "small", round: "" },
                    on: { click: _vm.allInit },
                  },
                  [_vm._v("全部重置")]
                ),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c(
            "van-swipe-item",
            {
              staticClass: "swipeitem",
              style: { marginBottom: "15px", cursor: "pointer", flex: 1 },
            },
            [
              _c(
                "div",
                [
                  _c(
                    "div",
                    {
                      attrs: { id: "setup-return" },
                      on: {
                        click: function ($event) {
                          return _vm.changeSwipe(0)
                        },
                      },
                    },
                    [
                      _c("van-icon", { attrs: { name: "arrow-left" } }),
                      _vm._v(" 返回\n        "),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.setupOtherPage === 1 ? _c("import-page") : _vm._e(),
                ],
                1
              ),
            ]
          ),
        ],
        1
      ),
    ],
    1
  )
}
var settingvue_type_template_id_234d1526_scoped_true_staticRenderFns = []
settingvue_type_template_id_234d1526_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/setting.vue?vue&type=template&id=234d1526&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/importPage.vue?vue&type=template&id=3e5333e4&scoped=true&
var importPagevue_type_template_id_3e5333e4_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "import-page" },
    [
      _c("textarea", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.codeText,
            expression: "codeText",
          },
        ],
        ref: "codeTextarea",
        staticStyle: { resize: "none" },
        style: { width: "97%", height: "92%" },
        attrs: { id: "codeTextarea" },
        domProps: { value: _vm.codeText },
        on: {
          input: function ($event) {
            if ($event.target.composing) {
              return
            }
            _vm.codeText = $event.target.value
          },
        },
      }),
      _vm._v(" "),
      _c(
        "van-button",
        { attrs: { size: "mini" }, on: { click: _vm.getCode } },
        [_vm._v("确定")]
      ),
    ],
    1
  )
}
var importPagevue_type_template_id_3e5333e4_scoped_true_staticRenderFns = []
importPagevue_type_template_id_3e5333e4_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/components/importPage.vue?vue&type=template&id=3e5333e4&scoped=true&

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/importPage.vue?vue&type=script&lang=js&
var importPagevue_type_script_lang_js_ = __webpack_require__(555);
;// CONCATENATED MODULE: ./src/components/importPage.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_importPagevue_type_script_lang_js_ = (importPagevue_type_script_lang_js_/* default */.Z); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/importPage.vue?vue&type=style&index=0&id=3e5333e4&lang=less&scoped=true&
var importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_ = __webpack_require__(322);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/importPage.vue?vue&type=style&index=0&id=3e5333e4&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options = {};

importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_/* default */.Z, importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options);




       /* harmony default export */ const components_importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_ = (importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_/* default */.Z && importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_/* default.locals */.Z.locals ? importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/importPage.vue?vue&type=style&index=0&id=3e5333e4&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/components/importPage.vue



;


/* normalize component */

var importPage_component = normalizeComponent(
  components_importPagevue_type_script_lang_js_,
  importPagevue_type_template_id_3e5333e4_scoped_true_render,
  importPagevue_type_template_id_3e5333e4_scoped_true_staticRenderFns,
  false,
  null,
  "3e5333e4",
  null
  
)

/* hot reload */
if (false) { var importPage_api; }
importPage_component.options.__file = "src/components/importPage.vue"
/* harmony default export */ const importPage = (importPage_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/setting.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable no-undef */









/* harmony default export */ const settingvue_type_script_lang_js_ = ({
  name: 'Setting',
  components: {
    importPage: importPage
  },
  data() {
    return {
      appLoadDefault: {
        isShowUI: true,
        loadHotKey: '',
        rightSize: 100,
        centerSize: 100
      },
      appRightSize: 100,
      appCenterSize: 100,
      maxChapterNum: 1,
      maxPictureNum: 2,
      imgIndexBitNum: 3,
      imgDownRange: [1, -1],
      zipNameTemplate: '',
      metadataSettings: { ...metadataSettingsDefault },
      followSettings: {
        autoCheckOnLoad: true,
        checkCooldownMinutes: 30
      },
      imgSplicingFlag: false,
      //
      downTypePopover: false,
      addZeroHint: false,
      imgDownRangeHint: false,
      showPopover: false,
      showUiPopover: false,
      setupOtherPage: 0,

      showDropDown: false,
      downType: 0,
      maxSplicingHeight: 20000,
      splicingHeightPopover: false,
      dropItem: [
        { Text: '直接下载', value: 0 },
        { Text: '压缩下载', value: 1 },
        { Text: '拼接下载', value: 2, hint: '拼接后单张高度不超过 10000 像素' }
      ]

    }
  },
  mounted() {
    this.getAllData()
    this.$bus.$on('changeSetupFirstPage', () => { this.changeSwipe(0) })
  },
  methods: {
    jump(url) {
      window.open(url, '_blank')
    },
    onChangeData(key, value, key2) {
      (0,setup/* setStorage */.po)(key, value, key2)
    },
    changeRightSize(num) {
      if (num === undefined) {
        num = 100
      }
      const appRightDom = document.getElementById('app-right')
      appRightDom.style.scale = num / 100
      this.onChangeData('appLoadDefault', num, 'rightSize')
    },
    changeCenterSize(num) {
      if (num === undefined) {
        num = 100
      }
      const appRightDom = document.getElementById('search-page')
      appRightDom.style.scale = num / 100
      this.onChangeData('appLoadDefault', num, 'centerSize')
    },
    loadHotKeyChange(obj) {
      if (obj.data) {
        this.appLoadDefault.loadHotKey = obj.data.toUpperCase()
        this.onChangeData('appLoadDefault', this.appLoadDefault.loadHotKey, 'loadHotKey')
      }
    },
    webImgSplicing(value) {
      const splicingimgstyle = document.getElementById('splicingimgstyle')
      if (value === true && comics/* currentComics */.Po && comics/* currentComics.readCssText */.Po.readCssText !== undefined) {
        if (splicingimgstyle) {
          splicingimgstyle.innerText = comics/* currentComics.readCssText */.Po.readCssText
        } else {
          (0,utils/* loadStyle */.Xr)('', 'splicingimgstyle', comics/* currentComics.readCssText */.Po.readCssText)
        }
      } else {
        if (splicingimgstyle) {
          splicingimgstyle.innerText = ''
        }
      }
      this.onChangeData('imgSplicingFlag', value)
    },
    changeSwipe(val) {
      console.log('val: ', val)
      this.$refs.swipe2.swipeTo(val)
      this.setupOtherPage = val
    },
    changeDownType(val) {
      if (this.downType !== val) {
        this.downType = val
        this.onChangeData('downType', val)
      }
    },
    splicingHeightBlur(event) {
      const val = event.currentTarget.value
      if (val < 10000) this.maxSplicingHeight = 10000
      if (val > 65530) this.maxSplicingHeight = 65530
      this.onChangeData('maxSplicingHeight', this.maxSplicingHeight)
    },
    imgDownRangeBlur() {
      if (this.imgDownRange[0] < 1) this.imgDownRange[0] = 1
      if (this.imgDownRange[1] > -1) this.imgDownRange[1] = -1
      this.imgDownRange = JSON.parse(JSON.stringify(this.imgDownRange))
      this.onChangeData('imgDownRange', this.imgDownRange)
    },
    followCooldownBlur() {
      let value = parseInt(this.followSettings.checkCooldownMinutes || 0)
      if (Number.isNaN(value) || value < 0) {
        value = 0
      }
      this.followSettings.checkCooldownMinutes = value
      this.onChangeData('followSettings', value, 'checkCooldownMinutes')
    },
    bangumiTokenBlur() {
      this.metadataSettings.bangumiAccessToken = (this.metadataSettings.bangumiAccessToken || '').trim()
      this.onChangeData('metadataSettings', this.metadataSettings.bangumiAccessToken, 'bangumiAccessToken')
    },
    exeFun(flag, basic) {
      let rightSize = 100; let centerSize = 100
      basic.rightSize ? rightSize = basic.rightSize : ''
      basic.rightSize ? this.appRightSize = basic.rightSize : ''
      this.changeRightSize(rightSize)

      basic.centerSize ? centerSize = basic.centerSize : ''
      basic.centerSize ? this.appCenterSize = basic.centerSize : ''
      this.changeCenterSize(centerSize)

      this.webImgSplicing(flag)
    },
    getAllData() {
      try {
        this.maxChapterNum = GM_getValue('maxChapterNum') ?? this.maxChapterNum
        this.maxPictureNum = GM_getValue('maxPictureNum') ?? this.maxPictureNum
        this.downType = GM_getValue('downType') ?? this.downType
        this.maxSplicingHeight = GM_getValue('maxSplicingHeight') ?? this.maxSplicingHeight
        this.imgIndexBitNum = GM_getValue('imgIndexBitNum') ?? this.imgIndexBitNum
        this.imgSplicingFlag = GM_getValue('imgSplicingFlag') ?? this.imgSplicingFlag

        this.imgDownRange = GM_getValue('imgDownRange') ?? this.imgDownRange
        this.zipNameTemplate = GM_getValue('zipNameTemplate') ?? this.zipNameTemplate
        if (this.zipNameTemplate === '[站点名字][作者名][漫画名称][章节名称][多少P]P') {
          this.zipNameTemplate = defaultZipNameTemplate
          this.onChangeData('zipNameTemplate', this.zipNameTemplate)
        }
        this.metadataSettings = {
          ...this.metadataSettings,
          ...(GM_getValue('metadataSettings') || {})
        }
        this.followSettings = {
          ...this.followSettings,
          ...(GM_getValue('followSettings') || {})
        }
        //
        this.appLoadDefault = {
          ...this.appLoadDefault,
          ...(GM_getValue('appLoadDefault') || {})
        }
      // eslint-disable-next-line no-empty
      } catch (error) {}
      // 获取数据后执行其他方法
      this.exeFun(this.imgSplicingFlag, this.appLoadDefault)
    },
    async allInit() {
      external_vant_.Dialog.confirm({
        getContainer: '.card',
        message: '确认重置'
      })
        .then(() => {
          (0,setup/* setinit */.zU)().then((result) => {
            this.getAllData()
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    deleteAllUserWeb() {
      external_vant_.Dialog.confirm({
        getContainer: '.card',
        message: '确认清空'
      })
        .then(() => {
          (0,setup/* setStorage */.po)('userWebInfo', [])
          this.$bus.$emit('getWeb')
        })
        .catch(() => {
          // on cancel
        })
    }
  }
});

;// CONCATENATED MODULE: ./src/views/setting.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_settingvue_type_script_lang_js_ = (settingvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/setting.vue?vue&type=style&index=0&id=234d1526&lang=less&scoped=true&
var settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_ = __webpack_require__(82);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/setting.vue?vue&type=style&index=0&id=234d1526&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options = {};

settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_/* default */.Z, settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options);




       /* harmony default export */ const views_settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_ = (settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_/* default */.Z && settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_/* default.locals */.Z.locals ? settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/setting.vue?vue&type=style&index=0&id=234d1526&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/setting.vue



;


/* normalize component */

var setting_component = normalizeComponent(
  views_settingvue_type_script_lang_js_,
  settingvue_type_template_id_234d1526_scoped_true_render,
  settingvue_type_template_id_234d1526_scoped_true_staticRenderFns,
  false,
  null,
  "234d1526",
  null
  
)

/* hot reload */
if (false) { var setting_api; }
setting_component.options.__file = "src/views/setting.vue"
/* harmony default export */ const setting = (setting_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/down.vue?vue&type=template&id=1e855a88&scoped=true&
var downvue_type_template_id_1e855a88_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "downcontext" } },
    [
      _c(
        "van-collapse",
        {
          model: {
            value: _vm.collapseActiveName,
            callback: function ($$v) {
              _vm.collapseActiveName = $$v
            },
            expression: "collapseActiveName",
          },
        },
        [
          _c(
            "van-collapse-item",
            {
              attrs: { title: "下载中", name: "1" },
              scopedSlots: _vm._u([
                {
                  key: "title",
                  fn: function () {
                    return [
                      _c(
                        "div",
                        { style: { display: "flex", lineHeight: "25px" } },
                        [
                          _vm._v("下载中\n          "),
                          _vm.comicName
                            ? _c("van-tag", { staticClass: "comicnametag1" }, [
                                _vm._v(_vm._s(_vm.comicName)),
                              ])
                            : _vm._e(),
                        ],
                        1
                      ),
                    ]
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _vm._v(" "),
              _c(
                "div",
                { attrs: { id: "downlist" } },
                _vm._l(_vm.queue.worker, function (item, index) {
                  return _c("div", { key: index, staticClass: "downitem" }, [
                    item !== undefined
                      ? _c(
                          "div",
                          [
                            _c("div", { staticClass: "itemname" }, [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v(_vm._s(item.downChapterName)),
                              ]),
                            ]),
                            _vm._v(" "),
                            _c("van-progress", {
                              ref: "progress",
                              refInFor: true,
                              staticStyle: {
                                width: "100%",
                                "margin-top": "10px",
                              },
                              attrs: {
                                percentage: item.progress,
                                "pivot-color": "#66ccff",
                                color:
                                  "linear-gradient(to right, #66ccff22, ##66ccff)",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-divider", {
                              style: {
                                margin: "13px 0px",
                                padding: "0 0px",
                                height: "1px",
                              },
                            }),
                          ],
                          1
                        )
                      : _vm._e(),
                  ])
                }),
                0
              ),
            ]
          ),
          _vm._v(" "),
          _c("van-collapse-item", { attrs: { title: "待下载", name: "2" } }, [
            _c(
              "div",
              { attrs: { id: "downlist" } },
              _vm._l(_vm.queue.list, function (item, index) {
                return _c(
                  "div",
                  { key: index, staticClass: "downitem" },
                  [
                    _c("div", { staticClass: "itemname" }, [
                      _c("span", { staticClass: "custom-title" }, [
                        _vm._v(_vm._s(item.downChapterName)),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("van-divider", {
                      style: {
                        margin: "8px 0px",
                        padding: "0 0px",
                        height: "1px",
                      },
                    }),
                  ],
                  1
                )
              }),
              0
            ),
          ]),
          _vm._v(" "),
          _c(
            "van-collapse-item",
            {
              attrs: { name: "3" },
              scopedSlots: _vm._u([
                {
                  key: "title",
                  fn: function () {
                    return [
                      _c(
                        "div",
                        { style: { display: "flex" } },
                        [
                          _c(
                            "span",
                            { attrs: { title: _vm.currentDomain } },
                            [
                              _vm._v("\n            下载记录\n            "),
                              _c("van-icon", {
                                attrs: { name: "info-o", color: "#adadad" },
                              }),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c("van-icon", {
                            staticStyle: {
                              "line-height": "25px",
                              "margin-left": "10px",
                            },
                            attrs: {
                              name: "delete-o",
                              color: "#EE0000",
                              size: "20",
                            },
                            on: {
                              click: function ($event) {
                                $event.stopPropagation()
                                return _vm.deleteAllHistoryData.apply(
                                  null,
                                  arguments
                                )
                              },
                            },
                          }),
                        ],
                        1
                      ),
                    ]
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _vm._v(" "),
              _c(
                "div",
                { attrs: { id: "downlist" } },
                _vm._l(_vm.historyData, function (item, index) {
                  return _c(
                    "div",
                    { key: index, staticClass: "downitem" },
                    [
                      _c(
                        "div",
                        { staticClass: "itemname" },
                        [
                          _c(
                            "div",
                            { staticStyle: { display: "flex" } },
                            [
                              _c(
                                "van-tag",
                                {
                                  staticClass: "comicnametag",
                                  attrs: { title: item.comicName },
                                  on: {
                                    click: function ($event) {
                                      return _vm.jump(item.comicPageUrl)
                                    },
                                  },
                                },
                                [_vm._v(_vm._s(item.comicName))]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass: "custom-title chapterspan",
                                  class: { hasError: item.hasError },
                                },
                                [_vm._v(_vm._s(item.downChapterName))]
                              ),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c("van-icon", {
                            style: { cursor: "pointer" },
                            attrs: { name: "delete-o", size: "18px" },
                            on: {
                              click: function ($event) {
                                return _vm.deleteHistoryData(index, item.id)
                              },
                            },
                          }),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("van-divider", {
                        style: {
                          margin: "8px 0px",
                          padding: "0 0px",
                          height: "1px",
                        },
                      }),
                    ],
                    1
                  )
                }),
                0
              ),
            ]
          ),
        ],
        1
      ),
    ],
    1
  )
}
var downvue_type_template_id_1e855a88_scoped_true_staticRenderFns = []
downvue_type_template_id_1e855a88_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/down.vue?vue&type=template&id=1e855a88&scoped=true&

;// CONCATENATED MODULE: external "JSZip"
const external_JSZip_namespaceObject = JSZip;
var external_JSZip_default = /*#__PURE__*/__webpack_require__.n(external_JSZip_namespaceObject);
;// CONCATENATED MODULE: ./src/utils/queue.js







// 多个任务并行执行的队列
// https://juejin.cn/post/6844903961728647181

class Queue {
  constructor(workerLen, maxPictureNum, imgIndexBitNum, vue) {
    this.workerLen = workerLen || 3 // 同时执行的任务数
    this.pictureNum = maxPictureNum || 2 // 章节最大下载图片数量
    this.list = [] // 任务队列
    this.worker = new Array(this.workerLen) // 正在执行的任务
    this.workerDownInfo = new Array(this.workerLen) // 存储下载信息
    this.imgIndexBitNum = imgIndexBitNum // 图片序号位数
    this.seriesJsonCache = new Set()
    this.seriesCoverCache = new Set()
    this.Vue = vue
  }

  // 压缩下载方式
  async downloadFile(fileName, content) {
    const url = window.URL.createObjectURL(content)
    await (0,utils/* downFile */.zd)(url, fileName)
    window.URL.revokeObjectURL(url)
  }

  async downloadRemoteFile(fileName, url) {
    if (!url) {
      return false
    }
    return (0,utils/* downFile */.zd)({ url, name: fileName })
  }

  getCoverFileName(url) {
    const match = String(url || '').match(/\.(jpg|jpeg|webp|png|gif|bmp)(?:$|[?#])/i)
    const suffix = match ? match[1].toLowerCase() : 'jpg'
    return `cover.${suffix === 'jpeg' ? 'jpg' : suffix}`
  }

  normalizeImageExtension(suffix) {
    if (!suffix) {
      return 'jpg'
    }
    return suffix.toLowerCase() === 'jpeg' ? 'jpg' : suffix.toLowerCase()
  }

  getCoverExtensionByMimeType(mimeType) {
    if (!mimeType) {
      return 'jpg'
    }
    if (mimeType.includes('png')) return 'png'
    if (mimeType.includes('webp')) return 'webp'
    if (mimeType.includes('gif')) return 'gif'
    if (mimeType.includes('bmp')) return 'bmp'
    return 'jpg'
  }

  dataUrlToBlob(dataUrl) {
    const group = String(dataUrl || '').split(',')
    if (group.length < 2) {
      return null
    }
    const mimeType = (group[0].match(/data:(.*?);base64/) || [])[1] || 'image/jpeg'
    const binary = atob(group[1])
    const len = binary.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return {
      blob: new Blob([bytes], { type: mimeType }),
      extension: this.getCoverExtensionByMimeType(mimeType)
    }
  }

  async fetchImageBlob(workerId, url) {
    if (!url) {
      return null
    }
    const headers = this.worker[workerId].downHeaders || {
      referer: this.worker[workerId].url
    }
    const response = await (0,utils/* request */.WY)({
      method: 'get',
      url,
      responseType: 'blob',
      headers,
      timeout: 60 * 1000
    })
    if (!response || response === 'onerror' || response === 'timeout' || !response.response) {
      return null
    }
    return {
      blob: response.response,
      suffix: this.getSuffix(response.finalUrl || url)
    }
  }

  async writeBookCoverFile(workerId, archiveBasePath) {
    const coverOption = this.worker[workerId].coverOption
    if (!coverOption || coverOption.type === 'first') {
      return
    }

    if (coverOption.type === 'upload' && coverOption.dataUrl) {
      const result = this.dataUrlToBlob(coverOption.dataUrl)
      if (result?.blob) {
        await this.downloadFile(`${archiveBasePath}.${result.extension}`, result.blob)
      }
      return
    }

    if (coverOption.type === 'chapter' && coverOption.imageUrl) {
      let coverData = this.workerDownInfo[workerId].find(item => item.imgurl === coverOption.imageUrl && item.blob !== 1 && item.blob !== 0)
      if (!coverData) {
        coverData = await this.fetchImageBlob(workerId, coverOption.imageUrl)
      }
      if (coverData?.blob) {
        const coverExt = this.normalizeImageExtension(coverData.suffix)
        await this.downloadFile(`${archiveBasePath}.${coverExt}`, coverData.blob)
      }
      return
    }

    if (coverOption.type === 'bangumi' && coverOption.imageUrl) {
      const coverExt = this.normalizeImageExtension(this.getSuffix(coverOption.imageUrl))
      await this.downloadRemoteFile(`${archiveBasePath}.${coverExt}`, coverOption.imageUrl)
    }
  }

  getSeriesCacheKey(worker) {
    return `${worker.webName || ''}_${worker.comicName || ''}`
  }

  shouldPrepareMetadata(worker) {
    const { enableBangumiScrape, enableComicInfoXml, enableSeriesJson, enableSeriesCover } = getMetadataFileFlags()
    if (!enableBangumiScrape) {
      return false
    }
    if (worker.downType === 1 && enableComicInfoXml) {
      return true
    }
    return enableSeriesJson || enableSeriesCover
  }

  prepareWorkerMetadata(worker) {
    if (!this.shouldPrepareMetadata(worker)) {
      return Promise.resolve(null)
    }
    return getBangumiMetadata(worker).catch((error) => {
      console.log('bangumiMetadataError: ', error)
      return null
    })
  }

  async getWorkerMetadata(worker) {
    if (!worker) {
      return null
    }
    if (!worker.metadataPromise) {
      worker.metadataPromise = this.prepareWorkerMetadata(worker)
    }
    return worker.metadataPromise
  }

  async writeSeriesMetadata(worker) {
    const { enableSeriesJson, enableSeriesCover } = getMetadataFileFlags()
    const metadataKey = this.getSeriesCacheKey(worker)
    if (!enableSeriesJson && !enableSeriesCover) {
      return
    }
    const externalMetadata = await this.getWorkerMetadata(worker)

    if (enableSeriesJson && !this.seriesJsonCache.has(metadataKey)) {
      const seriesJson = buildSeriesJson(worker, externalMetadata)
      const jsonBlob = new Blob([seriesJson], { type: 'application/json' })
      await this.downloadFile(worker.comicName + '\\series.json', jsonBlob)
      this.seriesJsonCache.add(metadataKey)
    }

    if (enableSeriesCover && externalMetadata?.coverUrl && !this.seriesCoverCache.has(metadataKey)) {
      const coverFileName = this.getCoverFileName(externalMetadata.coverUrl)
      const result = await this.downloadRemoteFile(worker.comicName + '\\' + coverFileName, externalMetadata.coverUrl)
      if (result) {
        this.seriesCoverCache.add(metadataKey)
      }
    }
  }

  /**
     * 执行一个任务
     * @param { number } index
     */
  async * exeDown(index) {
    const { readtype, downChapterName } = this.worker[index]
    const _this = this

    async function afterDown(index) {
      const { comicName, hasError, comicPageUrl, followItemId, url } = _this.worker[index]
      await _this.writeSeriesMetadata(_this.worker[index])
      if (followItemId && !hasError) {
        clearPendingChapters(followItemId, [url])
      }
      let historyData = localStorage.getItem('ylComicDownHistory') || '[]'
      historyData = JSON.parse(historyData)
      const id = (new Date()).getTime()
      historyData.unshift({ id, comicName, downChapterName, comicPageUrl: comicPageUrl || window.location.href, hasError })
      historyData = JSON.stringify(historyData)
      localStorage.setItem('ylComicDownHistory', historyData)
      _this.Vue.getHistoryData()
      _this.Vue.$bus.$emit('refreshFollowList')
      _this.worker[index] = undefined
      // 休息下？
      setTimeout(() => {
        _this.run()
      }, 2000)
    }

    if (readtype === 1) {
      const { url, isPay } = this.worker[index]
      const processData = { url, isPay }
      let imgs = []
      try {
        imgs = await (0,utils/* getImage */.gJ)(processData)
        const imgDownRange = (0,setup/* getStorage */.cF)('imgDownRange')
        const start = parseInt(imgDownRange[0])
        const end = parseInt(imgDownRange[1])
        if (end === -1) {
          imgs = imgs.slice(start - 1)
        } else {
          imgs = imgs.slice(start - 1, end + 1)
        }
        // eslint-disable-next-line eqeqeq
        imgs == [] ? this.worker[index].hasError = true : ''
        this.worker[index].imgs = imgs
        this.worker[index].totalNumber = imgs.length
      } catch (error) {
        this.worker[index].hasError = true
      }
      yield this.down(index)
        .then(function() {
          afterDown(index)
        })
        //
    } else {
      yield this.down2(index)
        .then(function() {
          afterDown(index)
        })
    }
  }

  /**
     * 添加到任务队列
     * @param { Array<Array<any>> } list: 任务队列
     */
  addList(list) {
    for (const item of list) {
      this.list.unshift(item)
    }
  }

  refresh() {
    this.worker.splice(0, 0)
  }

  // 直接下载图片 Promise
  addImgDownPromise(index, imgurl, imgIndex, newHeaders, retryTimes) {
    const headers = {
      referer: this.worker[index].url
    }
    return new Promise((resolve, reject) => {
      const _this = this
      if (!imgurl) {
        _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
        _this.refresh()
        resolve(false)
      }

      (0,utils/* request */.WY)({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers: newHeaders || headers,
        timeout: 60 * 1000
      }).then((res) => {
        const name = this.worker[index].comicName + '\\' + this.worker[index].downChapterName + '\\' +
        (0,utils/* addZeroForNum */.xo)(imgIndex, this.imgIndexBitNum) + '.'

        let suffix = this.getSuffix(res.finalUrl)

        _this.worker[index].successNum = _this.worker[index].successNum + 1
        _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
        _this.refresh()

        let newurl = ''
        if (res === 'onerror' || res === 'timeout') {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgDownPromise(index, imgurl, imgIndex, newHeaders, ++retryTimes))
          }

          _this.worker[index].hasError = true
          suffix = 'txt'
          const newBlob = new Blob([imgurl], { type: 'text/plain' })
          newurl = window.URL.createObjectURL(newBlob)
        } else {
          newurl = window.URL.createObjectURL(res.response)
        }
        (0,utils/* downFile */.zd)(newurl, name + suffix).then((downRes) => {
          if (downRes) {
            resolve(true)
          } else {
            _this.worker[index].hasError = true
            resolve(false)
          }
        })
      })
    })
  }

  // 请求图片Blob Promise (后用于压缩)
  addImgPromise(index, imgurl, newHeaders, retryTimes) {
    const headers = {
      referer: this.worker[index].url
    }
    return new Promise((resolve, reject) => {
      const _this = this
      if (imgurl === '' || imgurl === undefined) {
        _this.worker[index].hasError = true
        return resolve({
          blob: 1,
          imgurl,
          suffix: '' })
      }

      const suffix = this.getSuffix(imgurl)
      ;(0,utils/* request */.WY)({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers: newHeaders || headers,
        timeout: 60 * 1000,
        onload: function(gmRes) {
          _this.worker[index].successNum = _this.worker[index].successNum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
          _this.refresh()
          resolve({
            blob: gmRes.response,
            imgurl,
            suffix: suffix })
        },
        onerror: function(e) {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgPromise(index, imgurl, newHeaders, ++retryTimes))
          }
          _this.worker[index].hasError = true
          resolve({
            blob: 1,
            imgurl,
            suffix: '' })
        },
        ontimeout: function() {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgPromise(index, imgurl, newHeaders, ++retryTimes))
          }
          resolve({
            blob: 0,
            imgurl,
            suffix: '' })
        }
      })
    })
  }

  /**
     * 下载图片
     * @param { workerId } workerId: 任务id
     */

  // 网站翻页阅读
  async down2(workerId) {
    const { url, downType, totalNumber, isPay, imgIndex, downHeaders } = this.worker[workerId]

    const processData = { url, imgIndex, totalNumber, isPay }
    processData.otherData = this.worker[workerId].otherData

    const { imgUrlArr, nextPageUrl, imgCount, otherData } = await (0,utils/* getImage */.gJ)(processData)
    this.worker[workerId].otherData = otherData

    this.worker[workerId].totalNumber = parseInt(imgCount)
    const beforeDownLen = imgUrlArr.length
    // console.log('下载前', beforeDownLen, imgIndex, totalNumber)

    while (imgUrlArr.length > 0) {
      // eslint-disable-next-line prefer-const
      let promise = []
      for (let index = this.pictureNum; index > 0; index--) {
        if (imgUrlArr[0] === undefined) {
          break
        }
        const imgIndex = ++this.worker[workerId].imgIndex
        if (downType) {
          promise.push(this.addImgPromise(workerId, imgUrlArr[0], downHeaders))
        } else {
          promise.push(this.addImgDownPromise(workerId, imgUrlArr[0], imgIndex, downHeaders))
        }
        imgUrlArr.shift()
      }

      const res = await Promise.all(promise)
      res.forEach(element => {
        this.workerDownInfo[workerId].push(element)
      })
    }

    const newImgIndex = this.worker[workerId].imgIndex
    if (beforeDownLen !== 0 && nextPageUrl !== '' && newImgIndex < parseInt(imgCount)) {
      this.worker[workerId].url = nextPageUrl
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down2(workerId))
        }, 1000)
      })
    } else {
      // 压缩
      if (downType === 1) {
        const result = await this.makeZip(workerId)
        return new Promise((resolve, reject) => {
          resolve(result)
        })
      } else if (downType === 2) { // 拼接
        await this.combineImages(workerId)
        return new Promise((resolve, reject) => {
          resolve()
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(1)
        })
      }
    }
  }

  // 网站卷轴阅读
  async down(workerId) {
    const { imgs, downType, downHeaders } = this.worker[workerId]
    const promise = []
    let len = imgs.length
    let pictureNum = this.pictureNum

    while (pictureNum-- && len > 0) {
      // 是否压缩
      const imgIndex = ++this.worker[workerId].imgIndex
      if (downType) {
        promise.push(this.addImgPromise(workerId, imgs[0], downHeaders))
      } else {
        promise.push(this.addImgDownPromise(workerId, imgs[0], imgIndex, downHeaders))
      }
      this.worker[workerId].imgs.shift()
      len--
    }

    const res = await Promise.all(promise)

    res.forEach(element => {
      this.workerDownInfo[workerId].push(element)
    })

    if (this.worker[workerId].imgs.length > 0) {
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down(workerId))
        }, 1000)
      })
    }

    // 压缩
    if (downType === 1) {
      const result = await this.makeZip(workerId)
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    } else if (downType === 2) { // 拼接
      await this.combineImages(workerId)
      return new Promise((resolve, reject) => {
        resolve()
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(1)
      })
    }
  }

  // 分配并执行任务
  async run() {
    const runIndex = []
    for (let i = 0; i < this.workerLen; i++) {
      const len = this.list.length
      if (!this.worker[i] && len > 0) {
        // 需要执行的任务
        const item = this.list[len - 1]

        const worker = {
          comicName: item.comicName,
          authorName: item.authorName,
          webName: item.webName,
          comicPageUrl: item.comicPageUrl,
          chapterName: item.chapterName,
          chapterNumStr: item.chapterNumStr,
          downChapterName: item.downChapterName,
          url: item.url,
          isPay: item.isPay, // 是否付费章节
          imgIndex: 0, // 图片序号
          successNum: 0, // 下载成功数量
          totalNumber: 0, // 图片总数
          imgs: [],
          progress: 0, // 进度百分比
          readtype: item.readtype, // 阅读(下载)方式类型
          func: this.exeDown(i),
          downType: item.downType, // 下载方式 0：直接  1：压缩  2：拼接
          hasError: false,
          downHeaders: item.downHeaders,
          otherData: undefined, // 自定义存储其他下载数据
          seriesChapterCount: item.seriesChapterCount,
          followItemId: item.followItemId,
          coverOption: item.coverOption,
          metadataPromise: undefined
        }
        worker.metadataPromise = this.prepareWorkerMetadata(worker)
        this.worker[i] = worker
        this.workerDownInfo[i] = []
        this.list.pop()
        runIndex.push(i)
      }
    }
    // 执行任务
    for (const index of runIndex) {
      this.worker[index].func.next()
    }
  }

  getSuffix(url) {
    if (url) {
      const testurl = url.toLowerCase()
      const imgtype = ['jpg', 'jpeg', 'webp', 'png', 'gif', 'bmp', 'tiff', 'svg', 'ico']
      for (let i = 0; i < imgtype.length; i++) {
        const a = testurl.search(imgtype[i])
        if (a !== -1) {
          return imgtype[i]
        }
      }
      // 可能网址没有图片后缀
      return 'jpg'
    }
    return false
  }

  // 压缩
  async makeZip(workerId) {
    const { comicName } = this.worker[workerId]
    const zip = new (external_JSZip_default())()
    const { enableComicInfoXml } = getMetadataFileFlags()
    const externalMetadata = await this.getWorkerMetadata(this.worker[workerId])
    this.workerDownInfo[workerId].forEach((item, index) => {
      const imgblob = item.blob
      const suffix = item.suffix
      if (imgblob === 1 || imgblob === 0) {
        const txtBlob = new Blob([item.imgurl], { type: 'text/plain' })
        zip.file((0,utils/* addZeroForNum */.xo)(index + 1, this.imgIndexBitNum) + '.txt', txtBlob, { blob: true })
        return
      }
      zip.file((0,utils/* addZeroForNum */.xo)(index + 1, this.imgIndexBitNum) + '.' + suffix, imgblob, { blob: true })
    })
    if (enableComicInfoXml) {
      zip.file('ComicInfo.xml', buildComicInfoXml(this.worker[workerId], this.worker[workerId].totalNumber, externalMetadata))
    }

    const zipblob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    })
    const archiveName = buildArchiveName(this.worker[workerId], this.worker[workerId].totalNumber)
    const archiveBasePath = comicName + '\\' + archiveName
    await this.downloadFile(archiveBasePath + '.cbz', zipblob)
    await this.writeBookCoverFile(workerId, archiveBasePath)
    return true
  }

  async combineImages(workerId) {
    const maxSplicingHeight = (0,setup/* getStorage */.cF)('maxSplicingHeight')
    const { comicName, downChapterName } = this.worker[workerId]
    let imgNum = 0
    let curHeight = 0
    let totalHeight = 0
    const saveImg = []
    const _this = this

    async function asyncLoadImg(src) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => {
          const error = new Error(`图片加载失败，url：${src}`)
          console.log('combineImages-e: ', error)
          reject('')
        }
        img.src = src
      })
    }

    async function asyncCanvas(canvas, name) {
      return new Promise((resolve, reject) => {
        canvas.toBlob(async function(imgblob) {
          await _this.downloadFile(name, imgblob)
          resolve()
        }, 'image/jpeg', 0.8)
      })
    }

    for (let index = 0; index < this.workerDownInfo[workerId].length; index++) {
      const data = this.workerDownInfo[workerId][index]
      // 去除不是图片类型
      if (data.blob === 1 || data.blob === 0 || !data.blob.type.includes('image')) {
        this.worker[workerId].hasError = true
        const error_name = comicName + '\\' + downChapterName + '\\error_' + (0,utils/* addZeroForNum */.xo)(index + 1, this.imgIndexBitNum) + '.txt'
        const imgurl = this.workerDownInfo[workerId][index].imgurl
        const newBlob = new Blob([imgurl], { type: 'text/plain' })
        _this.downloadFile(error_name, newBlob)
        continue
      }

      const newurl = window.URL.createObjectURL(data.blob)
      const image = await asyncLoadImg(newurl)
      if (image === '') {
        continue
      }
      if (totalHeight === 0) {
        const obj = { num: imgNum, width: image.width, height: image.height, img: [image] }
        curHeight = image.height
        totalHeight += image.height
        saveImg.push(obj)
        continue
      }
      if (curHeight + image.height > maxSplicingHeight) {
        const newobj = { num: ++imgNum, width: image.width, height: image.height, img: [image] }
        curHeight = image.height
        saveImg.push(newobj)
      } else {
        curHeight += image.height
        saveImg[imgNum].height += image.height
        saveImg[imgNum].img.push(image)
      }
      totalHeight += image.height
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    let offsetY = 0
    for (let i = 0; i < saveImg.length; i++) {
      const item = saveImg[i]
      canvas.width = item.width
      canvas.height = item.height
      offsetY = 0

      for (let len = 0; len < item.img.length; len++) {
        const element = item.img[len]
        context.drawImage(element, 0, offsetY, element.width, element.height)
        offsetY = offsetY + parseInt(element.height)
      }
      const name = comicName + '\\' + downChapterName + '\\' + (0,utils/* addZeroForNum */.xo)(item.num + 1, this.imgIndexBitNum) + '.jpg'
      await asyncCanvas(canvas, name)
    }

    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }
}

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/down.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ const downvue_type_script_lang_js_ = ({
  name: 'Down',
  data() {
    return {
      collapseActiveName: ['1', '2', '3'],
      comicName: null,
      currentDomain: '当前记录 ' + (0,utils/* getdomain */.m1)(),
      queue: {
        'worker': '',
        'list': '',
        'workeredList': ''
      },
      maxChapterNum: 3,
      maxPictureNum: 2,
      imgIndexBitNum: 3,
      historyData: []
    }
  },
  watch: {

  },
  mounted() {
    console.clear()
    this.$bus.$on('selectDown', this.downInit)
  },
  created() {
    this.$bus.$on('getComicName', this.getComicName)
    this.getHistoryData()
  },
  methods: {
    getComicName(value) {
      if (value !== '------') { this.comicName = value }
    },
    downInit(arr) {
      if (this.queue.worker === '') {
        this.maxChapterNum = (0,setup/* getStorage */.cF)('maxChapterNum')
        this.maxPictureNum = (0,setup/* getStorage */.cF)('maxPictureNum')
        this.imgIndexBitNum = (0,setup/* getStorage */.cF)('imgIndexBitNum')
        this.queue = new Queue(this.maxChapterNum, this.maxPictureNum, this.imgIndexBitNum, this)
      }
      this.queue.addList(arr)
      this.queue.run()
    },
    getHistoryData() {
      const data = localStorage.getItem('ylComicDownHistory')
      this.historyData = JSON.parse(data || '[]')
    },
    deleteHistoryData(index, id) {
      this.historyData.splice(index, 1)
      let data = localStorage.getItem('ylComicDownHistory')
      let historyData = JSON.parse(data || '[]')
      historyData = historyData.filter((item) => item.id !== id)
      data = JSON.stringify(historyData)
      localStorage.setItem('ylComicDownHistory', data)
    },
    deleteAllHistoryData() {
      external_vant_.Dialog.confirm({
        getContainer: '.card',
        message: '确认全部删除'
      })
        .then(() => {
          this.historyData.splice(0, this.historyData.length)
          localStorage.setItem('ylComicDownHistory', '[]')
        })
        .catch(() => {
          // on cancel
        })
    },
    jump(url) {
      window.open(url, '_blank')
      // window.location.href = url
    }
  }
});

;// CONCATENATED MODULE: ./src/views/down.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_downvue_type_script_lang_js_ = (downvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/down.vue?vue&type=style&index=0&id=1e855a88&lang=less&scoped=true&
var downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_ = __webpack_require__(240);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/down.vue?vue&type=style&index=0&id=1e855a88&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options = {};

downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_/* default */.Z, downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options);




       /* harmony default export */ const views_downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_ = (downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_/* default */.Z && downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_/* default.locals */.Z.locals ? downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/down.vue?vue&type=style&index=0&id=1e855a88&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/down.vue



;


/* normalize component */

var down_component = normalizeComponent(
  views_downvue_type_script_lang_js_,
  downvue_type_template_id_1e855a88_scoped_true_render,
  downvue_type_template_id_1e855a88_scoped_true_staticRenderFns,
  false,
  null,
  "1e855a88",
  null
  
)

/* hot reload */
if (false) { var down_api; }
down_component.options.__file = "src/views/down.vue"
/* harmony default export */ const down = (down_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/follow.vue?vue&type=template&id=2da631cb&scoped=true&
var followvue_type_template_id_2da631cb_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "follow-page" },
    [
      _c(
        "div",
        { staticClass: "follow-toolbar" },
        [
          _c(
            "van-button",
            {
              attrs: {
                size: "small",
                round: "",
                type: "primary",
                loading: _vm.checking,
              },
              on: { click: _vm.checkAll },
            },
            [_vm._v("检查全部")]
          ),
          _vm._v(" "),
          _c(
            "van-button",
            {
              attrs: {
                size: "small",
                round: "",
                disabled: !_vm.hasPendingChapters,
              },
              on: { click: _vm.downloadAllPending },
            },
            [_vm._v("下载全部更新")]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "follow-keyword-toolbar" },
        [
          _c("van-field", {
            attrs: {
              size: "small",
              placeholder: "输入漫画名，按选中站点搜索追更",
            },
            nativeOn: {
              keyup: function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                ) {
                  return null
                }
                return _vm.searchByKeyword.apply(null, arguments)
              },
            },
            model: {
              value: _vm.keywordFollowName,
              callback: function ($$v) {
                _vm.keywordFollowName = $$v
              },
              expression: "keywordFollowName",
            },
          }),
          _vm._v(" "),
          _c(
            "van-button",
            {
              attrs: {
                size: "small",
                round: "",
                type: "info",
                loading: _vm.addingKeywordFollow,
              },
              on: { click: _vm.searchByKeyword },
            },
            [_vm._v("开始搜索")]
          ),
          _vm._v(" "),
          _c(
            "van-button",
            {
              attrs: { size: "small", round: "", plain: "" },
              on: { click: _vm.toggleScanSitePanel },
            },
            [_vm._v(_vm._s(_vm.showScanSitePanel ? "收起站点" : "扫描站点"))]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _vm.showScanSitePanel
        ? _c(
            "div",
            { staticClass: "follow-site-panel" },
            [
              _c("div", { staticClass: "follow-panel-header" }, [
                _c("span", [_vm._v("扫描站点")]),
                _vm._v(" "),
                _c("span", [
                  _vm._v(
                    _vm._s(_vm.selectedScanWebNames.length) +
                      "/" +
                      _vm._s(_vm.searchableWebOptions.length)
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "follow-site-actions" },
                [
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini" },
                      on: { click: _vm.selectAllScanSites },
                    },
                    [_vm._v("全选")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini" },
                      on: { click: _vm.clearScanSites },
                    },
                    [_vm._v("清空")]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "van-checkbox-group",
                {
                  on: { change: _vm.saveScanSites },
                  model: {
                    value: _vm.selectedScanWebNames,
                    callback: function ($$v) {
                      _vm.selectedScanWebNames = $$v
                    },
                    expression: "selectedScanWebNames",
                  },
                },
                [
                  _c(
                    "div",
                    { staticClass: "follow-site-grid" },
                    _vm._l(_vm.searchableWebOptions, function (item) {
                      return _c(
                        "van-checkbox",
                        {
                          key: item.webName,
                          staticClass: "follow-site-check",
                          attrs: { name: item.webName },
                        },
                        [
                          _vm._v(
                            "\n          " + _vm._s(item.webName) + "\n        "
                          ),
                        ]
                      )
                    }),
                    1
                  ),
                ]
              ),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.searchCandidates.length > 0
        ? _c(
            "div",
            { staticClass: "follow-result-panel" },
            [
              _c("div", { staticClass: "follow-panel-header" }, [
                _c("span", [_vm._v("匹配结果")]),
                _vm._v(" "),
                _c("span", [
                  _vm._v(
                    _vm._s(_vm.selectedCandidateKeys.length) +
                      "/" +
                      _vm._s(_vm.searchCandidates.length)
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "follow-site-actions" },
                [
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini" },
                      on: { click: _vm.selectAllCandidates },
                    },
                    [_vm._v("全选")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini" },
                      on: { click: _vm.clearCandidateSelection },
                    },
                    [_vm._v("清空")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini", type: "primary" },
                      on: { click: _vm.addSelectedCandidates },
                    },
                    [_vm._v("加入选中站点")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini", plain: "" },
                      on: { click: _vm.clearSearchCandidates },
                    },
                    [_vm._v("取消结果")]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "van-checkbox-group",
                {
                  model: {
                    value: _vm.selectedCandidateKeys,
                    callback: function ($$v) {
                      _vm.selectedCandidateKeys = $$v
                    },
                    expression: "selectedCandidateKeys",
                  },
                },
                [
                  _c(
                    "van-cell-group",
                    { attrs: { inset: "" } },
                    _vm._l(_vm.searchCandidates, function (item) {
                      return _c("van-cell", {
                        key: item.key,
                        staticClass: "candidate-cell",
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "title",
                              fn: function () {
                                return [
                                  _c(
                                    "van-checkbox",
                                    { attrs: { name: item.key } },
                                    [_vm._v(_vm._s(item.webName))]
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                            {
                              key: "label",
                              fn: function () {
                                return [
                                  _c(
                                    "div",
                                    { staticClass: "candidate-label" },
                                    [_vm._v(_vm._s(item.comicName))]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "candidate-label candidate-label--sub",
                                    },
                                    [
                                      _vm._v(
                                        "\n              " +
                                          _vm._s(
                                            item.latestChapterName ||
                                              "共 " +
                                                item.seriesChapterCount +
                                                " 话"
                                          ) +
                                          "\n            "
                                      ),
                                    ]
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                            {
                              key: "right-icon",
                              fn: function () {
                                return [
                                  _c(
                                    "van-button",
                                    {
                                      attrs: { size: "mini", plain: "" },
                                      on: {
                                        click: function ($event) {
                                          $event.stopPropagation()
                                          return _vm.openComic(
                                            item.comicPageUrl
                                          )
                                        },
                                      },
                                    },
                                    [_vm._v("打开")]
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      })
                    }),
                    1
                  ),
                ],
                1
              ),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.followList.length === 0
        ? _c("van-empty", { attrs: { description: "追更列表为空" } }, [
            _c("p", { staticClass: "follow-hint" }, [
              _vm._v("在“加载”页点击“加入追更”即可收藏当前漫画。"),
            ]),
          ])
        : _c(
            "div",
            { staticClass: "follow-list" },
            _vm._l(_vm.followList, function (item) {
              return _c(
                "van-cell-group",
                {
                  key: item.id,
                  staticClass: "follow-card",
                  attrs: { inset: "" },
                },
                [
                  _c("van-cell", {
                    attrs: { title: item.comicName, label: item.webName },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "right-icon",
                          fn: function () {
                            return [
                              _c(
                                "van-tag",
                                {
                                  attrs: {
                                    type:
                                      item.pendingChapters.length > 0
                                        ? "danger"
                                        : "primary",
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n            " +
                                      _vm._s(item.pendingChapters.length) +
                                      " 更\n          "
                                  ),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ],
                      null,
                      true
                    ),
                  }),
                  _vm._v(" "),
                  _c("van-field", {
                    attrs: { label: "作者", placeholder: "可手动补充作者名" },
                    on: {
                      blur: function ($event) {
                        return _vm.saveAuthor(item)
                      },
                    },
                    model: {
                      value: item.authorName,
                      callback: function ($$v) {
                        _vm.$set(item, "authorName", $$v)
                      },
                      expression: "item.authorName",
                    },
                  }),
                  _vm._v(" "),
                  _c("van-cell", {
                    attrs: {
                      title: "漫画页",
                      "is-link": "",
                      value: _vm.formatCheckTime(item.lastCheckedAt),
                    },
                    on: {
                      click: function ($event) {
                        return _vm.openComic(item.comicPageUrl)
                      },
                    },
                  }),
                  _vm._v(" "),
                  item.lastError
                    ? _c("van-cell", {
                        attrs: { title: "检查失败: " + item.lastError },
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  item.pendingChapters.length > 0
                    ? _c(
                        "div",
                        { staticClass: "pending-list" },
                        _vm._l(item.pendingChapters, function (chapter) {
                          return _c(
                            "div",
                            { key: chapter.url, staticClass: "pending-item" },
                            [
                              _vm._v(
                                "\n          " +
                                  _vm._s(chapter.chapterName) +
                                  "\n        "
                              ),
                            ]
                          )
                        }),
                        0
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "follow-actions" },
                    [
                      _c(
                        "van-button",
                        {
                          attrs: { size: "mini" },
                          on: {
                            click: function ($event) {
                              return _vm.checkOne(item)
                            },
                          },
                        },
                        [_vm._v("检查")]
                      ),
                      _vm._v(" "),
                      _c(
                        "van-button",
                        {
                          attrs: {
                            size: "mini",
                            type: "primary",
                            disabled: item.pendingChapters.length === 0,
                          },
                          on: {
                            click: function ($event) {
                              return _vm.downloadPending(item)
                            },
                          },
                        },
                        [_vm._v("下载更新")]
                      ),
                      _vm._v(" "),
                      _c(
                        "van-button",
                        {
                          attrs: {
                            size: "mini",
                            disabled: item.pendingChapters.length === 0,
                          },
                          on: {
                            click: function ($event) {
                              return _vm.markHandled(item)
                            },
                          },
                        },
                        [_vm._v("标记已处理")]
                      ),
                      _vm._v(" "),
                      _c(
                        "van-button",
                        {
                          attrs: { size: "mini", type: "danger", plain: "" },
                          on: {
                            click: function ($event) {
                              return _vm.removeItem(item)
                            },
                          },
                        },
                        [_vm._v("删除")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              )
            }),
            1
          ),
    ],
    1
  )
}
var followvue_type_template_id_2da631cb_scoped_true_staticRenderFns = []
followvue_type_template_id_2da631cb_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/follow.vue?vue&type=template&id=2da631cb&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/follow.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ const followvue_type_script_lang_js_ = ({
  name: 'Follow',
  data() {
    return {
      followList: [],
      checking: false,
      keywordFollowName: '',
      addingKeywordFollow: false,
      showScanSitePanel: false,
      searchableWebOptions: [],
      selectedScanWebNames: [],
      searchCandidates: [],
      selectedCandidateKeys: [],
      lastSkippedSiteCount: 0
    }
  },
  computed: {
    hasPendingChapters() {
      return this.followList.some(item => item.pendingChapters.length > 0)
    }
  },
  mounted() {
    this.refreshList()
    this.initSearchableWebOptions()
    this.$bus.$on('refreshFollowList', this.refreshList)
    this.$bus.$on('getComicName', (comicName) => {
      if (!this.keywordFollowName && comicName && comicName !== '------') {
        this.keywordFollowName = comicName
      }
    })
    if (canAutoCheckFollow()) {
      this.autoCheckOnLoad()
    }
  },
  methods: {
    refreshList() {
      this.followList = getFollowList()
    },
    initSearchableWebOptions() {
      this.searchableWebOptions = (0,comics/* getSearchableWebList */.EQ)().map(item => ({
        webName: item.webName
      }))
      const savedWebNames = (0,setup/* getStorage */.cF)('followSearchWebNames') || []
      const defaultWebNames = this.searchableWebOptions.map(item => item.webName)
      const matchedWebNames = defaultWebNames.filter(webName => savedWebNames.includes(webName))
      this.selectedScanWebNames = matchedWebNames.length > 0 ? matchedWebNames : defaultWebNames
      this.saveScanSites()
    },
    saveScanSites() {
      (0,setup/* setStorage */.po)('followSearchWebNames', this.selectedScanWebNames)
    },
    toggleScanSitePanel() {
      this.showScanSitePanel = !this.showScanSitePanel
    },
    selectAllScanSites() {
      this.selectedScanWebNames = this.searchableWebOptions.map(item => item.webName)
      this.saveScanSites()
    },
    clearScanSites() {
      this.selectedScanWebNames = []
      this.saveScanSites()
    },
    formatCheckTime(time) {
      if (!time) {
        return '未检查'
      }
      const date = new Date(time)
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${date.getMonth() + 1}/${date.getDate()} ${hour}:${minute}`
    },
    async autoCheckOnLoad() {
      await this.checkAll(true)
    },
    async searchByKeyword() {
      const keyword = (this.keywordFollowName || '').trim()
      if (keyword.length < 2) {
        (0,external_vant_.Toast)({
          message: '漫画名至少2个字符',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.selectedScanWebNames.length === 0) {
        (0,external_vant_.Toast)({
          message: '请先选择要扫描的站点',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      this.addingKeywordFollow = true
      try {
        const result = await searchFollowCandidatesByKeyword(keyword, this.selectedScanWebNames)
        this.searchCandidates = result.candidates
        this.selectedCandidateKeys = result.candidates.map(item => item.key)
        this.lastSkippedSiteCount = result.skippedSites.length
        const matchCount = result.candidates.length
        const skipCount = result.skippedSites.length
        ;(0,external_vant_.Toast)({
          message: matchCount > 0
            ? `找到 ${matchCount} 个候选站点${skipCount > 0 ? `，未命中 ${skipCount} 个站点` : ''}`
            : '没有找到可加入追更的站点',
          getContainer: '.card',
          position: 'bottom'
        })
      } finally {
        this.addingKeywordFollow = false
      }
    },
    selectAllCandidates() {
      this.selectedCandidateKeys = this.searchCandidates.map(item => item.key)
    },
    clearCandidateSelection() {
      this.selectedCandidateKeys = []
    },
    clearSearchCandidates() {
      this.searchCandidates = []
      this.selectedCandidateKeys = []
      this.lastSkippedSiteCount = 0
    },
    addSelectedCandidates() {
      const selectedCandidates = this.searchCandidates.filter(item => this.selectedCandidateKeys.includes(item.key))
      if (selectedCandidates.length === 0) {
        (0,external_vant_.Toast)({
          message: '请先勾选要保留的站点',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      const skippedSiteCount = this.lastSkippedSiteCount
      const addedItems = addFollowCandidates(selectedCandidates)
      this.refreshList()
      this.clearSearchCandidates()
      ;(0,external_vant_.Toast)({
        message: `已加入 ${addedItems.length} 个站点${skippedSiteCount > 0 ? `，未命中 ${skippedSiteCount} 个站点` : ''}`,
        getContainer: '.card',
        position: 'bottom'
      })
    },
    async checkAll(silent = false) {
      this.checking = true
      try {
        const list = await checkAllFollowItems()
        this.followList = list
        const updateCount = list.reduce((sum, item) => sum + item.pendingChapters.length, 0)
        if (!silent || updateCount > 0) {
          (0,external_vant_.Toast)({
            message: updateCount > 0 ? `发现 ${updateCount} 个待处理章节` : '追更检查完成',
            getContainer: '.card',
            position: 'bottom'
          })
        }
      } finally {
        this.checking = false
      }
    },
    async checkOne(item) {
      const nextItem = await checkFollowItem(item.id)
      this.followList = this.followList.map(current => current.id === item.id ? nextItem : current)
      ;(0,external_vant_.Toast)({
        message: nextItem.pendingChapters.length > 0 ? `发现 ${nextItem.pendingChapters.length} 个更新` : '暂无更新',
        getContainer: '.card',
        position: 'bottom'
      })
    },
    saveAuthor(item) {
      updateFollowItem(item.id, (current) => {
        current.authorName = item.authorName || ''
        return current
      })
      this.refreshList()
    },
    buildDownloadItems(item) {
      const downType = (0,setup/* getStorage */.cF)('downType')
      return item.pendingChapters.map((chapter) => {
        const webRule = (0,comics/* findWebByUrl */.jL)(chapter.url || item.comicPageUrl)
        const downChapterName = chapter.chapterNumStr
          ? `${chapter.chapterNumStr}${chapter.chapterName ? '-' + chapter.chapterName : ''}`
          : chapter.chapterName
        return {
          ...chapter,
          comicName: item.comicName,
          authorName: item.authorName || chapter.authorName || '',
          webName: item.webName,
          comicPageUrl: item.comicPageUrl,
          seriesChapterCount: item.seriesChapterCount,
          followItemId: item.id,
          downChapterName,
          downType,
          downHeaders: webRule?.downHeaders
        }
      })
    },
    downloadPending(item) {
      const downloadItems = this.buildDownloadItems(item)
      if (downloadItems.length === 0) {
        return
      }
      this.$bus.$emit('selectDown', downloadItems)
      this.$bus.$emit('changTab', 3)
    },
    downloadAllPending() {
      const allDownloads = this.followList.flatMap(item => this.buildDownloadItems(item))
      if (allDownloads.length === 0) {
        return
      }
      this.$bus.$emit('selectDown', allDownloads)
      this.$bus.$emit('changTab', 3)
    },
    markHandled(item) {
      clearPendingChapters(item.id)
      this.refreshList()
    },
    removeItem(item) {
      external_vant_.Dialog.confirm({
        getContainer: '.card',
        message: `确认删除 ${item.comicName} ？`
      }).then(() => {
        removeFollowItem(item.id)
        this.refreshList()
      }).catch(() => {})
    },
    openComic(url) {
      window.open(url, '_blank')
    }
  }
});

;// CONCATENATED MODULE: ./src/views/follow.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_followvue_type_script_lang_js_ = (followvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/follow.vue?vue&type=style&index=0&id=2da631cb&lang=less&scoped=true&
var followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_ = __webpack_require__(386);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/follow.vue?vue&type=style&index=0&id=2da631cb&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options = {};

followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_/* default */.Z, followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options);




       /* harmony default export */ const views_followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_ = (followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_/* default */.Z && followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_/* default.locals */.Z.locals ? followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/follow.vue?vue&type=style&index=0&id=2da631cb&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/follow.vue



;


/* normalize component */

var follow_component = normalizeComponent(
  views_followvue_type_script_lang_js_,
  followvue_type_template_id_2da631cb_scoped_true_render,
  followvue_type_template_id_2da631cb_scoped_true_staticRenderFns,
  false,
  null,
  "2da631cb",
  null
  
)

/* hot reload */
if (false) { var follow_api; }
follow_component.options.__file = "src/views/follow.vue"
/* harmony default export */ const follow = (follow_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/search.vue?vue&type=template&id=4ad41bb8&scoped=true&
var searchvue_type_template_id_4ad41bb8_scoped_true_render = function () {
  var this$1 = this
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.showSearchPage,
          expression: "showSearchPage",
        },
      ],
      attrs: { id: "search-page" },
    },
    [
      _c(
        "div",
        { attrs: { id: "search-page-top" } },
        [
          _c("van-sticky", [
            _c(
              "div",
              { staticClass: "search-input-btn" },
              [
                _c("van-loading", {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.showSearchLoad,
                      expression: "showSearchLoad",
                    },
                  ],
                  attrs: { color: "#ee0000", type: "spinner", size: "25" },
                }),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.inputSeachword,
                      expression: "inputSeachword",
                    },
                  ],
                  attrs: { type: "text", name: "searchword" },
                  domProps: { value: _vm.inputSeachword },
                  on: {
                    keyup: function ($event) {
                      if (
                        !$event.type.indexOf("key") &&
                        _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                      ) {
                        return null
                      }
                      return _vm.search(_vm.inputSeachword)
                    },
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.inputSeachword = $event.target.value
                    },
                  },
                }),
                _vm._v(" "),
                _c(
                  "van-button",
                  {
                    attrs: { size: "small" },
                    on: {
                      click: function ($event) {
                        return _vm.search(_vm.inputSeachword)
                      },
                    },
                  },
                  [_vm._v("搜索")]
                ),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c("van-icon", {
            attrs: { id: "close-search-btn", name: "close", color: "#66ccff" },
            on: {
              click: function () {
                this$1.showSearchPage = !this$1.showSearchPage
              },
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { id: "search-page-bottom" } },
        [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.showResult.length !== 0,
                  expression: "showResult.length !== 0",
                },
              ],
            },
            [
              _c(
                "van-collapse",
                {
                  model: {
                    value: _vm.activeNames,
                    callback: function ($$v) {
                      _vm.activeNames = $$v
                    },
                    expression: "activeNames",
                  },
                },
                _vm._l(_vm.showResult, function (item, index) {
                  return _c(
                    "van-collapse-item",
                    {
                      key: index,
                      staticClass: "origin-list",
                      attrs: { title: item.webName, name: index },
                    },
                    [
                      _c(
                        "van-cell-group",
                        {
                          style: {
                            textAlign: "left",
                            background: "rgb(245 245 245 / 33%)",
                            padding: "2px 0",
                          },
                        },
                        _vm._l(item.findres, function (item2, index2) {
                          return _c(
                            "div",
                            {
                              key: index2,
                              staticClass: "origin-image-list",
                              attrs: { title: item2.name },
                              on: {
                                click: function ($event) {
                                  return _vm.toResultWeb(item2.url)
                                },
                              },
                            },
                            [
                              _c("van-image", {
                                attrs: {
                                  width: "100",
                                  height: "150",
                                  src: item2.imageUrl,
                                },
                                on: {
                                  error: function ($event) {
                                    return _vm.loadImgError(item2, item.webName)
                                  },
                                },
                                scopedSlots: _vm._u(
                                  [
                                    {
                                      key: "loading",
                                      fn: function () {
                                        return [
                                          _c("van-loading", {
                                            attrs: {
                                              type: "spinner",
                                              size: "25",
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ],
                                  null,
                                  true
                                ),
                              }),
                              _vm._v(" "),
                              _c("p", [_vm._v(_vm._s(item2.name))]),
                            ],
                            1
                          )
                        }),
                        0
                      ),
                    ],
                    1
                  )
                }),
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c("van-empty", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.showResult.length === 0,
                expression: "showResult.length === 0",
              },
            ],
            attrs: { description: "搜索内容" },
          }),
        ],
        1
      ),
    ]
  )
}
var searchvue_type_template_id_4ad41bb8_scoped_true_staticRenderFns = []
searchvue_type_template_id_4ad41bb8_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/components/search.vue?vue&type=template&id=4ad41bb8&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/search.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ const searchvue_type_script_lang_js_ = ({
  name: 'SearchPage',
  data() {
    return {
      showSearchPage: false,
      inputSeachword: '',
      showSearchLoad: false,
      searchTime: 0,
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      searcKey: '',
      searchInfo: [],
      showResult: [],
      showSearchPart: false
    }
  },
  watch: {
    'searchInfo.length': {
      handler(newLen, oldLen) {
        if (newLen !== oldLen) {
          this.getSearchContent(newLen)
        }
      }
    }
  },
  mounted() {
    this.$bus.$on('showSearchPage', () => { this.showSearchPage = !this.showSearchPage })
  },
  methods: {
    toResultWeb(url) {
      window.open(url, '_blank')
    },
    async loadImgError(item, name) {
      const url = item.imageUrl
      item.imgErrorTime === undefined ? item.imgErrorTime = 0 : ''

      if (item.imgErrorTime !== 1) {
        const blob = await (0,utils/* request */.WY)({
          method: 'get',
          url,
          responseType: 'blob',
          headers: item.headers || '',
          timeout: 10000 })
        const newUrl = window.URL.createObjectURL(blob.response)
        item.imgErrorTime++
        item.imageUrl = newUrl
      }
    },
    getSearchContent(len) {
      const oneWebInfo = this.searchInfo[len - 1]
      this.showResult.push(oneWebInfo)
    },
    async search(keyword) {
      if (keyword.length < 2) {
        (0,external_vant_.Toast)({
          message: '至少2个字符',
          getContainer: '#search-page',
          position: 'center'
        })
        return
      }
      this.searchTime++
      const currentSearchTime = this.searchTime
      this.showSearchLoad = true
      this.showResult = []
      for (let i = 0; i < comics/* comicsWebInfo.length */.Os.length; i++) {
        const item = comics/* comicsWebInfo */.Os[i]
        if (!item.searchTemplate_1 && !item.searchFun) {
          continue
        }

        let findres = []
        if (item.searchTemplate_1) {
          try {
            findres = await (0,comics/* searchFunTemplate_1 */.Ni)(item, keyword)
          } catch (error) {
            (0,external_vant_.Toast)({
              message: item.webName + '\n' + error,
              getContainer: '#search-page',
              position: 'center'
            })
          }
        }

        if (!item.searchTemplate_1 && item.searchFun) {
          try {
            findres = await item.searchFun(keyword)
          } catch (error) {
            (0,external_vant_.Toast)({
              message: item.webName + '\n' + error,
              getContainer: '#search-page',
              position: 'center'
            })
          }
        }

        if (currentSearchTime === this.searchTime) {
          let showLen
          findres.length > 8 ? showLen = 8 : showLen = findres.length
          this.searchInfo.push({
            webName: item.webName,
            findres: findres.slice(0, showLen)
          })
        }
      }
      this.showSearchLoad = false
    }
  }
});

;// CONCATENATED MODULE: ./src/components/search.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_searchvue_type_script_lang_js_ = (searchvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/search.vue?vue&type=style&index=0&id=4ad41bb8&lang=less&scoped=true&
var searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_ = __webpack_require__(655);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/search.vue?vue&type=style&index=0&id=4ad41bb8&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options = {};

searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_/* default */.Z, searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options);




       /* harmony default export */ const components_searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_ = (searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_/* default */.Z && searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_/* default.locals */.Z.locals ? searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/search.vue?vue&type=style&index=0&id=4ad41bb8&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/components/search.vue



;


/* normalize component */

var search_component = normalizeComponent(
  components_searchvue_type_script_lang_js_,
  searchvue_type_template_id_4ad41bb8_scoped_true_render,
  searchvue_type_template_id_4ad41bb8_scoped_true_staticRenderFns,
  false,
  null,
  "4ad41bb8",
  null
  
)

/* hot reload */
if (false) { var search_api; }
search_component.options.__file = "src/components/search.vue"
/* harmony default export */ const search = (search_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//











// import { request, downFile } from './utils/index'

/* harmony default export */ const appvue_type_script_lang_js_ = ({
  name: 'App',
  components: {
    Home: home, Table: table, Cover: cover, Down: down, Follow: follow, Setting: setting, Search: search
  },
  data() {
    return {
      isHide: true,
      showSearchPage: false,
      active: 1,
      titles: ['漫画网站', '加载', '封面', '下载', '追更', '设置'],
      comicInfo: {}
    }
  },
  computed: {
    current: function() {
      return this.active
    }
  },
  watch: {
    active(val) {
      this.$refs.swipe.swipeTo(val)
    }
  },
  created() {
    this.Init()
  },
  mounted() {
    this.$bus.$on('changTab', (val) => { this.active = val })
  },
  methods: {
    hide() {
      this.isHide = !this.isHide
    },
    async Init() {
      (0,comics/* matchWeb */.HL)(window.location.href)
    },

    async test() {
    }
  }
});

;// CONCATENATED MODULE: ./src/app.vue?vue&type=script&lang=js&
 /* harmony default export */ const src_appvue_type_script_lang_js_ = (appvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=less&scoped=true&
var appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_ = __webpack_require__(979);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options = {};

appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_/* default */.Z, appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options);




       /* harmony default export */ const lib_vue_loader_options_src_appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_ = (appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_/* default */.Z && appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_/* default.locals */.Z.locals ? appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=less&scoped=true&

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=1&id=5ef48958&lang=less&scoped=true&
var appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_ = __webpack_require__(502);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=1&id=5ef48958&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options = {};

appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_/* default */.Z, appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options);




       /* harmony default export */ const lib_vue_loader_options_src_appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_ = (appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_/* default */.Z && appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_/* default.locals */.Z.locals ? appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/app.vue?vue&type=style&index=1&id=5ef48958&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/app.vue



;



/* normalize component */

var app_component = normalizeComponent(
  src_appvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "5ef48958",
  null
  
)

/* hot reload */
if (false) { var app_api; }
app_component.options.__file = "src/app.vue"
/* harmony default export */ const app = (app_component.exports);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./src/styles/global_scss.less
var global_scss = __webpack_require__(213);
;// CONCATENATED MODULE: ./src/styles/global_scss.less

      
      
      
      
      
      
      
      
      

var global_scss_options = {};

global_scss_options.styleTagTransform = (styleTagTransform_default());
global_scss_options.setAttributes = (setAttributesWithoutAttributes_default());

      global_scss_options.insert = insertBySelector_default().bind(null, "head");
    
global_scss_options.domAPI = (styleDomAPI_default());
global_scss_options.insertStyleElement = (insertStyleElement_default());

var global_scss_update = injectStylesIntoStyleTag_default()(global_scss/* default */.Z, global_scss_options);




       /* harmony default export */ const styles_global_scss = (global_scss/* default */.Z && global_scss/* default.locals */.Z.locals ? global_scss/* default.locals */.Z.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./src/styles/global.less
var global = __webpack_require__(217);
;// CONCATENATED MODULE: ./src/styles/global.less

      
      
      
      
      
      
      
      
      

var global_options = {};

global_options.styleTagTransform = (styleTagTransform_default());
global_options.setAttributes = (setAttributesWithoutAttributes_default());

      global_options.insert = insertBySelector_default().bind(null, "head");
    
global_options.domAPI = (styleDomAPI_default());
global_options.insertStyleElement = (insertStyleElement_default());

var global_update = injectStylesIntoStyleTag_default()(global/* default */.Z, global_options);




       /* harmony default export */ const styles_global = (global/* default */.Z && global/* default.locals */.Z.locals ? global/* default.locals */.Z.locals : undefined);

// EXTERNAL MODULE: ./src/config/index.js
var config = __webpack_require__(758);
;// CONCATENATED MODULE: ./src/main.js
/* eslint-disable no-undef */












var id = null
var appVm = null
var appLoadDefault = null
var tryLoadTimes = 0
var hasStartedFollowCheck = false
loadMenu(tryLoadTimes)

function loadMenu() {
  tryLoadTimes += 1
  try {
    if (!config/* isDev */.r8) {
      (0,setup/* appLoadinit */.Iq)()
    }
    appLoadDefault = (0,setup/* getStorage */.cF)('appLoadDefault')
    GM_registerMenuCommand(`加载UI (Alt + ${appLoadDefault.loadHotKey})`, openUI)
    GM_registerMenuCommand(`重置所有数据`, setup/* setinit */.zU)
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toUpperCase() === appLoadDefault.loadHotKey.toUpperCase()) {
        openUI(0)
      }
    })
    if (appLoadDefault.isShowUI) {
      openUI(0)
    }
    setTimeout(() => {
      runFollowCheck()
    }, 0)
  } catch (error) {
    console.log('loadError: ', error)
    openUI(tryLoadTimes)
  }
}

async function runFollowCheck() {
  if (hasStartedFollowCheck || config/* isDev */.r8) {
    return
  }
  if (!(0,comics/* findWebByUrl */.jL)(window.location.href)) {
    return
  }
  if (!canAutoCheckFollow()) {
    return
  }
  hasStartedFollowCheck = true
  try {
    await checkAllFollowItems()
  } catch (error) {
    console.log('followCheckError: ', error)
  }
}

async function openUI(times = 0) {
  if (appVm !== null) {
    appVm.isHide = false
    return appVm
  }
  const vm = await loadUI(times)
  if (vm) {
    vm.isHide = false
    appVm = vm
  }
  return vm
}

async function loadUI(times) {
  if (appVm !== null) {
    return appVm
  }

  if (!config/* isDev */.r8) {
    // 首次运行脚本无存储数据，无加载菜单， 重新载入
    if (times === 1) {
      loadMenu()
      return null
    }
  }

  var Vant = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 871, 23))
  // import ('vant/lib/index.css')
  external_Vue_default().use(Vant)

  id = `app_vue_${Date.now()}`
  const root = document.createElement('div')
  root.id = id
  document.body.appendChild(root)
  ;(external_Vue_default()).prototype.$bus = new (external_Vue_default())()
  ;(external_Vue_default()).prototype.$getType = utils/* getType */.oL

  if (config/* isDev */.r8) {
    await (0,utils/* loadStyle2 */.HM)('https://unpkg.com/vant@2.12/lib/index.css')
    return new (external_Vue_default())({
      el: `#${id}`,
      render: h => h(app)
    })
  } else {
  // eslint-disable-next-line no-undef
    GM_addStyle(GM_getResourceText('vantcss'))
    return new (external_Vue_default())({
      el: `#${id}`,
      render: h => h(app)
    })
  }
}

})();

/******/ })()
;